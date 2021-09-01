# Generated by Django 3.1.12 on 2021-09-01 11:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posthog", "0164_person_index_by_team_and_id"),
    ]

    operations = [
        migrations.CreateModel(
            name="GroupTypeMapping",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("type_key", models.CharField(max_length=400)),
                ("type_id", models.IntegerField()),
                ("team", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posthog.team")),
            ],
        ),
        migrations.CreateModel(
            name="GroupMapping",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("type_key", models.CharField(max_length=400)),
                ("key", models.CharField(max_length=400)),
                ("team", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posthog.team")),
            ],
        ),
        migrations.AddConstraint(
            model_name="grouptypemapping",
            constraint=models.UniqueConstraint(
                fields=("team", "type_key", "type_id"), name="unique group types for team"
            ),
        ),
        migrations.AddConstraint(
            model_name="groupmapping",
            constraint=models.UniqueConstraint(
                fields=("team", "type_key", "key"), name="unique key/type pairing for team"
            ),
        ),
    ]
