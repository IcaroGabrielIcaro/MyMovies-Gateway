from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Movie
from .serializers import MovieSerializer

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
