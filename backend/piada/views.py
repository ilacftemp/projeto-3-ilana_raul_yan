# from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import Http404, HttpResponseForbidden, JsonResponse
from .models import Joke, JokeBoard
from .serializers import JokeSerializer, JokeBoardSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError, PermissionDenied

def index(request):
    return HttpResponse("Nada por aqui...")

@api_view(['GET', 'POST'])
def api_joke(request, joke_id):
    try:
        joke = Joke.objects.get(id=joke_id)
    except Joke.DoesNotExist:
        raise Http404()
    serialized_joke = JokeSerializer(joke)
    return Response(serialized_joke.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def api_favoritas(request):
    try:
        # Tente obter o token dos cabeçalhos
        token = request.headers['Authorization'].split(' ')[1]
    except KeyError:
        # Se não encontrar a chave 'Authorization' nos cabeçalhos, retorne uma resposta de erro
        return Response({"error": "Token not provided in headers"}, status=400)
    user_id = Token.objects.get(key=token).user_id
    user = User.objects.get(id=user_id)
    if request.method == 'POST':
        
        print(token)
        
        print(user)

        joke = Joke()
        new_joke_data = request.data
        joke.setup = new_joke_data['setup']
        joke.delivery = new_joke_data['delivery']
        joke.user = user
        joke.save()
    
    try:
        favs = Joke.objects.filter(user=user)
    except Joke.DoesNotExist:
        raise Http404
    serialized_fav = JokeSerializer(favs, many=True)
    return Response(serialized_fav.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def api_remove(request, joke_id):
    try:
        joke = Joke.objects.get(id=joke_id)
        joke.delete()
    except Joke.DoesNotExist:
        raise Http404
        
    
    return Response({"message": "Joke deleted successfully"})

@api_view(['POST']) # autenticacao
def api_get_token(request):
    try:
        if request.method == 'POST':
            username = request.data['username']
            password = request.data['password']
            print(username, password)
            user = authenticate(username=username, password=password)

            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return JsonResponse({"token":token.key})
            else:
                return HttpResponseForbidden()
    except User.DoesNotExist:
        raise ValidationError({"message": "User does not exist"})
    except User.IsDisabled:
        raise PermissionDenied({"message": "Your account is disabled"})
    except User.is_locked:
        raise PermissionDenied({"message": "Your account is locked"})
    except ValidationError as e:
        return JsonResponse({"message": e.message}, status=400)
    except Exception as e:
        return JsonResponse({"message": "An error occurred"}, status=500)
    
@api_view(['POST'])
def api_user(request):
    if request.method == 'POST':
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']

        existing_user = User.objects.filter(username=username).first() or User.objects.filter(email=email).first()

        if existing_user:
            return JsonResponse({"message": "Username or email already exists"}, status=400)
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            user = authenticate(username=username, password=password)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return JsonResponse({"token":token.key})
            
            return JsonResponse({"message": "User created successfully"}, status=201)
        
        except ValidationError as e:
            return JsonResponse({"message": e.message}, status=400)
        
        except Exception as e:
            return JsonResponse({"message": "An error occurred"}, status=500)
        
    return JsonResponse({"message": "Method not allowed"}, status=405)

@api_view(['GET', 'POST'])
def api_board(request):
    token = request.headers['Authorization'].split(' ')[1]
    user_id = Token.objects.get(key=token).user_id
    user = User.objects.get(id=user_id)

    if request.method == 'POST':
        joke = JokeBoard()
        new_joke_data = request.data
        joke.setup = new_joke_data['setup']
        joke.delivery = new_joke_data['delivery']
        joke.usuario = user
        joke.save()
        return Response(status=204)
    try:
        board = JokeBoard.objects.all()
    except JokeBoard.DoesNotExist:
        raise Http404
    
    serialized_board = JokeBoardSerializer(board, many=True)
    return Response(serialized_board.data)