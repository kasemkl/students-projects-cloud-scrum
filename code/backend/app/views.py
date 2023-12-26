from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsManager, IsSupervisor
from .firebase import getData, getSingleRow, postData, deleteData,getByID,Logging,getDataByID,editDataByID,addStudentRequest,check_if_apply_projects,get_user_projects,get_supervisor_projects
from .validition import validateRequestsData
from .serilizers import *  # Make sure to import your serializers
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
from django.contrib.auth.hashers import check_password

current_date_time = datetime.now()
date=current_date_time.strftime('%Y/%m/%d %I:%M%p')


class UserRegister(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        university_id = request.data['university_id']
        first_name=request.data['first_name']
        last_name=request.data['last_name']
        user_exists = University_students.objects.filter(pk=university_id).exists()
        if not user_exists:
            return Response({'title':'Invalid University ID','message': 'This university id doesnt belong to university please check your university id and try again'}, status=status.HTTP_400_BAD_REQUEST)
        
        if first_name !=user_exists.first_name or last_name !=user_exists.last_name:
            return Response({'title':'Invalid University ID','message': 'The first name or last name does not match with university id .'}, status=status.HTTP_400_BAD_REQUEST)
        
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
                Logging({'action':f"Register new account with university ID={clean_data['university_id']} and first_name={clean_data['first_name']}",'date':date})
                return Response({'title':'Succesful Registration','message': 'Your Account Created Successfuly'}, status=status.HTTP_201_CREATED)
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
        user=request.user.university_id
        reference = 'department'
        data = postData(reference, request.data)
        Logging({'action':f"user with university ID={user} add new department={request.data['department_name']}",
                'data':data,'date':date})
        return Response(data)

class SuggestProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reference = 'suggestion_projects'
        data = getData(reference)
        return Response(data)

    def post(self, request):
        user=request.user.university_id
        reference = 'suggestion_projects'
        data = postData(reference, request.data)
        Logging({'action':f"user with university ID={user} Add new Suggestion project with title={request.data.get('title')}",'date':date})
        return Response(data)

class DeleteSuggProject(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user=request.user.university_id
        try:
            deleteData('suggestion_projects', id)
            Logging({'action':f"user with university ID={user} Delete Suggestion project with id={id}",
                    'date':date})
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
    
    
    
class MyRequestsView(APIView):
    permission_classes=[IsAuthenticated,IsManager | IsSupervisor]
    reference = 'requests'
    def get(self, request):
        user=request.user.university_id
        data = getDataByID(self.reference,'supervisor_id',user)
        return Response(data)
    
    def put(self,request):
        key=request.data.get('id')
        newdata={
            'title':request.data['title'],
            'description':request.data['description'],
            'goal':request.data['goal'],
            'department':request.data['department'],
            'supervisor_id':request.user.university_id,
            'supervisor_name':request.user.first_name}
        editDataByID(self.reference,key,newdata)
        return Response('edit success')
    
class MyRequestDeleteView(APIView):
    permission_classes=[IsAuthenticated]
    reference = 'requests'
    def post(self,request):
        key = request.data.get('id')
        if not key:
            return Response(request.data)
        deleteData(self.reference,key)
        return Response('delete sucess')
    
class RequestsView(APIView):
    permission_classes = [ IsSupervisor | IsManager]

    def post(self, request):
        reference = 'requests'
        user=request.user.university_id
        try:
            if validateRequestsData(request.data):
                data = postData(reference, request.data)
                Logging({'action':f"user with university ID={user} Add new Suggestion project request with title={request.data.get('title')}",
                        'data':data,'date':date})
                return Response({'title':'Request Sent','text': "the request has sent to manager succesfully."}, status=status.HTTP_201_CREATED)
            else:
                return Response({'title':'ERROR','text': "the request has missing fields"}, status=status.HTTP_400_BAD_REQUEST)
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
        user=request.user.university_id
        try:
            request_instance = getSingleRow('requests', request_id)
        except Exception:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            if decision == 'accepted':
                if validateRequestsData(request_instance):
                    data=postData('suggestion_projects', request_instance)
                    notification={'message':'Your suggestions is approved by the manager',
                                'sender':sender,
                                'receiver_id':int(request_instance['supervisor_id']),
                                'date':date}
                    postData('notifications',notification)
                    Logging({"action":f"user with university ID={user} accept Suggestion project request with title={request.data.get('title')}",
                            'data':data,'date':date})
                    deleteData('requests', request_id)
                    
                else:
                    Logging({"action":f"user with university ID={user} delete Suggestion project request with title={request.data.get('title')}",
                            'data':request_instance,'date':date})
                    return Response({'ERROR': "invalid data"})
                return Response({'title': 'Request Approved',
                                'text': 'Request approved successfully.'},
                                status=status.HTTP_200_OK)
            else:
                
                deleteData('requests', request_id)
                return Response({'title': 'Request Deleted',
                                'text': 'Request deleted successfully.'},
                                status=status.HTTP_200_OK)
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
        user=request.user.university_id 
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
        Logging({"action":f"user with university ID={user} update his profile data",'date':date})
        return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)


class UserInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = Account.objects.get(university_id=request.user.university_id)
            serializer = UserInfoSerializer(user)
            return Response(serializer.data)
        except Account.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)
        

class ApplyProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        supervisor = str(request.data.get('supervisor_id'))
        students = data.get('students')
        project_type=request.data.get('project_type')
        
        students_obj = {}
        students_hours={}
        for index, student in enumerate(students):
            # Initialize the student dictionary
            students_obj[str(student)] = {}
            # Use filter instead of get and check if the result is not empty
            student_data = Account.objects.filter(university_id=student).first()
            
            if student_data:
                check_if_apply=check_if_apply_projects('students_requests',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                    
                student_uni_data=University_students.objects.get(university_id=student)
                
                if student_uni_data.number_of_hours<100:
                        return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} does not complete 100 hours.'},
                                status=status.HTTP_200_OK)
                        
                if project_type=='junior':
                    data['project_type']='فصلي'
                    if student_uni_data.application_subject==False:
                        return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} does not complete مادة التطبيقات.'},
                                status=status.HTTP_200_OK)
                        
                if project_type=='graduation1':
                    data['project_type']='تخرج1'
                    if student_uni_data.junior_project==False:
                        return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} does not complete مشروع فصلي.'},
                                status=status.HTTP_200_OK)
                        
                if project_type=='graduation2':
                    data['project_type']='تخرج2'
                    if student_uni_data.graduation1_project==False:
                        return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} does not complete مشروع تخرج 1.'},
                                status=status.HTTP_200_OK)
                        
                students_hours[str(student)]=student_uni_data.number_of_hours
                
                students_obj[str(student)]['name'] = student_data.first_name + ' ' + student_data.last_name
                if index == 0:
                    students_obj[str(student)]['status'] = 'sender'
                else:
                    students_obj[str(student)]['status'] = 'pending'
            else:
                return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} does not have an account \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
        for id1, hours1 in students_hours.items():
            for id2, hours2 in students_hours.items():
                if id1 != id2 and abs(hours1 - hours2) >= 7:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {id1} and Student with ID {id2} have hours difference more than 7 hours.'},
                                status=status.HTTP_200_OK)
        data['students'] = students_obj
        all_accept=all(student_data.get("status") in ['sender'] for student_data in students_obj.values())
        if all_accept:
                for student_data in students_obj.values():
                    student_data.pop("status", None)
                    
                for student_id, student_info in students_obj.items():
                    student_uni_data = University_students.objects.get(university_id=int(student_id))
                    student_info['GPA'] = student_uni_data.GPA
                    
                data['students']=students_obj
                postData('requests_to_supervisors',data)
                return Response({'title': 'Application sent',
                        'text': 'Your application sent successfully. '},
                        status=status.HTTP_201_CREATED)
        # return Response(students)
        send = addStudentRequest(data)
        return Response({'title': 'Application sent',
                        'text': 'Your application sent successfully. '},
                        status=status.HTTP_201_CREATED)

        return Response('request send')
    
class StudentsRequests(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.university_id
        data=get_user_projects('students_requests',user)
        # data=getData('students_requests')
        return Response(data,status=status.HTTP_200_OK)
    
class Check_if_Apply_project(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.university_id
        respone=check_if_apply_projects('students_requests',user)
        if respone:
            return Response({'applied':respone})
        respone=check_if_apply_projects('requests_to_supervisors',user)
        if respone:
            return Response({'applied':respone})
        respone=check_if_apply_projects('projects',user)
        if respone:
            return Response({'applied':respone})
        return Response({'applied':False})

class Update_Students_Requests(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        response=request.data.get('response')
        request_id=request.data.get('request_id')
        if response=='accept':
            data=getSingleRow('students_requests',request_id)
            students = data.get('students')
            students[str(request.user.university_id)]['status']='accept'        
            data['students']=students
            update=editDataByID('students_requests',request_id,data)
            all_accept=all(student_data.get("status") in ['accept', 'sender'] for student_data in students.values())
            
            if all_accept:
                for student_data in students.values():
                    student_data.pop("status", None)
                    
                for student_id, student_info in students.items():
                    student_uni_data = University_students.objects.get(university_id=int(student_id))
                    student_info['GPA'] = student_uni_data.GPA
                    
                data['students']=students
                postData('requests_to_supervisors',data)
                return Response({'title': 'Application Updated',
                                'text': 'Your response sent successfully.'},
                                status=status.HTTP_200_OK)
        elif response=='delete':
            dell=deleteData('students_requests',request_id)
            return Response({'title': 'Application Deleted',
                                'text': 'Application deleted successfully.'},
                                status=status.HTTP_200_OK)
class Request_To_Supervisor(APIView):
    permission_classes=[IsSupervisor]
    def get(self,request):
        data=get_supervisor_projects('requests_to_supervisors',request.user.university_id)
        return Response(data)
    
    def post(self,request):
        response=request.data.get('response')
        request_id=request.data.get('request_id')
        
        if response=='delete':
            result=deleteData('requests_to_supervisors',request_id)
            return Response({'title': 'Application Deleted',
                                'text': 'Application deleted successfully.'},
                                status=status.HTTP_200_OK)
        elif response=='accept':
            request_data=getSingleRow('requests_to_supervisors',request_id)
            # return Response(request_data)
            sugg_project_id=request_data.get('project_id')
            sugg_project=getSingleRow('suggestion_projects',sugg_project_id)
            project=sugg_project
            students=request_data.get('students')
            for student_data in students.values():
                    student_data.pop("GPA", None)
            project['students']=students
            project['project_type']=request_data.get('project_type')
            project['date']=current_date_time.strftime('%Y/%m/%d')
            postData('projects',project)
            deleteData('suggestion_projects',sugg_project_id)
            deleteData('requests_to_supervisors',request_id)
            return Response({'title': 'Application Approved',
                                'text': 'Your response sent successfully and the project is approved.'},
                                status=status.HTTP_200_OK)