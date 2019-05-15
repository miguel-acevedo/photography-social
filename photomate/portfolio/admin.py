from django.contrib import admin

# Register your models here.
from .models import Portfolio, Image

admin.site.register(Portfolio)
admin.site.register(Image)