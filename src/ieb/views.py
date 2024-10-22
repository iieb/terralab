import json

# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from .forms import AtividadeRegistroForm
from .models import Projeto, Componente, Atividade, EquipeProjeto, Indicador, Meta, AtividadeRegistro, Treinados, Leis, Planos, Capacitados, Organizacao, Parceria, Parcerias, Plano, PlanoHistorico

def atividade_registro_view(request):
    if request.method == 'POST':
        form = AtividadeRegistroForm(request.POST, request.FILES)
        if form.is_valid():
            atividade_registro = form.save()

            # Inicialização das variáveis para capturar os dados
            treinados_data = {'total_pessoas': None, 'homens': None, 'mulheres': None, 'jovens': None, 'foco_treinamento': None}
            leis_data = {'total_leis': 0, 'desenvolvimento': 0, 'proposto': 0, 'adotado': 0, 'implementado': 0}
            planos_data = {'nome': '', 'tipo': '', 'situacao': ''}
            capacitados_data = {'organizacoes': [], 'total_organizacoes': 0}
            parcerias_data = {'parcerias': [], 'total_parcerias': 0}  # Adicionar suporte para Parcerias


            treinados_exist = leis_exist = planos_exist = capacitados_exist = parcerias_exist = False

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
                            if field_name == 'nome':
                                planos_data['nome'] = value
                            elif field_name == 'tipo':
                                planos_data['tipo'] = value
                            elif field_name == 'situacao':
                                planos_data['situacao'] = value

                        elif indicador.nome.lower() == 'capacitados':
                            capacitados_exist = True
                            if field_name == 'organizacoes':
                                capacitados_data['organizacoes'].extend(request.POST.getlist(key))

                        elif indicador.nome.lower() == 'parcerias':
                            parcerias_exist = True
                            if field_name == 'parcerias':
                                parcerias_data['parcerias'].extend(request.POST.getlist(key))


                    except (Indicador.DoesNotExist, ValueError) as e:
                        print(f"Erro ao processar o indicador {key}: {e}")
                        continue

            # Salvar dados processados
            if treinados_exist and all(v is not None for v in treinados_data.values()):
                Treinados.objects.create(atividade_registro=atividade_registro, **treinados_data)

            if leis_exist and all(v is not None for v in leis_data.values()):
                Leis.objects.create(atividade_registro=atividade_registro, **leis_data)


            if capacitados_exist and capacitados_data['organizacoes']:
                # Primeiro, salvar a instância de Capacitados para gerar o ID
                capacitados_instance = Capacitados(atividade_registro=atividade_registro)
                capacitados_instance.save()  # Isso gera o ID

                # Agora, podemos adicionar as organizações e salvar novamente
                capacitados_instance.organizacoes.set(capacitados_data['organizacoes'])
                capacitados_instance.total_organizacoes = len(capacitados_data['organizacoes'])
                capacitados_instance.save()  # Salva novamente para atualizar o total_organizacoes

            if parcerias_exist and parcerias_data['parcerias']:
                parcerias_instance = Parcerias(atividade_registro=atividade_registro)
                parcerias_instance.save()
                parcerias_instance.parcerias.set(parcerias_data['parcerias'])
                parcerias_instance.total_parcerias = len(parcerias_data['parcerias'])
                parcerias_instance.save()

            if planos_exist and planos_data['nome'] and planos_data['tipo'] and planos_data['situacao']:
                # Criar um novo plano associado ao registro de atividade
                Plano.objects.create(
                    atividade_registro=atividade_registro,
                    nome=planos_data['nome'],
                    tipo=planos_data['tipo'],
                    situacao=planos_data['situacao']
                )

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

    parcerias = Parceria.objects.all()
    parcerias_options = [{'value': p.id, 'label': f"{p.nome} - {p.tipo}"} for p in parcerias]

    planos = Plano.objects.all()
    planos_options = [{'value': plano.id, 'label': f'{plano.nome} - {plano.tipo} - {plano.situacao}'} for plano in planos]



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
            {"name": "plano", "type": "checkbox", "label": "Planos", "options": planos_options}
        ],
        "capacitados": [
            {"name": "organizacoes", "type": "checkbox", "label": "Organizações", "options": organizacoes_options}
        ],
        "parcerias": [
            {"name": "parcerias", "type": "checkbox", "label": "Parcerias", "options": parcerias_options}
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

def teste_parcerias_view(request):
    parcerias = Parceria.objects.all()
    return render(request, 'teste_parcerias.html', {'parcerias': parcerias})

def adicionar_parceria(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Erro ao processar a solicitação JSON"}, status=400)

        nome = data.get("nome")
        tipo = data.get("tipo")
        if nome and tipo:
            nova_parceria = Parceria.objects.create(nome=nome, tipo=tipo)
            return JsonResponse({"id": nova_parceria.id, "nome": nova_parceria.nome, "tipo": nova_parceria.tipo})
        else:
            return JsonResponse({"error": "Nome e tipo não fornecidos"}, status=400)
    return JsonResponse({"error": "Método não permitido"}, status=405)

def adicionar_plano(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Erro ao processar a solicitação JSON"}, status=400)

        nome = data.get("nome")
        tipo = data.get("tipo")
        situacao = data.get("situacao")
        if nome and tipo and situacao:
            novo_plano = Plano.objects.create(nome=nome, tipo=tipo, situacao=situacao)
            return JsonResponse({"id": novo_plano.id, "nome": novo_plano.nome, "tipo": novo_plano.tipo, "situacao": novo_plano.situacao})
        else:
            return JsonResponse({"error": "Nome, tipo e situação não fornecidos"}, status=400)
    return JsonResponse({"error": "Método não permitido"}, status=405)

def atualizar_situacao_plano(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            plano_id = data.get('plano_id')
            nova_situacao = data.get('situacao')

            plano = get_object_or_404(Plano, id=plano_id)

            # Registrar a alteração no histórico
            PlanoHistorico.objects.create(
                plano=plano,
                situacao_anterior=plano.situacao,
                situacao_nova=nova_situacao,
                usuario=request.user.username  # Se estiver usando autenticação de usuário
            )

            # Atualizar a situação atual do plano
            plano.situacao = nova_situacao
            plano.save()

            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})