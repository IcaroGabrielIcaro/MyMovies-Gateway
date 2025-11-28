# middleware.py - adicione isso
import logging

logger = logging.getLogger(__name__)

class DebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"\n🔍 [MIDDLEWARE] Request recebida: {request.method} {request.path}")
        print(f"🔍 [MIDDLEWARE] Headers: {dict(request.headers)}")
        
        response = self.get_response(request)
        
        print(f"🔍 [MIDDLEWARE] Response: {response.status_code}")
        return response

    def process_exception(self, request, exception):
        print(f"🔍 [MIDDLEWARE] EXCEÇÃO: {exception}")
        import traceback
        traceback.print_exc()
        return None