# Generated by Django 4.2.7 on 2023-12-06 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_alter_account_profile_photo_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='email',
            field=models.EmailField(default='kasem@gmail.com', max_length=254),
            preserve_default=False,
        ),
    ]
