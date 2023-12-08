from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsManager, IsSupervisor
from .firebase import getData, getSingleRow, postData, deleteData,getByID
from .validition import validateRequestsData
from .serilizers import *  # Make sure to import your serializers
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
from django.contrib.auth.hashers import check_password

current_date_time = datetime.now()
date=current_date_time.strftime('%y/%m/%d %I:%M%p')


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
        sender=request.data.get('user_name')
        try:
            request_instance = getSingleRow('requests', request_id)
        except Exception:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            if decision == 'accepted':
                if validateRequestsData(request_instance):
                    postData('suggestion_projects', request_instance)
                    notification={'message':'Your suggestions is approved by the manager',
                                'sender':sender,
                                'receiver_id':int(request_instance['supervisor_id']),
                                'date':date}
                    postData('notifications',notification)
                    deleteData('requests', request_id)
                else:
                    return Response({'ERROR': "invalid data"})
            else:
                deleteData('requests', request_id)
        except Exception as e:
            error_message = str(e)
            return Response({"error": error_message})

        return Response(request_instance)

class Notifications(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,id):
        reference='notifications'
        data=getByID(reference,id)
        return Response(data)
    

class UpdateProfile(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        
        if request.data.get('old_password') and request.data.get('new_password'):
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')

            if not check_password(old_password, request.user.password):
                return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
            
            request.user.set_password(new_password)
            
        if request.data.get('profile_photo'):
            new_profile_photo = request.data.get('profile_photo')
            request.user.profile_photo = new_profile_photo
        
        if request.data.get('email'):
            new_email=request.data.get('email')
            request.user.email=new_email
                
        request.user.save()
        
        return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)


class UserInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = Account.objects.get(university_id=request.user.university_id)
            serializer = UserInfoSerializer(user)
            return Response({'profile_photo_url': serializer.data['profile_photo']})
        except Account.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)
        