from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login,logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from rest_framework.decorators import api_view
from .serilizers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import *
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .permissions import IsSupervisor
# Create your views here.

# @csrf_exempt
# def custom_login(request):
#         data = request.POST
#         serializer = UserLoginSerializer(data=data)
#         if serializer.is_valid(raise_exception=True):
#             user = serializer.check_user(data)
#             login(request, user)
#             return JsonResponse({'message':'success'}, status=status.HTTP_200_OK)
#         else:
#             return JsonResponse({"message":'error'}, status=status.HTTP_400_BAD_REQUEST)
# @csrf_exempt
# class UserLogin(APIView):
# 	def post(self, request):
# 		data = request.data
# 		serializer = UserLoginSerializer(data=data)
# 		if serializer.is_valid(raise_exception=True):
# 			user = serializer.check_user(data)
# 			login(request, user)
# 			return Response(serializer.data, status=status.HTTP_200_OK)
class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = request.data
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated,IsSupervisor])
class UserData(generics.ListAPIView):
    queryset=Products.objects.all()
    serializer_class=ProductSerializer
    
    
class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return Response({"value":user.is_authenticated}, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def DepartmentView(request):
    if request.method == 'GET':
        department = Department.objects.all()
        serializer = DepartmentSerializer(department, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def SuggestProjectView(request):
    if request.method == 'GET':
        suggestProject = SuggestionProjects.objects.all()
        serializer = SuggestionProjectsSerializer(suggestProject, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SuggestionProjectsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET', 'POST'])
def ProjectsView(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# @api_view(['GET', 'POST'])
# def RequestsView(request):
#     if request.method == 'GET':
#         requests= Requests.objects.all()
#         serializer = RequestSerializer(requests, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = RequestSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['POST', 'GET', 'PATCH'])
def RequestsView(request):
    if request.method == 'POST':
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        requests = Requests.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        request_id = request.data.get('id')
        decision = request.data.get('status')

        try:
            request_instance = Requests.objects.get(pk=request_id)
        except Requests.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            if decision == 'accepted':
                SuggReq= SuggestionProjects.objects.create(
                    title=request_instance.title,
                    description=request_instance.description,
                    goal=request_instance.goal,
                    department=request_instance.department,
                )
                SuggReq.save()
                request_instance.delete()
            else:
                request_instance.delete()
        except Exception as e:
            # Convert the exception to a string for JSON serialization
            error_message = str(e)
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RequestSerializer(request_instance)
        return Response(serializer.data)
