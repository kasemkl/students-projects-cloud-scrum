from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,PermissionsMixin

class AppUserManger(BaseUserManager):
    def create_user():
        pass
    def create_superuser():
        pass 
    def create_user(self,university_id, password=None):
        # Create and save a regular user
        if not university_id:
            raise ValueError('university_id is required .')
        if not password :
            raise ValueError('password is reqiured .')
        
        user = self.model(university_id=university_id)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self,university_id, password=None):
        # Create and save a superuser
        user = self.create_user(university_id, password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser=True
        user.save()
        return user
        
class Account(AbstractBaseUser,PermissionsMixin):
    university_id = models.CharField(max_length=255,unique=True)
    password = models.CharField(max_length=255)
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    type = models.CharField(max_length=255,default='student')
    profile_photo = models.ImageField(upload_to='../images/',default='../images/default_profile_photo.jpg')
    
    USERNAME_FIELD = 'university_id'
    REQUIRED_FIELDS = []
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects=AppUserManger()
    
    def __str__(self):
        return str(self.university_id)


class Manager(models.Model):
    account_id= models.OneToOneField(Account, on_delete=models.CASCADE)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    def __str__(self) -> str:
        return self.account_id.first_name
    
class Supervisor(models.Model):
    account_id= models.OneToOneField(Account, on_delete=models.CASCADE)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    def __str__(self) -> str:
        return self.account_id.first_name

class Department(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class SuggestionProjects(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    goal = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.title} - {self.department.name}"
    

class Requests(models.Model):    
    title = models.CharField(max_length=100)
    description = models.TextField()
    goal = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    




class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    goal = models.CharField(max_length=100)
    supervisor_id = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    
class Products(models.Model):
    name=models.CharField(max_length=100)
    price=models.IntegerField()