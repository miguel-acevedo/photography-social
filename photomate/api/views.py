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
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action, detail_route
from portfolio.models import Portfolio
from portfolio.serializers import PortfolioSerializer
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .serializers import TokenSerializer

# Get the JWT settings, add these lines after the import/from lines
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

from rest_framework import serializers

class LoginView(generics.CreateAPIView):
    """
    POST auth/login/
    """
    # This permission class will overide the global permission
    # class setting
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    # The tutorial did not include having to define the serializer_class here.
    serializer_class = TokenSerializer

    def post(self, request, *args, **kwargs):
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

class Auth(viewsets.ViewSet):
    IsAuth = (permissions.IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = TokenSerializer

    def list(self, request):
        return Response({"Detail": "Hello"}, status=HTTP_200_OK)

    # Login route allowing new users to login.
    @action(methods=['post'], detail=False)
    def login(self, request):
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
        '''
        /api/auth/register/
        '''
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

class PortfolioView(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    queryset = Portfolio.objects.all()

    # Login route allowing new users to login.
    @action(methods=['post'], detail=False, permission_classes=(permissions.IsAuthenticated,))
    def logout(self, request):
        '''
        /api/auth/logout/
        '''
        request.user.auth_token.delete()
        return Response( status=HTTP_200_OK )
        '''
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # login saves the user’s ID in the session,
            # using Django’s session framework.
            logout(request, user)
            return Response(status=HTTP_200_OK)
        return Response(status=HTTP_401_UNAUTHORIZED)
        '''


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
