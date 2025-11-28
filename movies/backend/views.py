from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Movie, Like
from .serializers import MovieSerializer, LikeSerializer, LikeActionSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.all()
        
        nome = self.request.query_params.get('nome')
        diretor = self.request.query_params.get('diretor')
        genero = self.request.query_params.get('genero')
        nacionalidade = self.request.query_params.get('nacionalidade')
        ano = self.request.query_params.get('ano')
        id_usuario = self.request.query_params.get('id_usuario')
        duracao = self.request.query_params.get('duracao')
        favorito = self.request.query_params.get('favorito')

        if nome:
            queryset = queryset.filter(nome__icontains=nome)

        if diretor:
            queryset = queryset.filter(diretor__icontains=diretor)

        if genero:
            queryset = queryset.filter(genero__icontains=genero)

        if nacionalidade:
            queryset = queryset.filter(nacionalidade__icontains=nacionalidade)

        if ano:
            queryset = queryset.filter(ano=ano)

        if id_usuario:
            queryset = queryset.filter(id_usuario=id_usuario)

        if duracao:
            queryset = queryset.filter(duracao=duracao)

        if favorito is not None:
            queryset = queryset.filter(favorito=favorito.lower() == 'true')

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        movie = serializer.save()

        return Response(
            MovieSerializer(movie).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['patch'], url_path='favorito')
    def update_favorito(self, request, pk=None):
        movie = self.get_object()

        if 'favorito' not in request.data:
            return Response(
                {"error": 'Campo "favorito" é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        movie.favorito = request.data['favorito']
        movie.save()

        return Response(
            {"message": "Favorito atualizado com sucesso!", "favorito": movie.favorito},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], url_path='like', serializer_class=LikeActionSerializer)
    def like(self, request, pk=None):
        serializer = LikeActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        movie = self.get_object()
        user_id = serializer.validated_data["id_usuario"]

        like, created = Like.objects.get_or_create(filme=movie, id_usuario=user_id)

        if created:
            return Response({
                "status": "curtido",
                "curtidorId": user_id,
                "filmeId": movie.id,
                "destinatarioId": movie.id_usuario,
                "tipo": "FILME_CURTIDO"
            }, status=status.HTTP_201_CREATED)

        return Response({"status": "já curtido"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='like', serializer_class=LikeActionSerializer)
    def unlike(self, request, pk=None):
        serializer = LikeActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        movie = self.get_object()
        user_id = serializer.validated_data["id_usuario"]

        deleted, _ = Like.objects.filter(filme=movie, id_usuario=user_id).delete()

        if deleted:
            return Response({"status": "descurtido"}, status=status.HTTP_200_OK)

        return Response({"status": "não estava curtido"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='likes', serializer_class=LikeSerializer)
    def get_likes(self, request, pk=None):
        movie = self.get_object()
        likes = movie.likes.all()
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)
