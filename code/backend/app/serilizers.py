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