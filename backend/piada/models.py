from django.db import models
from django.contrib.auth.models import User


class Joke(models.Model):
    setup = models.TextField(default="Nada")
    delivery = models.TextField(default="Nada também")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class JokeBoard(models.Model):
    setup = models.TextField(default="Sem Setup")
    delivery = models.TextField(default="Sem delivery")
    usuario = models.TextField(default="Anônimo")
    liked = models.ManyToManyField(User, related_name='liked_joke_boards')
    
