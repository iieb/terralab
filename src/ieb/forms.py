from django import forms
from .models import AtividadeRegistro, Indicador, EquipeProjeto

class AtividadeRegistroForm(forms.ModelForm):
    class Meta:
        model = AtividadeRegistro
        fields = ['projeto', 'componente', 'atividade', 'equipe_projeto', 'data_inicio', 'data_final', 'desafios', 'propostas', 'sucesso', 'melhores_praticas', 'fotos', 'equipe_adicional']
        widgets = {
            'data_inicio': forms.DateInput(attrs={'type': 'date'}),
            'data_final': forms.DateInput(attrs={'type': 'date'}),
            'equipe_adicional': forms.CheckboxSelectMultiple,
        }