# from django.shortcuts import render
# from rest_framework import viewsets
# from . import models
# from . import serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import json
# import django

# # Create your views here.

# class HotelServicesViewset(APIView):
#     def get(self, request, id=None):
#         if id:
#             item = models.HotelServices.objects.get(id=id)
#             serializer = serializers.HotelServicesSerializer(item)
#             return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


#         items = models.HotelServices.objects.all()
#         serializer = serializers.HotelServicesSerializer(items, many=True)
      
#         return Response({'status' : 'success', 'data' : serializer.data}, status=status.HTTP_200_OK)
    
# class HotelBookingDetailViewset(APIView):
#     def get(self, request, id='booking-1'):
#         items = models.Booking.objects.all()[:5]
#         print(items)
#         serializer = serializers.BookingSerializer(items, many=True)
#         return Response({'status' : 'success', 'data' : serializer.data},
#                     status=status.HTTP_200_OK)


"""
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hotel

"""