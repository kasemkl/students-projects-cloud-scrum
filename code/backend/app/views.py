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
from .permissions import *
from .firebase import *
from .validition import *


@api_view(['GET', 'POST'])
def DepartmentView(request):
    reference='department'
    if request.method == 'GET':
        data = getData(reference)
        return Response(data)

    elif request.method == 'POST':
        data=postData(reference,request.data)
        return Response(data)


@api_view(['GET', 'POST','PUT','DELETE'])
def SuggestProjectView(request):
        reference='suggestion_projects'

        if request.method == 'GET':
            data = getData(reference)
            return Response(data)

        elif request.method == 'POST':
            data=postData(reference,request.data)
            return Response(data)
        
@api_view(['GET', 'POST','PUT','DELETE'])
def DeleteSuggProject(request,id):    
        try:
            deleteData('suggestion_projects',id)
            return Response({'message':'suggestion project deleted'})
        except Exception as e:
            # Convert the exception to a string for JSON serialization
            error_message = str(e)
            return Response({"error": error_message})
        
@api_view(['GET', 'POST'])
def ProjectsView(request):
    reference='projects'

    if request.method == 'GET':
        data = getData(reference)
        return Response(data)

    elif request.method == 'POST':
        data=postData(reference,request.data)
        return Response(data)
        
@api_view([ 'POST','GET'])
@permission_classes([IsSupervisor | IsManager])    
def RequestsView(request):
    reference='requests'
    
    if request.method == 'GET':
        data = getData(reference)
        return Response(data)

    elif request.method == 'POST':
        try:
            if validateRequestsData(request.data):
                data=postData(reference,request.data)
                return Response(data,status=status.HTTP_201_CREATED)
            else:
                return Response({'ERROR':"the request has missing fields"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Convert the exception to a string for JSON serialization
            error_message = str(e)
            return Response({"error": error_message})
@api_view([ 'GET', 'PATCH'])
@permission_classes([IsManager])
def ManagerRequestsView(request):
    reference='requests'
    
    if request.method == 'GET':
        data = getData(reference)
        return Response(data)

    elif request.method == 'PATCH':
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
                    deleteData('requests', request_id)# Corrected function name
                else:
                    return Response({'ERROR':"invaild data"})
            else:
                deleteData('requests', request_id)  # Corrected function name
        except Exception as e:
            # Convert the exception to a string for JSON serialization
            error_message = str(e)
            return Response({"error": error_message})

        return Response(request_instance)