from django.urls import path
from .views import *

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    path('register/',UserRegister.as_view(),name='register'),
    path('sugg-projects/', SuggestProjectView.as_view(), name='suggest-projects'),
    path('departments/', DepartmentView.as_view(), name='departments'),
    path('projects/', ProjectsView.as_view(), name='projects'),
    path('requests/', RequestsView.as_view(), name='requests'),
    path('myrequests/', MyRequestsView.as_view(), name='myrequests'),
    path('delete-requests/', MyRequestDeleteView.as_view(), name='myrequests'),
    path('manager-requests-list/', ManagerRequestsView.as_view(), name='manager-requests-list'),
    path('notifications/', Notifications.as_view(), name='notifications'),
    path('update-profile/',UpdateProfile.as_view(),name='update-profile'),
    path('user/',UserInfo.as_view(),name='user'),
    path('apply-project/',ApplyProjectView.as_view()),
    path('students-requests/',StudentsRequests.as_view()),
    path('check-projects/',Check_if_Apply_project.as_view()),
    path('update-students-requests/',Update_Students_Requests.as_view()),
    path('requests-to-supervisors/',Request_To_Supervisor.as_view()),
    path('myrequest-student/',MyRequestStudent.as_view()),
    path('myprojects/',MyProjects.as_view()),
    path('employee/',Employee.as_view()),
    path('add-user/',AddUser.as_view()),
    path('supervisors/',SupervisorsNames.as_view()),
    path('add-project/',AddProjectRequestView.as_view()),
    path('students-projects-requests/',StudentsProjectsRequests.as_view()),
    path('update-students-projects-requests/',Update_Students_Proejcts_Requests.as_view()),
    path('students-projects-requests-to-supervisors/',Students_Projects_Request_To_Supervisor.as_view()),
    path('advert/',Advertismenet.as_view()),
    path('delete-advert/',DeleteAdvert.as_view()),
    path('logging/',LoggingView.as_view()),
    path('add-committee/',CommitteeView.as_view()),
    
    
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += staticfiles_urlpatterns()