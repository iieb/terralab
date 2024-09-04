# Generated by Django 5.0.6 on 2024-09-02 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ieb', '0002_alter_atividaderegistro_comentarios_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='treinados',
            name='foco_treinamento',
            field=models.CharField(choices=[('tecnico', 'Técnico'), ('comportamental', 'Comportamental'), ('gerencial', 'Gerencial')], default='tecnico', max_length=20),
        ),
        migrations.AddField(
            model_name='treinados',
            name='homens',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='treinados',
            name='jovens',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='treinados',
            name='mulheres',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='treinados',
            name='total_pessoas',
            field=models.PositiveIntegerField(default=0),
        ),
    ]