from django.urls import path
from .views import *

urlpatterns = [
    path('register/',UserRegister.as_view(),name='register'),
    path('sugg-projects/', SuggestProjectView.as_view(), name='suggest-projects'),
    path('sugg-projects/<path:id>/', DeleteSuggProject.as_view(), name='delete-sugg-project'),
    path('departments/', DepartmentView.as_view(), name='departments'),
    path('projects/', ProjectsView.as_view(), name='projects'),
    path('requests/', RequestsView.as_view(), name='requests'),
    path('manager-requests-list/', ManagerRequestsView.as_view(), name='manager-requests-list'),
    path('profile/',imageView)
]
