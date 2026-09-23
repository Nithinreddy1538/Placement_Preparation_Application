class AllowFramesMiddleware:
    """
    Ensures that PDF study materials and API responses can be displayed 
    inside an <iframe> within the student dashboard without clickjacking / X-Frame-Options blocks.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Remove any restrictive X-Frame-Options header
        if 'X-Frame-Options' in response.headers:
            del response.headers['X-Frame-Options']
        elif 'x-frame-options' in response.headers:
            del response.headers['x-frame-options']
            
        # Allow embedding in frames from localhost / 127.0.0.1
        response.headers['Content-Security-Policy'] = "frame-ancestors *"
        return response

