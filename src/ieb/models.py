from django.db import models

# Create your models here.
from django.utils import timezone

# Create your models here.
# MOVIMENTO INDÍGENA

class OIsRegional(models.Model):
    ois_reg = models.CharField(max_length=255)
    ois_reg_sigla = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=255)
    nome_repr = models.CharField(max_length=255)
    cargo = models.CharField(max_length=255)

    def __str__(self):
        return self.ois_reg_sigla


class OIsLocal(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=255)
    nome_repr = models.CharField(max_length=255)
    cargo_repr = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class OIRegLoc(models.Model):
    oiregional = models.ForeignKey(OIsRegional, on_delete=models.CASCADE)
    oilocal = models.ForeignKey(OIsLocal, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.oiregional.ois_reg} - {self.oilocal.nome}"


class TIs(models.Model):
    nome = models.CharField(max_length=255)
    area = models.FloatField()
    fase = models.CharField(max_length=255)
    etnia = models.CharField(max_length=255)
    municipio = models.CharField(max_length=255)
    uf = models.CharField(max_length=255)
    modalidade = models.CharField(max_length=255)
    oilocal = models.ForeignKey(OIsLocal, on_delete=models.CASCADE)
    cr_id = models.IntegerField()
    dsei_id = models.IntegerField()

    def __str__(self):
        return self.nome


class Aldeia(models.Model):
    nome = models.CharField(max_length=255)
    tis = models.ForeignKey(TIs, on_delete=models.CASCADE)
    populacao = models.IntegerField()
    ano = models.IntegerField()

    def __str__(self):
        return self.nome


class Indigena(models.Model):
    nome = models.CharField(max_length=255)
    etnia = models.CharField(max_length=255)
    genero = models.CharField(max_length=255)
    cpf = models.CharField(max_length=255)
    rg = models.CharField(max_length=255)
    data_nasc = models.DateField()
    aldeia = models.ForeignKey(Aldeia, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome
    

# MOVIMENTO INDÍGENA - IGATI

class IGATI(models.Model):
    tipo = models.CharField(max_length=255)
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class TIsIGATI(models.Model):
    igati = models.ForeignKey(IGATI, on_delete=models.CASCADE)
    tis = models.ForeignKey(TIs, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.igati.nome} - {self.tis.nome}"



# GESTÃO DE PROJETOS - FINANCIADORES/INTITUIÇÕES

class Financiador(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.sigla


class Instituicao(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Equipe(models.Model):
    nome = models.CharField(max_length=255)
    cargo = models.CharField(max_length=255)
    cpf = models.CharField(max_length=255)
    instituicao = models.ForeignKey(Instituicao, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome

# GESTÃO DE PROJETOS - PROJETOS/COMPONENTES/ATIVIDADES/EQUIPE

class Projeto(models.Model):
    nome = models.CharField(max_length=255)
    nome_fant = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Componente(models.Model):
    nome = models.CharField(max_length=255)
    codigo = models.CharField(max_length=255)
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE)
    instituicao = models.ForeignKey(Instituicao, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class Atividade(models.Model):
    nome = models.CharField(max_length=255)
    codigo = models.CharField(max_length=255)
    descricao = models.CharField(max_length=255)
    componente = models.ForeignKey(Componente, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class EquipeProjeto(models.Model):
    equipe = models.ForeignKey(Equipe, on_delete=models.CASCADE)
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.equipe.nome} - {self.projeto.nome}"


class ProjetoOI(models.Model):
    oilocal = models.ForeignKey(OIsLocal, on_delete=models.CASCADE)
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.oilocal.nome} - {self.projeto.nome}"


class ProjetoTI(models.Model):
    tis = models.ForeignKey(TIs, on_delete=models.CASCADE)
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tis.nome} - {self.projeto.nome}"


# GESTÃO DE PROJETOS - INDICADORES/METAS/REGISTROS

class Indicador(models.Model):
    nome = models.CharField(max_length=255)
    codigo = models.CharField(max_length=255)
    descricao = models.CharField(max_length=255)
    reporte = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Meta(models.Model):
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE)
    indicador = models.ForeignKey(Indicador, on_delete=models.CASCADE)
    base = models.FloatField()
    meta = models.FloatField()
    data = models.DateField()

    def __str__(self):
        return f"{self.atividade.nome} - {self.indicador.nome}"


class AtividadeRegistro(models.Model):
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE)
    componente = models.ForeignKey(Componente, on_delete=models.CASCADE)
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE)
    equipe_projeto = models.ForeignKey(EquipeProjeto, on_delete=models.CASCADE)
    equipe_adicional = models.ManyToManyField(EquipeProjeto, related_name='atividades_registradas')
    data_inicio = models.DateField()
    data_final = models.DateField()
    desafios = models.CharField(max_length=255)
    propostas = models.CharField(max_length=255)
    sucesso = models.CharField(max_length=255)
    melhores_praticas = models.CharField(max_length=255)
    fotos = models.ImageField(upload_to='fotos/')  # Usar ImageField para suportar upload de mídia

    def __str__(self):
        return f"{self.projeto.nome} - {self.atividade.nome}"


