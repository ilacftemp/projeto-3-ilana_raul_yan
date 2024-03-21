from rest_framework import serializers
from .models import Joke, JokeBoard


class JokeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Joke
        fields = ['id', 'setup', 'delivery', 'user']

class JokeBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = JokeBoard
        fields = ['id', 'setup', 'delivery', 'usuario', 'liked']
        many = True