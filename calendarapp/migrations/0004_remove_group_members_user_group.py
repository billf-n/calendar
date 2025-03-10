# Generated by Django 5.1.4 on 2025-01-29 01:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendarapp', '0003_remove_user_unique_username_group_remove_user_group_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='members',
        ),
        migrations.AddField(
            model_name='user',
            name='group',
            field=models.ForeignKey(default=21, on_delete=django.db.models.deletion.CASCADE, related_name='members', to='calendarapp.group'),
            preserve_default=False,
        ),
    ]
