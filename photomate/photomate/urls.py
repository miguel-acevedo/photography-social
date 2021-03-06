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

schema_view = get_swagger_view(title='Photomate API')
from rest_framework.documentation import include_docs_urls

# FOR SWAGGER:
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = DefaultRouter()
router.register('account', Account, base_name='account')
router.register('auth', Auth, base_name='auth')
router.register('portfolio', PortfolioView, base_name='portfolio')

# Use the drf routers and view set when creating regular views?
schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    #path('view/', include('portfolio.urls')),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    url(r'^docs/', include_docs_urls(title='Photomate Api')),
    #url(r'^swagger/$', schema_view),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    url(r'^signup/$', account_views.signup, name='signup'),
]
