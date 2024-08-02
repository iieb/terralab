from django import forms
from .models import AtividadeRegistro

class AtividadeRegistroForm(forms.ModelForm):
    class Meta:
        model = AtividadeRegistro
        fields = [
            'projeto', 'componente', 'atividade', 'equipe_projeto',
            'data_inicio', 'data_final', 'desafios', 'propostas',
            'sucesso', 'melhores_praticas', 'fotos', 'equipe_adicional'
        ]
        widgets = {
            'data_inicio': forms.DateInput(attrs={'type': 'date'}),
            'data_final': forms.DateInput(attrs={'type': 'date'}),
            'equipe_adicional': forms.CheckboxSelectMultiple,
            'desafios': forms.Textarea(attrs={'maxlength': 255}),
            'propostas': forms.Textarea(attrs={'maxlength': 255}),
            'sucesso': forms.Textarea(attrs={'maxlength': 255}),
            'melhores_praticas': forms.Textarea(attrs={'maxlength': 255}),
        }

    def clean(self):
        cleaned_data = super().clean()
        data_inicio = cleaned_data.get('data_inicio')
        data_final = cleaned_data.get('data_final')

        if data_inicio and data_final:
            if data_inicio > data_final:
                self.add_error('data_final', 'A data final não pode ser anterior à data de início.')

        return cleaned_data
