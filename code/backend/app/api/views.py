from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['university_id'] = user.university_id
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['type']=user.type
        token['groups'] = [group.name for group in user.groups.all()]
        token['profile_photo'] = user.profile_photo.url
        token['email']=user.email
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
    
@api_view(['GET'])
def getRoutes(request):
    routes=[
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)