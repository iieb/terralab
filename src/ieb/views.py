from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from .forms import AtividadeRegistroForm
from .models import Projeto, Componente, Atividade, EquipeProjeto, Indicador, Meta, AtividadeRegistro, Treinados, Leis, Planos, Capacitados, Organizacao

def atividade_registro_view(request):
    if request.method == 'POST':
        form = AtividadeRegistroForm(request.POST, request.FILES)
        if form.is_valid():
            atividade_registro = form.save()

            # Inicialização das variáveis para capturar os dados
            treinados_data = {'total_pessoas': None, 'homens': None, 'mulheres': None, 'jovens': None, 'foco_treinamento': None}
            leis_data = {'total_leis': 0, 'desenvolvimento': 0, 'proposto': 0, 'adotado': 0, 'implementado': 0}
            planos_data = {'total_planos': 0, 'desenvolvimento': 0, 'proposto': 0, 'adotado': 0, 'implementado': 0}
            capacitados_data = {'organizacoes': [], 'total_organizacoes': 0}

            treinados_exist = leis_exist = planos_exist = capacitados_exist = False

            # Processamento dos campos enviados pelo formulário
            for key, value in request.POST.items():
                if key.startswith('indicadores_'):
                    try:
                        parts = key.split('_')
                        indicador_id = int(parts[1])
                        field_name = '_'.join(parts[2:])
                        indicador = Indicador.objects.get(id=indicador_id)

                        if indicador.nome.lower() == 'treinados':
                            treinados_exist = True
                            if field_name == 'total_pessoas':
                                treinados_data['total_pessoas'] = int(value)
                            elif field_name == 'homens':
                                treinados_data['homens'] = int(value)
                            elif field_name == 'mulheres':
                                treinados_data['mulheres'] = int(value)
                            elif field_name == 'jovens':
                                treinados_data['jovens'] = int(value)
                            elif field_name == 'foco_treinamento':
                                treinados_data['foco_treinamento'] = value

                        elif indicador.nome.lower() == 'leis':
                            leis_exist = True
                            if field_name == 'total_leis':
                                leis_data['total_leis'] = int(value) if value else 0
                            elif field_name == 'desenvolvimento':
                                leis_data['desenvolvimento'] = int(value) if value else 0
                            elif field_name == 'proposto':
                                leis_data['proposto'] = int(value) if value else 0
                            elif field_name == 'adotado':
                                leis_data['adotado'] = int(value) if value else 0
                            elif field_name == 'implementado':
                                leis_data['implementado'] = int(value) if value else 0

                        elif indicador.nome.lower() == 'planos':
                            planos_exist = True
                            if field_name == 'total_planos':
                                planos_data['total_planos'] = int(value) if value else 0
                            elif field_name == 'desenvolvimento':
                                planos_data['desenvolvimento'] = int(value) if value else 0
                            elif field_name == 'proposto':
                                planos_data['proposto'] = int(value) if value else 0
                            elif field_name == 'adotado':
                                planos_data['adotado'] = int(value) if value else 0
                            elif field_name == 'implementado':
                                planos_data['implementado'] = int(value) if value else 0

                        elif indicador.nome.lower() == 'capacitados':
                            capacitados_exist = True
                            if field_name == 'organizacoes':
                                capacitados_data['organizacoes'].extend(request.POST.getlist(key))

                    except (Indicador.DoesNotExist, ValueError) as e:
                        print(f"Erro ao processar o indicador {key}: {e}")
                        continue

            # Salvar dados processados
            if treinados_exist and all(v is not None for v in treinados_data.values()):
                Treinados.objects.create(atividade_registro=atividade_registro, **treinados_data)

            if leis_exist and all(v is not None for v in leis_data.values()):
                Leis.objects.create(atividade_registro=atividade_registro, **leis_data)

            if planos_exist and all(v is not None for v in planos_data.values()):
                Planos.objects.create(atividade_registro=atividade_registro, **planos_data)

            if capacitados_exist and capacitados_data['organizacoes']:
                # Primeiro, salvar a instância de Capacitados para gerar o ID
                capacitados_instance = Capacitados(atividade_registro=atividade_registro)
                capacitados_instance.save()  # Isso gera o ID

                # Agora, podemos adicionar as organizações e salvar novamente
                capacitados_instance.organizacoes.set(capacitados_data['organizacoes'])
                capacitados_instance.total_organizacoes = len(capacitados_data['organizacoes'])
                capacitados_instance.save()  # Salva novamente para atualizar o total_organizacoes

            messages.success(request, 'Registro de atividade salvo com sucesso!')
            return redirect('atividade_registro_detalhe', pk=atividade_registro.pk)
        else:
            messages.error(request, 'Erro ao salvar o registro de atividade. Verifique os campos e tente novamente.')
            print(form.errors)
    else:
        form = AtividadeRegistroForm()

    # Gerar o dicionário de configuração dos indicadores dinamicamente
    organizacoes = Organizacao.objects.all()
    organizacoes_options = [{'value': org.id, 'label': org.nome} for org in organizacoes]

    indicadores_config = {
        "treinados": [
            {"name": "total_pessoas", "type": "number", "label": "Total de Pessoas Treinadas"},
            {"name": "homens", "type": "number", "label": "Homens"},
            {"name": "mulheres", "type": "number", "label": "Mulheres"},
            {"name": "jovens", "type": "number", "label": "Jovens"},
            {"name": "foco_treinamento", "type": "select", "label": "Foco do Treinamento", "options": [
                {"value": "implementacao", "label": "Implementação melhorada/monitoramento/vigilância"},
                {"value": "ativ_prod", "label": "Meios de subsistência/cadeia de valor sustentáveis melhorados"},
                {"value": "governanca", "label": "Fortalecimento institucional/capacitação organizacional/governança"}
            ]}
        ],
        "leis": [
            {"name": "total_leis", "type": "number", "label": "Total de Leis"},
            {"name": "desenvolvimento", "type": "number", "label": "Em Desenvolvimento"},
            {"name": "proposto", "type": "number", "label": "Propostas"},
            {"name": "adotado", "type": "number", "label": "Adotadas"},
            {"name": "implementado", "type": "number", "label": "Implementadas"}
        ],
        "planos": [
            {"name": "total_planos", "type": "number", "label": "Total de Planos"},
            {"name": "desenvolvimento", "type": "number", "label": "Em Desenvolvimento"},
            {"name": "proposto", "type": "number", "label": "Propostas"},
            {"name": "adotado", "type": "number", "label": "Adotadas"},
            {"name": "implementado", "type": "number", "label": "Implementadas"}
        ],
        "capacitados": [
            {"name": "organizacoes", "type": "checkbox", "label": "Organizações", "options": organizacoes_options}
        ]
    }

    return render(request, 'atividade_registro_form.html', {
        'form': form,
        'indicadores_config': indicadores_config  # Passando o dicionário para o template
    })

