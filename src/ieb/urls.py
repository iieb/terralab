from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import atividade_registro_view, load_componentes, load_atividades, load_equipes, load_equipes_adicionais,load_indicadores, atividade_registro_detalhe_view, adicionar_parceria, teste_template_view

urlpatterns = [
    path('atividade_registro/', atividade_registro_view, name='atividade_registro'),
    path('ajax/load-componentes/', load_componentes, name='load_componentes'),
    path('ajax/load-atividades/', load_atividades, name='load_atividades'),
    path('ajax/load-equipes/', load_equipes, name='load_equipes'),
    path('ajax/load-equipes-adicionais/', load_equipes_adicionais, name='load_equipes_adicionais'),
    path('load_indicadores/', load_indicadores, name='load_indicadores'),
    path('atividade/<int:pk>/', atividade_registro_detalhe_view, name='atividade_registro_detalhe'),
    path('adicionar-parceria/', adicionar_parceria, name='adicionar_parceria'),
    path('teste/', teste_template_view, name='teste_template'),


]

