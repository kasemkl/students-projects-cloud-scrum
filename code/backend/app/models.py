# models.py
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin,Group


class AppUserManager(BaseUserManager):
    def create_user(self, university_id, password=None, **extra_fields):
        # Create and save a regular user
        if not university_id:
            raise ValueError('university_id is required.')

        user = self.model(university_id=university_id, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, university_id, password=None, **extra_fields):
        # Create and save a superuser
        user = self.create_user(university_id, password,type='admin', **extra_fields)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        new_group1, created = Group.objects.get_or_create(name='manager')
        new_group2, created = Group.objects.get_or_create(name='supervisor')
        new_group3, created = Group.objects.get_or_create(name='student')
        new_group4, created = Group.objects.get_or_create(name='employee')
        user.groups.add(new_group1)
        user.groups.add(new_group2)
        return user

class Account(AbstractBaseUser, PermissionsMixin):
    university_id = models.IntegerField(unique=True)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, default='student')
    profile_photo = models.ImageField(upload_to='images/', default='../media/images/default_profile_photo.jpg')
    email=models.EmailField()
    USERNAME_FIELD = 'university_id'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = AppUserManager()
    
    def __str__(self):
        return str(self.university_id)



class University_students(models.Model):
    university_id=models.IntegerField(primary_key=True)
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    number_of_hours=models.IntegerField()
    application_subject=models.BooleanField(default=False)
    junior_project=models.BooleanField(default=False)
    graduation1_project=models.BooleanField(default=False)
    GPA=models.FloatField()