from django.shortcuts import render
from django.http import HttpResponse
from .models import Portfolio, Image
from django.shortcuts import render, get_object_or_404

# Create your views here.
def index(request):
    return HttpResponse("Welcome to the portfolio site. Register as /signup")

def portfolio(request, id):
    user_portfolio = Portfolio.objects.filter(author__username=id).first()
    images = Image.objects.filter(portfolio=user_portfolio).order_by('-order')
    context = {
        'images': images
    }
    return render(request, 'portfolio/index.html', context)