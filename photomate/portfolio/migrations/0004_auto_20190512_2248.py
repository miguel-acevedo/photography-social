# Generated by Django 2.2.1 on 2019-05-12 22:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_auto_20190512_2155'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='image_caption',
            new_name='caption',
        ),
        migrations.RenameField(
            model_name='image',
            old_name='image_order',
            new_name='order',
        ),
        migrations.RenameField(
            model_name='image',
            old_name='image_url',
            new_name='url',
        ),
    ]