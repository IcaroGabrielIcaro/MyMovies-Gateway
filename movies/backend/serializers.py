from rest_framework import serializers
from .models import Movie, Like

class LikeActionSerializer(serializers.Serializer):
    id_usuario = serializers.IntegerField()


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'id_usuario', 'filme', 'created_at']
        read_only_fields = ['id']


class MovieSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

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
            'id_usuario',
            'likes_count'
        ]
        read_only_fields = ['id']

    def get_likes_count(self, obj):
        return obj.likes.count()