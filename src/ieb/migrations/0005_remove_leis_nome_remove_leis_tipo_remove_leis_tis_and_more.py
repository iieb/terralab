# Generated by Django 5.0.6 on 2024-09-03 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ieb', '0004_remove_atividaderegistroindicador_meta_realizada_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leis',
            name='nome',
        ),
        migrations.RemoveField(
            model_name='leis',
            name='tipo',
        ),
        migrations.RemoveField(
            model_name='leis',
            name='tis',
        ),
        migrations.AddField(
            model_name='leis',
            name='adotado',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='leis',
            name='desenvolvimento',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='leis',
            name='implementado',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='leis',
            name='proposto',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='leis',
            name='total_leis',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
