"""photomate URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# Should there be a seperate app just for handeling the account settings / portfolio.

from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from account import views as account_views
from api.views import Account, RegisterUsersView, Auth, PortfolioView
from django.views.generic.base import TemplateView
from rest_framework_swagger.views import get_swagger_view

from .swagger_schema import SwaggerSchemaView
schema_view = get_swagger_view(title='Photomate API')

router = DefaultRouter()
router.register('account', Account, base_name='account')
router.register('auth', Auth, base_name='auth')
router.register('portfolio', PortfolioView, base_name='portfolio')

# Use the drf routers and view set when creating regular views?

urlpatterns = [
    #path('view/', include('portfolio.urls')),
    url(r'^swagger/$', schema_view),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    url(r'^signup/$', account_views.signup, name='signup'),
]
