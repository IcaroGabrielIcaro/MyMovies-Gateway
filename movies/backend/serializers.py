from rest_framework import serializers
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            'id',
            'nome',
            'diretor',
            'review',
            'genero',
            'nota',
            'data_assistida',
            'duracao',
            'favorito',
            'foto',
            'poster',
            'ano',
            'nacionalidade',
            'id_usuario'
        ]
        read_only_fields = ['id']
