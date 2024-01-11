from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsManager, IsSupervisor,IsCommittee,IsEmployee
from .firebase import *
from .validition import validateRequestsData
from .serilizers import *  # Make sure to import your serializers
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
from django.contrib.auth.hashers import check_password
from firebase_admin import storage
from datetime import datetime
import pytz

# Get the GMT+3 timezone
gmt_plus_3_tz = pytz.timezone('Etc/GMT-3')
current_date_time = datetime.now(gmt_plus_3_tz)
date = current_date_time.strftime('%Y/%m/%d %I:%M%p')


class UserRegister(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        university_id = request.data['university_id']
        first_name=request.data['first_name']
        last_name=request.data['last_name']
        password=request.data.get('password')
        confirmation_password=request.data.get('confirmation_password')
        if password != confirmation_password:
            return Response({'title':'Failed Registration','message': 'password and confirmation password doesnt match'}, status=status.HTTP_400_BAD_REQUEST)

        user_exists = University_students.objects.filter(pk=university_id).exists()
        if not user_exists:
            return Response({'title':'Invalid University ID','message': 'This university id doesnt belong to university please check your university id and try again'}, status=status.HTTP_400_BAD_REQUEST)
        user=University_students.objects.get(pk=university_id)
        if first_name !=user.first_name or last_name !=user.last_name:
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
                group_name = "student"
                try:
                    group = Group.objects.get(name=group_name)
                    instance.groups.add(group)
                except Group.DoesNotExist:
                    # Handle the case where the group doesn't exist (optional)
                    return Response({'title': 'Failed Registration', 'text': f'Group "{group_name}" does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
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
        user_name=request.user.first_name+ ' ' +request.user.last_name
        
        
        manager = Account.objects.filter(groups__name='manager').first()
        
        try:
            if validateRequestsData(request.data):
                if request.user.groups.filter(name='manager').exists():
                    postData('suggestion_projects', request.data)
                    return Response({'title':'Request Sent','text': "the suggestion project is added successfully."}, status=status.HTTP_201_CREATED)
                data = postData(reference, request.data)
                Logging({'action':f"user with university ID={user} Add new Suggestion project request with title={request.data.get('title')}",
                        'data':data,'date':date})

                notication={
                    'message':f'Dr.{user_name} sent a suggestion project request ',
                    'receiver_id':manager.university_id,
                    'date':date
                }
                postData('notifications',notication)
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
                notification={'message':'Your suggestions deleted by the manager',
                                'receiver_id':int(request_instance['supervisor_id']),
                                'date':date}
                postData('notifications',notification)
                return Response({'title': 'Request Deleted',
                                'text': 'Request deleted successfully.'},
                                status=status.HTTP_200_OK)
        except Exception as e:
            error_message = str(e)
            return Response({"error": error_message})


class Notifications(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        reference='notifications'
        user=request.user.university_id
        
        data=getNotification(reference,user)
        return Response(data,status=status.HTTP_200_OK)
    def delete(self,request):
        user=request.user.university_id
        deleteNotification(user)
        return Response('deleted')
        

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
        notification={'message':'Your profile has been updated',
                                'receiver_id':int(request.user.university_id),
                                'date':date}
        postData('notifications',notification)
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
        supervisor_id = request.data.get('supervisor_id')
        students = data.get('students')
        project_type=request.data.get('project_type')
        supervisor=Account.objects.get(university_id=supervisor_id)
        supervisor_name=supervisor.first_name+' '+supervisor.last_name
        data['supervisor_name']=supervisor_name
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
                check_if_apply=check_if_apply_projects('requests_to_supervisors',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                check_if_apply=check_if_apply_projects('projects',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                check_if_apply=check_if_apply_projects('students_projects_requests',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                check_if_apply=check_if_apply_projects('students_projects_requests_to_supervisors',student)
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
                if index == 0 :
                    students_obj[str(student)]['status'] = 'sender'
                    if len(students) > 1:
                        Logging({"action":f"user with university ID={request.user.university_id} send team request ",'date':date})
                        notification={'message':f'{request.user.first_name} your request send to team',
                                        'receiver_id':int(student),
                                        'date':date}
                        postData('notifications',notification)
                else:
                    students_obj[str(student)]['status'] = 'pending'
                    notification={'message':f'{request.user.first_name} send you team request',
                                        'receiver_id':int(student),
                                        'date':date}
                    postData('notifications',notification)
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
                Logging({"action":f"user with university ID={request.user.university_id} send project request ",'date':date})
                notification={'message':f'{request.user.first_name} sent you a request',
                                'receiver_id':int(data['supervisor_id']),
                                'date':date}
                postData('notifications',notification)
                return Response({'title': 'Application sent',
                        'text': 'Your application sent successfully. '},
                        status=status.HTTP_201_CREATED)
        # return Response(students)
        addStudentRequest('students_requests',data)
        return Response({'title': 'Application sent',
                        'text': 'Your application sent successfully. '},
                        status=status.HTTP_201_CREATED)
    
class StudentsRequests(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.university_id
        data=get_user_projects('students_requests',user)
        return Response(data,status=status.HTTP_200_OK)


class StudentsProjectsRequests(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.university_id
        data=get_user_projects('students_projects_requests',user)
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
        respone=check_if_apply_projects('students_projects_requests',user)
        if respone:
            return Response({'applied':respone})
        respone=check_if_apply_projects('students_projects_requests_to_supervisors',user)
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
            Logging({"action":f"user with university ID={request.user.university_id} accept team request ",'date':date})
            all_accept=all(student_data.get("status") in ['accept', 'sender'] for student_data in students.values())
            
            if all_accept:
                for student_data in students.values():
                    student_data.pop("status", None)
                    
                for student_id, student_info in students.items():
                    student_uni_data = University_students.objects.get(university_id=int(student_id))
                    student_info['GPA'] = student_uni_data.GPA
                    
                data['students']=students
                postData('requests_to_supervisors',data)
                deleteData('students_requests',request_id)
                notification={'message':f'{request.user.first_name} sent you a request',
                                'receiver_id':int(data['supervisor_id']),
                                'date':date}
                postData('notifications',notification)
                return Response({'title': 'Application Updated',
                                'text': 'Your response sent successfully.'},
                                status=status.HTTP_200_OK)
        elif response=='delete':
            dell=deleteData('students_requests',request_id)
            Logging({"action":f"user with university ID={request.user.university_id} reject team request ",'date':date})
            for student in students:
                notification={'message':f'{request.user.first_name} reject your request',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
            return Response({'title': 'Application Deleted',
                                'text': 'Application deleted successfully.'},
                                status=status.HTTP_200_OK)
class Request_To_Supervisor(APIView):
    permission_classes=[IsSupervisor|IsManager]
    def get(self,request):
        
        data=get_supervisor_projects('requests_to_supervisors',request.user.university_id)
        return Response(data)
    
    def post(self,request):
        response=request.data.get('response')
        request_id=request.data.get('request_id')
        students_obj=getSingleRow('requests_to_supervisors',request_id).get('students')
        students=[]
        for id,info in students_obj.items():
            students.append(int(id))
            
        if response=='delete':
            result=deleteData('requests_to_supervisors',request_id)
            Logging({"action":f"user with university ID={request.user.university_id} reject project request",'date':date})
            for student in students:
                notification={'message':f'Dr.{request.user.first_name} reject your request',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
            return Response({'title': 'Application Deleted',
                                'text': 'Application deleted successfully.'},
                                status=status.HTTP_200_OK)
        elif response=='accept':
            request_data=getSingleRow('requests_to_supervisors',request_id)
            # return Response(request_data)
            sugg_project_id=request_data.get('project_id')
            sugg_project=getSingleRow('suggestion_projects',sugg_project_id)
            project=sugg_project
            project['sugg_project']=sugg_project_id
            
            students=request_data.get('students')
            for student_data in students.values():
                    student_data.pop("GPA", None)
            
            project['students']=students
            project['project_type']=request_data.get('project_type')
            project['date']=current_date_time.strftime('%Y/%m/%d')
            
            postData('employee',project)
            deleteData('requests_to_supervisors',request_id)
            Logging({"action":f"user with university ID={request.user.university_id} accept project request with title={project.get('title')}",'date':date})

            employee = Account.objects.filter(groups__name='employee')
            for emp in employee.values():
                notification={'message':f' Dr.{request.user.first_name} send project to registe ',
                                        'receiver_id':emp["university_id"],
                                        'date':date}
                postData('notifications',notification)
                
            for student in students:
                notification={'message':f'Dr.{request.user.first_name} accept your request',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
            return Response({'title': 'Application Approved',
                                'text': 'Your response sent successfully and the project is approved.'},
                                status=status.HTTP_200_OK)
            
            
class MyRequestStudent(APIView):
    
    def get(self,request):
        user=request.user.university_id
        data=get_student_projects('requests_to_supervisors','students_projects_requests_to_supervisors',user)
        return Response(data,status=status.HTTP_200_OK)
    
class MyProjects(APIView):
    
    def get(self,request):
        user=request.user.university_id
        type=request.user.type
        if type=='student':
            data=get_user_projects('projects',user)
        else:
            data=get_supervisor_projects('projects',user)
            
        return Response(data,status=status.HTTP_200_OK)

class Employee(APIView):
    
    def get(self,request):
        data=getData('employee')
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        respone=request.data.get('response')
        project_id=request.data.get('id')
        project=getSingleRow('employee',project_id)
        sugg_project_id=project.get('sugg_project') 
        students_obj=project.get('students')
        students=[]
        for id,info in students_obj.items():
                students.append(int(id))
        if respone=='success':
            postData('projects',project)
            Logging({"action":f"user with university ID={request.user.university_id} approve project with title={project.get('title')}",'date':date})
            if sugg_project_id:
                deleteData('suggestion_projects',sugg_project_id)
            deleteData('employee',project_id)
            for student in students:
                notification={'message':f'{request.user.first_name} registe your project successfully.',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
                return Response({'title': 'Project Approved',
                                'text': 'Your response sent successfully and the project is approved.'},
                                status=status.HTTP_200_OK)
        elif respone=='failed':
            deleteData('employee',project_id)
            Logging({"action":f"user with university ID={request.user.university_id} failed registe project ",'date':date})
            for student in students:
                notification={'message':f'Your project register failed please check your info with {request.user.first_name} {request.user.last_name}.',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
                return Response({'title': 'Project deleted',
                                'text': 'Your response sent successfully and the project is deleted.'},
                                status=status.HTTP_200_OK)
                

class AddUser(APIView):
    permission_classes=[IsAdminUser]
    def post(self, request):
        password = request.data.get('password')
        confirmation_password = request.data.get('confirmation_password')
        if password != confirmation_password:
            return Response({'title': 'Failed Registration', 'text': 'Password and confirmation password do not match'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            clean_data = {
                'university_id': request.data['university_id'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
                'type': request.data['type'],
                'password': request.data['password'],
            }

            serializer = AddUserSerializer(data=clean_data)
            if serializer.is_valid():
                instance = serializer.save()
                group_name = request.data['type']
                try:
                    group = Group.objects.get(name=group_name)
                    instance.groups.add(group)
                    if group_name=='manager':
                        group = Group.objects.get(name='supervisor')
                        instance.groups.add(group)
                except Group.DoesNotExist:
                    # Handle the case where the group doesn't exist (optional)
                    return Response({'title': 'Failed Registration', 'text': f'Group "{group_name}" does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
                Logging({'action': f"Register new account with university ID={clean_data['university_id']} and first_name={clean_data['first_name']}", 'date': date})
                return Response({'title': 'Successful Registration', 'text': 'Account Created Successfully'}, status=status.HTTP_201_CREATED)
            else:
                # Access the 'non_field_errors' attribute for general errors
                general_errors = serializer.errors.get('non_field_errors', [])
                field_errors = serializer.errors.copy()
                del field_errors['non_field_errors']

                errors = general_errors + [f"{field}: {', '.join(messages)}" for field, messages in field_errors.items()]

                return Response({'title': 'Failed', 'text': ', '.join(errors)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'text': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class SupervisorsNames(APIView):

    def get(self, request):
        supervisors = Account.objects.filter(groups__name='supervisor')
        serializer = SupervisorsNamesSerializer(supervisors, many=True)
        return Response(serializer.data)
    
##sprint 3 start
class AddProjectRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        supervisor_id = request.data.get('supervisor_id')
        students = data.get('students')
        project_type=request.data.get('project_type')
        
        supervisor=Account.objects.get(university_id=supervisor_id)
        supervisor_name=supervisor.first_name+' '+supervisor.last_name
        data['supervisor_name']=supervisor_name
        
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
                check_if_apply=check_if_apply_projects('requests_to_supervisors',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                check_if_apply=check_if_apply_projects('projects',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                check_if_apply=check_if_apply_projects('students_projects_requests',student)
                if check_if_apply:
                    return Response({'title': 'Application failed',
                                'text': f'Student with ID {student} belong to another team \n please check ID and try again.'},
                                status=status.HTTP_200_OK)
                check_if_apply=check_if_apply_projects('students_projects_requests_to_supervisors',student)
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
                    if len(students) > 1:
                        Logging({"action":f"user with university ID={request.user.university_id} send team request",'date':date})
                        notification={'message':f'{request.user.first_name} your request send to team',
                                            'receiver_id':int(student),
                                            'date':date}
                        postData('notifications',notification)
                else:
                    students_obj[str(student)]['status'] = 'pending'
                    notification={'message':f'{request.user.first_name} send you team request',
                                        'receiver_id':int(student),
                                        'date':date}
                    postData('notifications',notification)
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
                postData('students_projects_requests_to_supervisors',data)
                Logging({"action":f"user with university ID={request.user.university_id} send project request",'date':date})
                notification={'message':f'{request.user.first_name} sent you a project request',
                                'receiver_id':int(data['supervisor_id']),
                                'date':date}
                postData('notifications',notification)
                return Response({'title': 'Application sent',
                        'text': 'Your application sent successfully. '},
                        status=status.HTTP_201_CREATED)
        
        addStudentRequest('students_projects_requests',data)
        return Response({'title': 'Application sent',
                        'text': 'Your application sent successfully. '},
                        status=status.HTTP_201_CREATED)
        
class Update_Students_Proejcts_Requests(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        response=request.data.get('response')
        request_id=request.data.get('request_id')
        data=getSingleRow('students_projects_requests',request_id)
        students = data.get('students')
        if response=='accept':
            students[str(request.user.university_id)]['status']='accept'        
            data['students']=students
            update=editDataByID('students_projects_requests',request_id,data)
            Logging({"action":f"user with university ID={request.user.university_id} accept team request",'date':date})
            all_accept=all(student_data.get("status") in ['accept', 'sender'] for student_data in students.values())
            
            if all_accept:
                for student_data in students.values():
                    student_data.pop("status", None)
                    
                for student_id, student_info in students.items():
                    student_uni_data = University_students.objects.get(university_id=int(student_id))
                    student_info['GPA'] = student_uni_data.GPA
                    
                data['students']=students
                Logging({"action":f"students with university ID={students} send project request",'date':date})
                postData('students_projects_requests_to_supervisors',data)
                deleteData('students_projects_requests',request_id)
                notification={'message':f'{request.user.first_name} sent you a request',
                                'receiver_id':int(data['supervisor_id']),
                                'date':date}
                postData('notifications',notification)
                return Response({'title': 'Application Updated',
                                'text': 'Your response sent successfully.'},
                                status=status.HTTP_200_OK)
        elif response=='delete':
            dell=deleteData('students_projects_requests',request_id)
            for student in students:
                notification={'message':f'{request.user.first_name} reject your request',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
            return Response({'title': 'Application Deleted',
                                'text': 'Application deleted successfully.'},
                                status=status.HTTP_200_OK)
            
class Students_Projects_Request_To_Supervisor(APIView):
    permission_classes=[IsSupervisor|IsManager]
    def get(self,request):
        
        data=get_supervisor_projects('students_projects_requests_to_supervisors',request.user.university_id)
        return Response(data)
    
    def post(self,request):
        response=request.data.get('response')
        request_id=request.data.get('request_id')
        students_obj=getSingleRow('students_projects_requests_to_supervisors',request_id).get('students')
        students=[]
        for id,info in students_obj.items():
            students.append(int(id))
            
        if response=='delete':
            result=deleteData('students_projects_requests_to_supervisors',request_id)
            Logging({"action":f"user with university ID={request.user.university_id} delete project request",'date':date})
            for student in students:
                notification={'message':f'Dr.{request.user.first_name} reject your request',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
            return Response({'title': 'Application Deleted',
                                'text': 'Application deleted successfully.'},
                                status=status.HTTP_200_OK)
        elif response=='accept':
            request_data=getSingleRow('students_projects_requests_to_supervisors',request_id)
            # return Response(request_data)
            students=request_data.get('students')
            for student_data in students.values():
                    student_data.pop("GPA", None)
            project=request_data
            project['students']=students
            project['project_type']=request_data.get('project_type')
            project['date']=current_date_time.strftime('%Y/%m/%d')
            postData('employee',project)
            deleteData('students_projects_requests_to_supervisors',request_id)
            Logging({"action":f"user with university ID={request.user.university_id} accept project with title={project.get('title')}",'date':date})
            employee = Account.objects.filter(groups__name='employee')
            for emp in employee.values():
                notification={'message':f' Dr.{request.user.first_name} send project to registe ',
                                        'receiver_id':emp["university_id"],
                                        'date':date}
                postData('notifications',notification)
                
            for student in students:
                notification={'message':f'Dr.{request.user.first_name} accept your request',
                                    'receiver_id':int(student),
                                    'date':date}
                postData('notifications',notification)
            return Response({'title': 'Application Approved',
                                'text': 'Your response sent successfully and the project is approved.'},
                                status=status.HTTP_200_OK)
            

class Advertismenet(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        if not request.user.groups.filter(name='committee').exists():
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        user=request.user.university_id
        title=request.data.get('title')
        file = request.FILES['file']
        file_url=upload(file)
        
        postData('advertisements',{'title':title,'url':file_url,'date':date})
        Logging({"action":f"user with university ID={request.user.university_id} added an advertisment",'date':date})
        return Response({'title':'Advertismenet Added','text':'Advertisment was Added successfully.'},status=status.HTTP_200_OK)    
    def get(self,request):
        data=getData('advertisements')
        return Response(data)
    
class DeleteAdvert(APIView):
    permission_classes=[IsCommittee]
    def post(self,request):
        key=request.data.get('id')
        file_name=request.data.get('file_name')
        delete_file(file_name)
        deleteData('advertisements',key)
        Logging({"action":f"user with university ID={request.user.university_id} delete advertisment",'date':date})
        return Response({'title':'Advertismenet Deleted','text':'Advertisment was deleted successfully.'},status=status.HTTP_200_OK)
    
class LoggingView(APIView):
    permission_classes=[IsAdminUser]
    def get(self,request):
        data=getData('Logging')
        return Response(data,status=status.HTTP_200_OK)
    
class CommitteeView(APIView):
    permission_classes=[IsManager]
    def post(self,request):
        supervisor=request.data.get('supervisor_id')
        supervisor_instance=Account.objects.get(university_id=supervisor)
        if not supervisor_instance.groups.filter(name='committee').exists():
            committee_group = Group.objects.get(name='committee')
            supervisor_instance.groups.add(committee_group)
        return Response({'title':'Supervisor Added','text':'supervisor added successfully'},status=status.HTTP_200_OK)