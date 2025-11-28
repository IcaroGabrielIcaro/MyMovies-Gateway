from django.urls import path
from .views import MovieViewSet

print("🎯 [DEBUG URLS] Carregando URLs do backend...")

try:
    from backend.views import MovieViewSet
    print("✅ [DEBUG URLS] MovieViewSet importada com sucesso")
except Exception as e:
    print(f"❌ [DEBUG URLS] Erro importando MovieViewSet: {e}")
    raise

urlpatterns = [
    path('movies/', MovieViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('movies/<int:pk>/', MovieViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('movies/<int:pk>/favorito/', MovieViewSet.as_view({'patch': 'patch'})),
]

print("🎯 [DEBUG URLS] URLs do backend configuradas:")
for url in urlpatterns:
    print(f"🎯 [DEBUG URLS] - {url.pattern} -> {url.name}")

print("🎯 [DEBUG URLS] Todas as URLs carregadas com sucesso!")
