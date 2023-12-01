from django.urls import path
from . import views
# urls.py

urlpatterns = [
    path('login/', views.UserLogin.as_view(), name='custom-login'),
    path('logout/', views.UserLogout.as_view(), name='custom-login'),
    # path('register/', views.UserRegister.as_view(), name='register'),
    # # path('menu/', views.UserData.as_view()),
    path('sugg-projects/', views.SuggestProjectView),
    path('sugg-projects/<path:id>/', views.DeleteSuggProject),
    path('departments/', views.DepartmentView),
    path('projects/', views.ProjectsView),
    path('requests/', views.RequestsView),
    path('manager-requests-list/', views.ManagerRequestsView),
    path('home/', views.home),
    ##path('logout/', views.LogoutView.as_view(), name='logout'),
    # other URLs...
]