def load_componentes(request):
    projeto_id = request.GET.get('projeto')
    componentes = Componente.objects.filter(projeto_id=projeto_id).all()
    componente_data = [{'id': componente.id, 'nome': str(componente)} for componente in componentes]
    return JsonResponse(componente_data, safe=False)

def load_atividades(request):
    componente_id = request.GET.get('componente')
    atividades = Atividade.objects.filter(componente_id=componente_id).all()
    atividade_data = [{'id': atividade.id, 'nome': str(atividade)} for atividade in atividades]
    return JsonResponse(atividade_data, safe=False)

def load_equipes(request):
    projeto_id = request.GET.get('projeto')
    equipes = EquipeProjeto.objects.filter(projeto_id=projeto_id).all()
    equipes_data = [{'id': equipe.id, 'nome': str(equipe)} for equipe in equipes]

    return JsonResponse(equipes_data, safe=False)

def load_equipes_adicionais(request):
    projeto_id = request.GET.get('projeto')
    equipes = EquipeProjeto.objects.filter(projeto_id=projeto_id).all()
    return JsonResponse(list(equipes.values('id', 'equipe__nome')), safe=False)

def load_indicadores(request):
    atividade_id = request.GET.get('atividade')
    indicadores = Indicador.objects.filter(meta__atividade_id=atividade_id).distinct()
    data = [{'id': indicador.id, 'nome': indicador.nome} for indicador in indicadores]
    return JsonResponse(data, safe=False)

def atividade_registro_detalhe_view(request, pk):
    # Busca o registro específico com base na chave primária (pk)
    atividade_registro = get_object_or_404(AtividadeRegistro, pk=pk)
    
    # Renderiza o template passando o registro encontrado
    return render(request, 'atividade_registro_detalhe.html', {
        'atividade_registro': atividade_registro
    })