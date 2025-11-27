from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer, MovieCreateSerializer
from rest_framework.permissions import IsAuthenticated

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return MovieCreateSerializer
        return MovieSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movie = serializer.save()

        return Response(MovieSerializer(movie).data, status=status.HTTP_201_CREATED)
    
    def patch(self, request, *args, **kwargs):
        movie = self.get_object()

        if 'favorito' not in request.data:
            return Response(
                {'error': 'Campo "favorito" é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        movie.favorito = request.data['favorito']
        movie.save()