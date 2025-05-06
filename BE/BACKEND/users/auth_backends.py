from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
            # print('password')
            # print(user.password)
            if user.verify_password(password):
                return user
        except UserModel.DoesNotExist:
            return None
        
    def get_user(self, email):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None