# Generated by Django 5.1.4 on 2025-01-21 02:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendarapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='calendarapp.group'),
        ),
    ]
