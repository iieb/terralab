from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from .forms import AtividadeRegistroForm
from .models import Projeto, Componente, Atividade, EquipeProjeto, Indicador

def atividade_registro_view(request):
    if request.method == 'POST':
        form = AtividadeRegistroForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registro de atividade salvo com sucesso!')
            return redirect('atividade_registro')  # Certifique-se de que 'atividade_registro' é uma URL válida
        else:
            messages.error(request, 'Erro ao salvar o registro de atividade. Verifique os campos e tente novamente.')
            print(form.errors)  # Adicione esta linha para imprimir os erros no console do servidor
    else:
        form = AtividadeRegistroForm()

    return render(request, 'atividade_registro_form.html', {
        'form': form,
    })

def load_componentes(request):
    projeto_id = request.GET.get('projeto')
    componentes = Componente.objects.filter(projeto_id=projeto_id).all()
    return JsonResponse(list(componentes.values('id', 'nome')), safe=False)

def load_atividades(request):
    componente_id = request.GET.get('componente')
    atividades = Atividade.objects.filter(componente_id=componente_id).all()
    return JsonResponse(list(atividades.values('id', 'nome')), safe=False)

def load_equipes(request):
    projeto_id = request.GET.get('projeto')
    equipes = EquipeProjeto.objects.filter(projeto_id=projeto_id).all()
    return JsonResponse(list(equipes.values('id', 'equipe__nome')), safe=False)

def load_equipes_adicionais(request):
    projeto_id = request.GET.get('projeto')
    equipes = EquipeProjeto.objects.filter(projeto_id=projeto_id).all()
    return JsonResponse(list(equipes.values('id', 'equipe__nome')), safe=False)