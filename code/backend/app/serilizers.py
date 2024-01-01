# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import *


from rest_framework import serializers

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import Account

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError


UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['university_id', 'password', 'first_name', 'last_name', 'profile_photo']

    def create(self, validated_data):
        try:
            user = Account.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise ValidationError({'message': str(e)})

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')


class UserLoginSerializer(serializers.ModelSerializer):
    university_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['university_id', 'password']

    def check_user(self, clean_data):
        user = authenticate(university_id=clean_data['university_id'], password=clean_data['password'])
        if not user:
            raise ValidationError({'message":User not found '})
        return user
    
class USERserilizer(serializers.ModelSerializer):
    class Meta:
        model=Account
        fields=['__all__']

class UserInfoSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['university_id', 'profile_photo', 'first_name', 'last_name', 'email', 'type', 'groups']

    def get_groups(self, obj):
        return obj.groups.values_list('name', flat=True)
    
    
class AddUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['university_id', 'password', 'first_name', 'last_name', 'type']

    def create(self, validated_data):
        try:
            user = Account.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise ValidationError({'message': str(e)})
        
class SupervisorsNamesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ['university_id', 'first_name', 'last_name']