class AtividadeRegistroIndicador(models.Model):
    atividade_registro = models.ForeignKey(AtividadeRegistro, on_delete=models.CASCADE)
    indicador = models.ForeignKey(Indicador, on_delete=models.CASCADE)
    meta_realizada = models.FloatField()
    data = models.DateField()

    def __str__(self):
        return f"{self.atividade_registro} - {self.indicador.nome}"


class AtividadeRegistroEquipe(models.Model):
    equipe_projeto = models.ForeignKey(EquipeProjeto, on_delete=models.CASCADE)
    atividade_registro = models.ForeignKey(AtividadeRegistro, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.equipe_projeto} - {self.atividade_registro}"

# GESTÃO DE PROJETOS - INDICADORES USAID

class Treinados(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    projeto = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

class FormacaoIndigena(models.Model):
    formacao = models.CharField(max_length=255)
    indigena = models.ForeignKey(Indigena, on_delete=models.CASCADE)

    def __str__(self):
        return self.formacao



class Capacitados(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    projeto = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Planos(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Modelos(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Parcerias(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Produtos(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Contratos(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Leis(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class AreaRestrito(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class AreaDireto(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class AreaDiretoTIs(models.Model):
    areadireto = models.ForeignKey(AreaDireto, on_delete=models.CASCADE)
    tis = models.ForeignKey(TIs, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.areadireto.nome} - {self.tis.nome}"


class AreaGeral(models.Model):
    atividade_registro_indicador = models.ForeignKey(AtividadeRegistroIndicador, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    tis = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class AreaGeralTIs(models.Model):
    areageral = models.ForeignKey(AreaGeral, on_delete=models.CASCADE)
    tis = models.ForeignKey(TIs, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.areageral.nome} - {self.tis.nome}"

# FUNAI

class CR(models.Model):
    nome = models.CharField(max_length=255)
    coordenador = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class CTL(models.Model):
    nome = models.CharField(max_length=255)
    coordenador = models.CharField(max_length=255)
    cr = models.ForeignKey(CR, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


# SAÚDE INDÍGENA

class DSEI(models.Model):
    nome = models.CharField(max_length=255)
    coordenador = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Posto(models.Model):
    nome = models.CharField(max_length=255)
    dsei = models.ForeignKey(DSEI, on_delete=models.CASCADE)
    aldeia = models.ForeignKey(Aldeia, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class Casai(models.Model):
    nome = models.CharField(max_length=255)
    dsei = models.ForeignKey(DSEI, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class Polo(models.Model):
    nome = models.CharField(max_length=255)
    dsei = models.ForeignKey(DSEI, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class AIS(models.Model):
    nome = models.CharField(max_length=255)
    dsei = models.ForeignKey(DSEI, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


# EDUCAÇÃO INDÍGENA

class Escola(models.Model):
    nome = models.CharField(max_length=255)
    esfera = models.CharField(max_length=255)
    aldeia = models.ForeignKey(Aldeia, on_delete=models.CASCADE)
    coordenador = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Professores(models.Model):
    nome = models.CharField(max_length=255)
    escola = models.ForeignKey(Escola, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome