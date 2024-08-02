from django.urls import path
from .views import atividade_registro_view, load_componentes, load_atividades, load_equipes, load_equipes_adicionais

urlpatterns = [
    path('atividade_registro/', atividade_registro_view, name='atividade_registro'),
    path('ajax/load-componentes/', load_componentes, name='load_componentes'),
    path('ajax/load-atividades/', load_atividades, name='load_atividades'),
    path('ajax/load-equipes/', load_equipes, name='load_equipes'),
    path('ajax/load-equipes-adicionais/', load_equipes_adicionais, name='load_equipes_adicionais'),
]