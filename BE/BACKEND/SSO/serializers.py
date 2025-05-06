from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate
from . import models
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import numpy as np
CustomUser = get_user_model()

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["_id", "email", "password"]
        extra_kwarges = {"password" : {"write_only" : True}}
    
    def validate(self, atts):
        password = atts.get("password", "")
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters!")
        return atts
    
    def create(self, validated_data):
        password = validated_data.pop("password")
        UserModel = get_user_model()
        return UserModel.objects.create_user(password=password, **validated_data)
    

class RegisterSerializer(serializers.Serializer):
    field_id = serializers.CharField(max_length=50, read_only=True)
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=11, allow_blank=True, allow_null=True)
    password = serializers.CharField(write_only=True)
    avatar = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    def validate_password(self, value):
        # Add password validation if needed
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        # Save to User model
        validated_data["field_id"] = "user-123"
        validated_data["avatar"] = None
        user = models.User(
            field_id=validated_data["field_id"],
            name=validated_data["name"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            password=validated_data["password"],  # hash password
            avatar=validated_data["avatar"],
        )
        user.save()

        # Save to CustomUser model
        custom_user = CustomUser(
            _id=validated_data["field_id"],  # Assuming field_id is the primary key for both models
            email=validated_data["email"],
            password=validated_data["password"],  # hash password
            is_active=True,
        )
        custom_user.save()

        return user