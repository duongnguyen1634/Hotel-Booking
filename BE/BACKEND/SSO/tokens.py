from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from . import models


User = get_user_model()

def create_jwt_pair_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['email'] = user.email
    refresh['user_id'] = user._id
    refresh['role'] = 'guest' if user._id[0] == 'g' else 'hotel_manager' if user._id[0] == 'h' else 'receptionist'
    access = refresh.access_token
    access['role'] = 'guest' if user._id[0] == 'g' else 'hotel_manager' if user._id[0] == 'h' else 'receptionist'
    if (refresh['role'] == 'hotel_manager'):
        hotel_id = models.HotelManager.objects.get(field_id=user._id).hotel_id
        refresh['hotel_id'] = hotel_id
        access['hotel_id'] = hotel_id
    elif (refresh['role'] == 'receptionist'):
        hotel_id = models.Receptionist.objects.get(field_id=user._id).hotel_id
        refresh['hotel_id'] = hotel_id
        access['hotel_id'] = hotel_id
    tokens = {"access": str(access), "refresh": str(refresh)}
    
    return tokens