from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer, MovieCreateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
import requests

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    permission_classes = [AllowAny]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print("🎯 [DEBUG] MovieViewSet instanciada")

    def get_serializer_class(self):
        print(f"🎯 [DEBUG] get_serializer_class chamado, action: {self.action}")
        if self.action in ['create']:
            return MovieCreateSerializer
        return MovieSerializer
    
    def create(self, request, *args, **kwargs):
        print(f"\n🎬 [DEBUG CREATE] =====================================")
        print(f"🎬 [DEBUG CREATE] INICIANDO MÉTODO CREATE")

        auth_header = request.headers.get('Authorization', '')
        print(f"🎬 [DEBUG] Authorization Header: {auth_header}")

        if not auth_header:
            print("🎬 [DEBUG] ❌ Token não encontrado no header")
            return Response(
                {'error': 'Token de autenticação é obrigatório.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            print("🎬 [DEBUG] 🔐 Validando token no auth-service...")
            auth_response = requests.post(
                'http://auth-service/auth/validate-token',
                headers={'Authorization': auth_header},
                timeout=5
            )
            print(f"🎬 [DEBUG] 🔐 Resposta do auth-service: {auth_response.status_code}")
            print(f"🎬 [DEBUG] 🔐 Conteúdo da resposta: {auth_response.text}")

            if auth_response.status_code != 200:
                print(f"🎬 [DEBUG] ❌ Token inválido - Status: {auth_response.status_code}")
                return Response(
                    {'error': 'Token de autenticação inválido.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            validation_data = auth_response.json()
            print(f"🎬 [DEBUG] 🔐 Resposta JSON: {validation_data}")
            if not validation_data.get('valid'):
                print("🎬 [DEBUG] ❌ Token marcado como inválido na resposta")
                return Response(
                    {'error': 'Token de autenticação inválido.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            print("🎬 [DEBUG] ✅ Token válido! Continuando...")
            
        except requests.RequestException:
            return Response(
                {'error': 'Erro ao validar o token de autenticação.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        print("🎬 [DEBUG] 📝 Processando dados do filme...")
        print(f"🎬 [DEBUG] 📝 Dados recebidos: {request.data}")

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print(f"🎬 [DEBUG] ❌ Erros de validação: {serializer.errors}")
            return Response(serializer.errors, status=400)

        try:
            print("🎬 [DEBUG] 💾 Salvando filme no banco...")
            movie = serializer.save()
            print(f"🎬 [DEBUG] ✅ Filme salvo: {movie.id}")
            
            response_data = MovieSerializer(movie).data
            print(f"🎬 [DEBUG] 📤 Resposta: {response_data}")
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"🎬 [DEBUG] 💥 Erro inesperado ao salvar: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': 'Erro interno do servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request, *args, **kwargs):
        movie = self.get_object()

        if 'favorito' not in request.data:
            return Response(
                {'error': 'Campo "favorito" é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        movie.favorito = request.data['favorito']
        movie.save()