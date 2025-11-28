from django.urls import path
from .views import MovieViewSet

urlpatterns = [
    path('movies/', MovieViewSet.as_view({'get': 'list', 'post': 'create'}), name='movie-list-create'),
    path('movies/<int:pk>/', MovieViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='movie-detail'),
    path('movies/<int:pk>/favorito/', MovieViewSet.as_view({'patch': 'update_favorito'}), name='movie-update-favorito'),
    path('movies/<int:pk>/like/', MovieViewSet.as_view({'post': 'like', 'delete': 'unlike'}), name='movie-like'),
    path('movies/<int:pk>/likes/', MovieViewSet.as_view({'get': 'get_likes'}), name='movie-get-likes'),
]
