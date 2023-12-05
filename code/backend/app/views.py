from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsManager, IsSupervisor
from .firebase import getData, getSingleRow, postData, deleteData
from .validition import validateRequestsData
from .serilizers import *  # Make sure to import your serializers
from rest_framework.parsers import MultiPartParser, FormParser


class UserRegister(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            # Use request.FILES for file handling
            image_file = request.FILES.get('profile_photo')

            # Use serializer.validated_data after checking if it's valid
            clean_data = {
                            'university_id': request.data['university_id'],
                            'first_name': request.data['first_name'],
                            'last_name': request.data['last_name'],
                            'password': request.data['password'],
                        }

            serializer = UserRegisterSerializer(data=clean_data)
            if serializer.is_valid():
                instance = serializer.save()

                # Handle file upload
                if image_file:
                    instance.profile_photo = image_file
                    instance.save()

                return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
            else:
                # Access the 'detail' attribute, not 'error_list'
                return Response({'message': serializer.errors})
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class DepartmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reference = 'department'
        data = getData(reference)
        return Response(data)

    def post(self, request):
        reference = 'department'
        data = postData(reference, request.data)
        return Response(data)

class SuggestProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reference = 'suggestion_projects'
        data = getData(reference)
        return Response(data)

    def post(self, request):
        reference = 'suggestion_projects'
        data = postData(reference, request.data)
        return Response(data)

class DeleteSuggProject(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            deleteData('suggestion_projects', id)
            return Response({'message': 'suggestion project deleted'})
        except Exception as e:
            error_message = str(e)
            return Response({"error": error_message})

class ProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reference = 'projects'
        data = getData(reference)
        return Response(data)

    def post(self, request):
        reference = 'projects'
        data = postData(reference, request.data)
        return Response(data)

class RequestsView(APIView):
    permission_classes = [IsAuthenticated, IsSupervisor | IsManager]

    def get(self, request):
        reference = 'requests'
        data = getData(reference)
        return Response(data)

    def post(self, request):
        reference = 'requests'
        try:
            if validateRequestsData(request.data):
                data = postData(reference, request.data)
                return Response(data, status=status.HTTP_201_CREATED)
            else:
                return Response({'ERROR': "the request has missing fields"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_message = str(e)
            return Response({"error": error_message})

class ManagerRequestsView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        reference = 'requests'
        data = getData(reference)
        return Response(data)

    def patch(self, request):
        reference = 'requests'
        request_id = request.data.get('id')
        decision = request.data.get('status')

        try:
            request_instance = getSingleRow('requests', request_id)
        except Exception:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            if decision == 'accepted':
                if validateRequestsData(request_instance):
                    postData('suggestion_projects', request_instance)
                    deleteData('requests', request_id)
                else:
                    return Response({'ERROR': "invalid data"})
            else:
                deleteData('requests', request_id)
        except Exception as e:
            error_message = str(e)
            return Response({"error": error_message})

        return Response(request_instance)
@api_view(['POST'])
def imageView(request):
    if request.method == 'POST':
        # Pass request.data to instantiate the serializer
        data = ImageSerializer(data=request.data)

        if data.is_valid():
            instance = data.save()
            return Response({'success': 'Image uploaded'})
        else:
            return Response({'failed': 'Something went wrong', 'errors': data.errors})

    return Response({'failed': 'Invalid request method'})