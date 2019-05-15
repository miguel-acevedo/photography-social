from rest_framework import serializers
from .models import Portfolio, Image

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ('id', 'intro_text', 'author')