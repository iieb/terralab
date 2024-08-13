from django import forms
from .models import AtividadeRegistro

class AtividadeRegistroForm(forms.ModelForm):
    class Meta:
        model = AtividadeRegistro
        fields = [
            'projeto', 'componente', 'atividade', 'equipe_projeto',
            'data_inicio', 'data_final', 'desafios', 'propostas',
            'sucesso', 'melhores_praticas', 'fotos', 'equipe_adicional',
            'descricao', 'local', 'comentarios', 'lista_presenca'
        ]
        widgets = {
            'data_inicio': forms.DateInput(attrs={'type': 'date'}),
            'data_final': forms.DateInput(attrs={'type': 'date'}),
            'equipe_adicional': forms.CheckboxSelectMultiple,
            'desafios': forms.TextInput(attrs={'maxlength': 255}),
            'propostas': forms.Textarea(attrs={'maxlength': 255}),
            'sucesso': forms.Textarea(attrs={'maxlength': 255}),
            'melhores_praticas': forms.Textarea(attrs={'maxlength': 255}),
            'descricao': forms.Textarea(attrs={'maxlength': 255}),
            'comentarios': forms.Textarea(attrs={'maxlength': 255}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['projeto'].required = True
        self.fields['componente'].required = True
        self.fields['atividade'].required = True
        self.fields['equipe_projeto'].required = True
        self.fields['data_inicio'].required = True
        self.fields['data_final'].required = True
        self.fields['descricao'].required = True
        self.fields['local'].required = True
        self.fields['fotos'].required = True
        # Não é necessário definir campos não obrigatórios aqui, mas pode ser útil para clareza
        self.fields['desafios'].required = False
        self.fields['propostas'].required = False
        self.fields['sucesso'].required = False
        self.fields['melhores_praticas'].required = False
        self.fields['lista_presenca'].required = False
    def clean(self):
        cleaned_data = super().clean()
        data_inicio = cleaned_data.get('data_inicio')
        data_final = cleaned_data.get('data_final')

        if data_inicio and data_final:
            if data_inicio > data_final:
                self.add_error('data_final', 'A data final não pode ser anterior à data de início.')

        return cleaned_data
