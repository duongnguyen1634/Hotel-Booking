from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .tokens import create_jwt_pair_for_user
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from . import serializers
from . import forms
# Create your views here.

class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request : Request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)

        if user is not None:
            tokens = create_jwt_pair_for_user(user)
            userInfor = {
                '_id' : user._id,
                'role' : 'guest' if user._id[0] == 'g' else 'hotel_manager' if user._id[6] == 'm' else 'receptionist'
            }
            response = {'success' : 'Login Successfull', 'userInf' : userInfor,'tokens' : tokens}
            return Response(data=response, status=status.HTTP_200_OK)
        else:
            return Response(data={'unsuccess' : 'Invalid email or password'})
        
    def get(self, request : Request):
        content = {'user' : str(request.user), 'auth' : str(request.auth)}
        return Response(data=content, status=status.HTTP_200_OK)
    
class RegisterView(APIView):
    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # This will call the create method in the serializer
            return Response({"success": "User registered successfully", "user_id": user.field_id}, status=status.HTTP_201_CREATED)
        else:
            return Response({"unsuccess": "User registered successfully", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
