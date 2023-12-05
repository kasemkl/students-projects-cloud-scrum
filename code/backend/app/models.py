# models.py
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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
        user = self.create_user(university_id, password, **extra_fields)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

class Account(AbstractBaseUser, PermissionsMixin):
    university_id = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, default='student')
    profile_photo = models.ImageField(upload_to='images/', default='../media/images/default_profile_photo.jpg')

    USERNAME_FIELD = 'university_id'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = AppUserManager()

    def __str__(self):
        return str(self.university_id)


class image(models.Model):
    photo=models.ImageField(upload_to='images/',blank=True,null=True)