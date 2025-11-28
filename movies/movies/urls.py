from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

print("🎯 [DEBUG URLS] Carregando URLs principais...")

schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="API documentation",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include([
        path('', include('backend.urls')),
    ])),
    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
]

print("🎯 [DEBUG URLS] URLs principais configuradas:")
for url in urlpatterns:
    print(f"🎯 [DEBUG URLS] - {url.pattern}")