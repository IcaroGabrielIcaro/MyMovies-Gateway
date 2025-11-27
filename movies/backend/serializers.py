from rest_framework import serializers
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'nome', 'review', 'nota', 'dataAssistida', 'favorito', 'foto', 'temas', 'ano', 'poster', 'nacionalidade', 'id_usuario']
        read_only_fields = ['id', 'id_usuario']

class MovieCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['nome', 'review', 'nota', 'dataAssistida', 'favorito', 'foto', 'temas', 'ano', 'poster', 'nacionalidade']

    def create(self, validated_data):
        user = self.context['request'].user
        return Movie.objects.create(id_usuario=user.id, **validated_data)