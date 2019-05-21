from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
#from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_401_UNAUTHORIZED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from rest_framework.filters import BaseFilterBackend
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action, detail_route

from portfolio.models import Portfolio, Image
from portfolio.serializers import PortfolioSerializer
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .serializers import TokenSerializer
from django import core
from django.http import JsonResponse
from django.utils import timezone
import coreapi

from django_filters.rest_framework import DjangoFilterBackend
# Get the JWT settings, add these lines after the import/from lines
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import serializers

class SimpleFilterBackend(BaseFilterBackend):
    def get_schema_fields(self, view):
        return [coreapi.Field(
            name='token',
            location='login',
            required=False,
            type='string'
        )]

class Auth(viewsets.ViewSet):
    IsAuth = (permissions.IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = TokenSerializer

    def list(self, request):
        return Response({"Detail": "Hello"}, status=HTTP_200_OK)

    # Login route allowing new users to login.
    @action(methods=['post'], detail=False)
    def login(self, request):
        """
        name: Testing
        """
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # login saves the user’s ID in the session,
            # using Django’s session framework.
            login(request, user)
            serializer_class = TokenSerializer(data={
                # using drf jwt utility functions to generate a token
                "token": jwt_encode_handler(
                    jwt_payload_handler(user)
                )})
            serializer_class.is_valid()
            return Response(serializer_class.data)
        return Response(status=HTTP_401_UNAUTHORIZED)

    # Register route allowing new users to register
    @action(methods=['post'], detail=False)
    def register(self, request):
        # /api/auth/register/
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        if not username and not password and not email:
            return Response(
                data={
                    "message": "username, password and email is required to register a user"
                },
                status=HTTP_400_BAD_REQUEST
            )
        new_user = User.objects.create_user(
            username=username, password=password, email=email
        )
        
        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=False, permission_classes=IsAuth)
    def validate(self, request):
        return Response(status=HTTP_200_OK)

class PortfolioView(viewsets.ViewSet):
    """
    Portfolio.
    """

    serializer_class = PortfolioSerializer
    queryset = Portfolio.objects.all()

    def list(self, request):
        return Response({"Detail": "Hello"}, status=HTTP_200_OK)

    permission_classes=(permissions.IsAuthenticated,)
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    #isAuth = (permissions.IsAuthenticated,)

    class ResponseSerializer(serializers.Serializer):
        name_in_response = serializers.CharField(label='name of response serializer')
    # https://drf-yasg.readthedocs.io/en/stable/custom_spec.html https://github.com/axnsan12/drf-yasg/issues/138
    test_param = openapi.Parameter('test', openapi.IN_QUERY, description="test manual param", type=openapi.TYPE_BOOLEAN)

    @swagger_auto_schema(method='get', manual_parameters=[test_param], responses={200: ResponseSerializer})
    #@swagger_auto_schema(methods=['get'], request_body=ResponseSerializer)
    @action(methods=['get'], detail=False)
    def fetch_portfolios(self, request):
        """
        get:
            User recieves portfolio
            INPUT: No input
        """
        queryset = Portfolio.objects.filter(author__username=request.user.username).values()

        for item in queryset:
            images = Image.objects.filter(portfolio__id=item['id']).values()
            item['images'] = images

        return Response({'data': queryset } , status=HTTP_200_OK, )
    
    @swagger_auto_schema(methods=['post'], request_body=ResponseSerializer)
    @action(methods=['post'], detail=False)
    def create_portfolio(self, request):
        title = request.data.get("title")
        about = request.data.get("about")
        images = request.data.get("images")
        if title is not None and about is not None:
            new = Portfolio(title=title, about=about, pub_date=timezone.now(), author=request.user)
            new.save()
            if images:
                for i, image in enumerate(images):
                    isVisible = image.get('visible', True)
                    new_image = Image(portfolio=new, url=image['url'], caption=image['caption'], order=i, visible=isVisible)
                    new_image.save()
            return Response(status=HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=False)
    def delete_portfolio(self, request):
        """
        param1 -- A first parameter
        param2 -- A second parameter
        """ 
        portfolio_id = request.data.get("portfolio_id")
        if portfolio_id is not None:
            Portfolio.objects.filter(author=request.user, pk=portfolio_id).delete()
            return Response(status=HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=False)
    def delete_image(self, request):
        image_id = request.data.get("image_id")
        if image_id is not None:
            img = Image.objects.filter(pk=image_id).first()
            if img.portfolio.author == request.user:
                img.delete()
            return Response(status=HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)
            

    # Insert image into portfolio.
    @action(methods=['post'], detail=False)
    def create_image(self, request):
        # Takes in a dict of images: 
        # INPUT    'images': []   portfolio_id: INT
        images = request.data.get("images")
        portfolio_id = request.data.get("portfolio_id")
        # Check if there exists a portfolio with the id request and that belongs to the owner.
        port_image_count = Image.objects.filter(portfolio__id=portfolio_id).count()
        if images and portfolio_id is not None and port_image_count is not None:
            for i, image in enumerate(images):
                new_image = Image(portfolio=Portfolio.objects.filter(author=request.user, pk=portfolio_id).first(), url=image['url'], caption=image['caption'], order= i + port_image_count)
                new_image.save()
            return Response(status=HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)

class RegisterUsersView(generics.CreateAPIView):
    """
    POST auth/register/
    """
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        if not username and not password and not email:
            return Response(
                data={
                    "message": "username, password and email is required to register a user"
                },
                status=HTTP_400_BAD_REQUEST
            )
        new_user = User.objects.create_user(
            username=username, password=password, email=email
        )
        return Response(status=status.HTTP_201_CREATED)


class Account(viewsets.ViewSet):
    #permission_classes = (permissions.IsAuthenticated,)

    IsAuth = (permissions.IsAuthenticated,)
    def list(self, request):
        return Response({'token': 'Hello There'}, status=HTTP_200_OK)

    # Login and authenticate login.
    @action(methods=['post'], detail=False)
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'},
                            status=HTTP_404_NOT_FOUND)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=HTTP_200_OK)

    @action(methods=['get'], detail=False, permission_classes=IsAuth)
    def view_username(self, request):
        return Response( {'username': request.user.username }, status=HTTP_200_OK )


'''
    @csrf_exempt
    @api_view(["POST"])
    @permission_classes((AllowAny,))
    def login(request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'},
                            status=HTTP_404_NOT_FOUND)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=HTTP_200_OK)


    @csrf_exempt
    @api_view(["GET"])
    def sample_api(request):
        data = {'username': request.user.username}
        return Response(data, status=HTTP_200_OK)
'''
