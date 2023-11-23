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
    university_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['university_id', 'password']

    def create(self, validated_data):
        try:
            # Set 'university_id' field before calling create_user
            university_id = validated_data.pop('university_id')
            
            # Use 'create_user' method if it's a custom user model
            user_obj = UserModel.objects.create_user(university_id=university_id, password=validated_data['password'])

            # Assuming 'university' is a related field, set it using the correct relationship
            user_obj.university_id = university_id
            user_obj.save()
            return user_obj
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
    
class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = ['email', 'phone']

class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = ['email', 'phone']

class AccountSerializer(serializers.ModelSerializer):
    supervisor_data = SupervisorSerializer(required=False)
    manager_data = ManagerSerializer(required=False)

    class Meta:
        model = Account
        fields = ['university_id', 'password', 'first_name', 'last_name', 'type', 'profile_photo', 'supervisor_data', 'manager_data']

    def create(self, validated_data):
        supervisor_data = validated_data.pop('supervisor_data', {})
        manager_data = validated_data.pop('manager_data', {})

        account = Account.objects.create(**validated_data)

        if account.type == 'supervisor':
            Supervisor.objects.create(account_id=account, **supervisor_data)
        elif account.type == 'manager':
            Manager.objects.create(account_id=account, **manager_data)

        return account
# serializers.py

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'goal', 'supervisor_id', 'department_id', 'date']

class SuggestionProjectsSerializer(serializers.ModelSerializer):
    # Use DepartmentSerializer to serialize the department field
    department = DepartmentSerializer()

    class Meta:
        model = SuggestionProjects
        fields = ['title', 'description', 'goal', 'department']

    # Override the to_representation method to customize the serialized output
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Use the 'name' field from the nested DepartmentSerializer
        representation['department'] = representation['department']['name']
        return representation
    

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requests
        fields = ['id','title', 'description', 'goal', 'department']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Products
        fields=['id','name','price']