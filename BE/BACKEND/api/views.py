from django.shortcuts import render
from . import models
from . import serializers
import json
import django
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.http import JsonResponse
from django.views import View
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from datetime import datetime

from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import JsonResponse
from django.db.models import Count, Sum, Avg
from .models import Booking, BookingHasRoom
from django.db.models.functions import ExtractMonth
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta
import pytz
from dateutil import parser
from django.db.models import F

from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
# Create your views here.

@csrf_exempt
def cancel_booking(request):
    try:
        # Parse JSON body
        data = json.loads(request.body)
        booking_id = data.get("booking_id")
        if not booking_id:
            return JsonResponse({"success": False, "message": "Booking ID is required"}, status=400)

        # Fetch the booking record
        booking = get_object_or_404(Booking, field_id=booking_id)
        # Update the reservation_status
        if booking.reservation_status in ["No-Show", "Active"]:
            booking.reservation_status = "Canceled"
            formatted_date = now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Convert the formatted string back to a datetime object
            booking.reservation_status_date = datetime.strptime(formatted_date, "%Y-%m-%d %H:%M:%S")
            booking.save()
            return JsonResponse({"success": True, "message": "Booking has been canceled successfully"})
        else:
            return JsonResponse({"success": False, "message": "Booking cannot be canceled"}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON payload"}, status=400)

@csrf_exempt
def checkout_booking(request):
    try:
        # Parse JSON body
        data = json.loads(request.body)
        booking_id = data.get("booking_id")
        if not booking_id:
            return JsonResponse({"success": False, "message": "Booking ID is required"}, status=400)

        # Fetch the booking record
        booking = get_object_or_404(Booking, field_id=booking_id)

        # Update the reservation_status
        if booking.reservation_status in ["No-Show", "Active"]:
            booking.reservation_status = "Check-Out"
            formatted_date = now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Convert the formatted string back to a datetime object
            booking.reservation_status_date = datetime.strptime(formatted_date, "%Y-%m-%d %H:%M:%S")
            booking.save()
            return JsonResponse({"success": True, "message": "Booking has been checked out successfully"})
        else:
            return JsonResponse({"success": False, "message": "Booking cannot be checked out"}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON payload"}, status=400)
    
def get_room_types(request):
    hotel_id = request.GET.get('hotel_id', None)

    if not hotel_id:
        return JsonResponse({"error": "Hotel ID is required"}, status=400)
    try:
        # Fetch distinct room types for the given hotel
        room_types = (
            models.HotelHasRoomType.objects.filter(hotel_id=hotel_id)
            .select_related('room_type')  # Ensure the foreign key is resolved
            .values_list('room_type__name', flat=True)  # Assuming 'name' is a field in RoomType
            .distinct()
        )
        return JsonResponse({"success": True, "data": list(room_types)}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def booking_dashboard(request):
    hotel_id = request.GET.get('hotel_id', None)
    room_type = request.GET.get('room_type', None)  # Get room_type parameter

    if not hotel_id:
        return JsonResponse({"error": "Hotel ID is required"}, status=400)

    try:
        # Check if hotel exists
        hotel_exists = models.Hotel.objects.filter(field_id=hotel_id).exists()
        if not hotel_exists:
            return JsonResponse({"error": "Hotel not found"}, status=404)

        # Base Booking Query
        booking_query = Booking.objects.filter(hotel_id=hotel_id)

        # If room_type is provided, filter by it
        if room_type:
            # Get bookings that are linked to rooms of the specified room_type
            booking_query = booking_query.filter(
                field_id__in=BookingHasRoom.objects.filter(
                    room_no__in=models.Room.objects.filter(
                        hotel_id=hotel_id, type=room_type
                    ).values_list('room_no', flat=True)
                ).values_list('booking_id', flat=True)
            )

        # Calculate Metrics
        total_bookings = booking_query.count()
        total_rooms = models.Room.objects.filter(hotel_id=hotel_id).count()  # Total rooms for the hotel
        total_revenue = (booking_query.aggregate(Sum('price'))['price__sum'] or 0) / 1000
        avg_stay_duration = booking_query.aggregate(Avg('stays_day'))['stays_day__avg'] or 0

        # Revenue by Month
        revenue_by_month = (
            booking_query
            .annotate(month=ExtractMonth('booking_date'))
            .values('month')
            .annotate(total_revenue=Sum('price'))
            .order_by('month')
        )

        revenue_by_month = [
            {"month": item["month"], "total_revenue": item["total_revenue"] / 1000}
            for item in revenue_by_month
        ]

        # Reservation Status Counts
        reservation_status_counts = (
            booking_query
            .values('reservation_status')
            .annotate(count=Count('reservation_status'))
            .order_by('reservation_status')
        )

        # Prepare Data
        data = {
            "total_bookings": total_bookings,
            "total_rooms": total_rooms,
            "total_revenue": total_revenue,
            "avg_stay_duration": avg_stay_duration,
            "reservation_status_counts": list(reservation_status_counts),
            "revenue_by_month": list(revenue_by_month),
        }

        return JsonResponse({"success": True, "data": data}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# def booking_dashboard(request):
#     hotel_id = request.GET.get('hotel_id', None)

#     if hotel_id is None:
#         return JsonResponse({"error": "Hotel ID is required"}, status=400)
    
#     try:
#         from .models import Hotel
#         hotel_exists = Hotel.objects.filter(field_id=hotel_id).exists()
#         if not hotel_exists:
#             return JsonResponse({"error": "Hotel not found"}, status=404)
        
#         total_bookings = models.Booking.objects.filter(hotel_id=hotel_id).count()
#         total_rooms = models.Room.objects.filter(hotel_id=hotel_id).count()
#         total_revenue = models.Booking.objects.filter(hotel_id=hotel_id).aggregate(Sum('price'))['price__sum']
#         avg_stay_duration = models.Booking.objects.filter(hotel_id=hotel_id).aggregate(Avg('stays_day'))['stays_day__avg']

#         revenue_by_month = (
#             Booking.objects.filter(hotel_id=hotel_id)
#             .annotate(month=ExtractMonth('booking_date'))
#             .values('month')
#             .annotate(total_revenue=Sum('price'))
#             .order_by('month')
#         )

#         reservation_status_counts = (
#             Booking.objects.filter(hotel_id=hotel_id)
#             .values('reservation_status')
#             .annotate(count=Count('reservation_status'))
#             .order_by('reservation_status')
#         )

#         data = {
#             "total_bookings": total_bookings,
#             "total_rooms": total_rooms,
#             "total_revenue": total_revenue,
#             "avg_stay_duration": avg_stay_duration,
#             "reservation_status_counts": list(reservation_status_counts),
#             "revenue_by_month": list(revenue_by_month),
#         }

#         return JsonResponse({"success": True, "data": data}, status=200)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

class BookingViewset(APIView):
    def get(self, request):
        hotel_id = request.GET.get('hotel_id', None)
        guest_id = request.GET.get('guest_id', None)
        if hotel_id:
            try:
                items = models.Booking.objects.filter(hotel_id=hotel_id)
                serializer = serializers.BookingSerializer(items, many=True)
                return Response({"success":"get data successfull", "data" : serializer.data}, status=status.HTTP_200_OK)
            except models.Booking.DoesNotExist:
                return Response({"error":"Booking not found"},status=status.HTTP_404_NOT_FOUND)
        if guest_id:
            try:
                items = models.Booking.objects.filter(guest_id=guest_id)
                serializer = serializers.BookingSerializer(items, many=True)
                return Response({"success":"get data successfull", "data" : serializer.data}, status=status.HTTP_200_OK)
            except models.Booking.DoesNotExist:
                return Response({"error":"Booking not found"},status=status.HTTP_404_NOT_FOUND)


class RoomTypeWithServicesView(APIView):
    def get(self, request):
        hotel_id = request.GET.get('hotel_id', None)

        if not hotel_id:
            return Response({"error": "Hotel ID is required"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            # Ensure the hotel exists
            if not models.Hotel.objects.filter(field_id=hotel_id).exists():
                return Response({"error": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)

            # Fetch room types associated with the hotel
            hotel_room_types = models.HotelHasRoomType.objects.filter(hotel_id=hotel_id)

            # Collect room types, their details, and associated services

            data = []
            for hotel_room_type in hotel_room_types:
                
                room_type = hotel_room_type.room_type
                
                services = models.RoomTypeHasServices.objects.filter(room_type=room_type)
                
                service_names = [service.service_name.name for service in services]

                data.append({
                        
                    "name": room_type.name,
                    "price": hotel_room_type.price,
                    "avg_rating": hotel_room_type.avg_rating,
                    "max_vacant": hotel_room_type.max_vacant,
                    "vacant": hotel_room_type.vacant,
                    "services": service_names
                })

            return Response({"success": "Data retrieved successfully", "data": data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RoomListView(APIView):
    def get(self, request):
        hotel_id = request.GET.get('hotel_id', None)
        room_type = request.GET.get('type', None)
        
        if not hotel_id or not room_type:
            return Response({"error": "hotel_id and type are required parameters"}, status=status.HTTP_400_BAD_REQUEST)

        # Filter Room data
        rooms = models.Room.objects.filter(hotel_id=hotel_id, type=room_type)
        serializer = serializers.RoomSerializer(rooms, many=True)

        return Response({"success": "Data retrieved successfully", "data": serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = serializers.RoomSerializer(data=request.data)
        if serializer.is_valid():
            # Access validated data
            validated_data = serializer.validated_data
            hotel = validated_data.get('hotel')
            room_no = validated_data.get('room_no')
            room_type = validated_data.get('type')

            # Check if the room already exists
            if models.Room.objects.filter(hotel=hotel, room_no=room_no).exists():
                return Response(
                    {"error": f"Room with number {room_no} already exists in hotel {hotel}."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Handle HotelHasRoomType updates
            try:
                with transaction.atomic():
                    # Fetch or create HotelHasRoomType
                    try:
                        hotel_has_room_type = (
                        models.HotelHasRoomType.objects.select_for_update()
                        .filter(hotel_id=hotel.field_id, room_type=room_type)
                        .first()
                    )
                        
                        # Update the vacant field
                        if (request.data['status']=='vacant'):

                            
                            hotel_has_room_type.vacant += 1
                        
                        hotel_has_room_type.save()
                    except models.HotelHasRoomType.DoesNotExist:
                        # Create a new instance if not found
                        hotel_has_room_type = models.HotelHasRoomType.objects.create(
                            hotel_id=hotel.field_id,
                            room_type=room_type,
                            vacant=1
                        )

                    # Save the room instance
                    room = serializer.save()
                    return Response(
                        {"success": "Room added successfully", "data": serializer.data},
                        status=status.HTTP_201_CREATED
                    )
            except Exception as e:
                print(str(e))
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        room_no = request.query_params.get('room_no', None)
        hotel_id = request.query_params.get('hotel_id', None)

        if not room_no or not hotel_id:
            return Response({"error": "room_no and hotel_id are required parameters"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the room instance
            room = models.Room.objects.get(room_no=room_no, hotel_id=hotel_id)

            # Update HotelHasRoomType before deleting the room
            hotel_has_room_type = models.HotelHasRoomType.objects.filter(
                hotel_id=hotel_id, room_type=room.type
            ).first()

            if hotel_has_room_type:
                # Decrease the vacant count
                if hotel_has_room_type.vacant and hotel_has_room_type.vacant > 0:
                    hotel_has_room_type.vacant -= 1

                # Ensure max_vacant is updated correctly
                if hotel_has_room_type.max_vacant and hotel_has_room_type.vacant < hotel_has_room_type.max_vacant:
                    hotel_has_room_type.max_vacant = max(hotel_has_room_type.vacant, 0)

                hotel_has_room_type.save()

            # Delete the room
            room.delete()

            return Response({"success": f"Room {room_no} removed successfully and HotelHasRoomType updated."}, status=status.HTTP_200_OK)
        except models.Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class RoomDetailView(APIView):
#     def put(self, request, room_no):
#         hotel_id = request.GET.get('hotel_id', None)

#         if not hotel_id:
#             return Response({"error": "Hotel ID is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
            
#             room = models.Room.objects.get(room_no=room_no, hotel_id=hotel_id)
#             serializer = serializers.RoomSerializer(room, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response({"message": "Room updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except models.Room.DoesNotExist:
#             return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)


class BookingDetailViewset(APIView):
    def get(self, request):
        booking_id = request.GET.get('booking_id', None)
        if booking_id == None:
            return Response({"error":"Booking not found"},status=status.HTTP_404_NOT_FOUND)
      
        try:
            booking = models.Booking.objects.get(field_id=booking_id)
            

            booking_serializer = serializers.BookingDetailSerializer(booking)
            booking_rooms = models.BookingHasRoom.objects.filter(booking_id=booking_id)
            
            room_data = []
            for booking_room in booking_rooms:
                # Retrieve Room details using `hotel_id` and `room_no`
                try:
                    room = models.Room.objects.get(hotel_id=booking_room.hotel_id, room_no=booking_room.room_no)
                    room_serializer = serializers.BookRoomSerializer(room)
                    room_data.append(room_serializer.data)
                except models.Room.DoesNotExist:
                    continue  # Handle case where room does not exist
            
            # Group rooms by room_type.name
            grouped_rooms = {}
            booking_response_data = booking_serializer.data
            booking_has_room_data = serializers.BookingHasRoomSerializer(booking_rooms, many=True).data
            for i, room in enumerate(room_data):
                # Ensure room_type is accessed by name as a string
                data = {
                    "room_no": room["room_no"],
                    "meal": booking_has_room_data[i]["meal"],
                    "parking_spaces": booking_has_room_data[i]["parking_spaces"],
                    "adults": booking_has_room_data[i]["adults"],
                    "children": booking_has_room_data[i]["children"],
                    "babies": booking_has_room_data[i]["babies"]

                }
                room_type_name = room['type']  # Access the room_type name
                if room_type_name not in grouped_rooms:
                    grouped_rooms[room_type_name] = []
                grouped_rooms[room_type_name].append(data)

            booking_response_data["room_type"] = grouped_rooms 
            
            return Response({"success":"get data successfull", "data" : booking_response_data}, status=status.HTTP_200_OK)
        except models.Booking.DoesNotExist:
            return Response({"error":"Booking not found"},status=status.HTTP_404_NOT_FOUND)
     


class HotelInformationViewset(APIView):
    def get(self, request):
        hotel_id = request.GET.get('hotel_id', None)
        try:
            hotel = models.Hotel.objects.get(field_id=hotel_id)
            number_of_room = models.Room.objects.filter(hotel_id=hotel_id).count()
            total_booking = models.Booking.objects.filter(hotel_id=hotel_id).count()

            services = models.HotelHasServices.objects.filter(hotel_id=hotel_id)
            services = serializers.HotelServiceSerializer(services, many=True).data
            services = list(map(lambda x: x['service_name'], services))

            hotel_managers = models.HotelManager.objects.filter(hotel_id=hotel_id)
            hotel_managers_data = serializers.HotelManagerSerializer(hotel_managers, many=True).data
            
            receptionist = models.Receptionist.objects.filter(hotel_id = hotel_id)
            receptionist_data = serializers.ReceptionistSerializer(receptionist, many=True).data

            hotel_inf_serializer = serializers.HotelInformationSerializer(hotel)
            hotel_inf_data = hotel_inf_serializer.data

            employee = hotel_managers_data + receptionist_data
            employee = list(map(lambda x: x['user'], employee))

            hotel_inf_data["number_of_room"] = number_of_room
            hotel_inf_data["total_booking"] = total_booking
            hotel_inf_data["services"] = services
            hotel_inf_data["employee"] = employee
            

            return Response({"success":"get data successfull", "data" : hotel_inf_data}, status=status.HTTP_200_OK)
        except models.Hotel.DoesNotExist:
            return Response({"error":"Booking not found"},status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request):
        hotel_id = request.GET.get('hotel_id', None)
        try:
            hotel = models.Hotel.objects.get(field_id=hotel_id)
            request.data["field_id"] = hotel_id
            serializer = serializers.HotelInformationSerializer(hotel, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response({"success": "Hotel updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except models.Hotel.DoesNotExist:
            return Response({"error": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)

"""class CancelBookingDetails(APIView):
    def get(self, request):
        booking_id = request.GET.get('booking_id', None)
        
        if not booking_id:
            return Response({"error": "Booking ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Lấy thông tin booking
            booking = models.Booking.objects.get(field_id=booking_id)
            booking_serializer = serializers.BookingSerializer(booking)

            # Lấy danh sách phòng liên quan đến booking
            rooms = models.Room.objects.filter(hotel_id=booking.hotel_id)
            room_serializer = serializers.RoomSerializer(rooms, many=True)

            # Chuẩn bị dữ liệu phản hồi
            data = {
                "booking_details": booking_serializer.data,
                "rooms": room_serializer.data,
                "cancellation_fee": 0,  # Phí hủy (tạm thời là 0)
                "total_cost": booking.price  # Tổng giá trị booking
            }
            
            return Response({"success": "Data retrieved successfully", "data": data}, status=status.HTTP_200_OK)
        
        except models.Booking.DoesNotExist:
            return Response({"error": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
"""


# Lớp APIView cho User
class UserViewset(APIView):
    def get(self, request):
        # Lấy thông tin người dùng chỉ dựa trên field_id
        user_id = request.GET.get('user_id', None)

        if user_id is None:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(models.User, field_id=user_id)
        serializer = serializers.UserSerializer(user)
        return Response({"success": "User data retrieved successfully", "data": serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        # Cập nhật thông tin người dùng dựa trên field_id
        user_id = request.GET.get('user_id', None)

        if user_id is None:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(models.User, field_id=user_id)
        serializer = serializers.UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "User data updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Xóa người dùng dựa trên field_id
        user_id = request.data.get('user_id', None)

        if user_id is None:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(models.User, field_id=user_id)
        user.delete()
        return Response({"success": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
# Lớp APIView cho Payment
class PaymentViewset(APIView):
    def get(self, request):
        # Lấy thông tin thanh toán theo payment_id
        payment_id = request.GET.get('payment_id', None)

        if payment_id is None:
            return Response({"error": "Payment ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        payment = get_object_or_404(models.Payment, field_id=payment_id)
        serializer = serializers.PaymentSerializer(payment)
        return Response({"success": "Payment data retrieved successfully", "data": serializer.data}, status=status.HTTP_200_OK)


# Lớp APIView cho danh sách tất cả thanh toán của một User
class UserPaymentsViewset(APIView):
    def get(self, request):
        # Lấy thông tin thanh toán theo guest_id
        user_id = request.GET.get('user_id', None)

        if user_id is None:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        bookings = models.Booking.objects.filter(guest_id=user_id).select_related('payment')
        payments = [booking.payment for booking in bookings if booking.payment]

        serializer = serializers.PaymentSerializer(payments, many=True)
        return Response({"success": "User payments retrieved successfully", "data": serializer.data}, status=status.HTTP_200_OK)
    


class HotelHasRoomTypeView(APIView):
    def get(self, request):
        hotel_id = request.GET.get('hotel_id', None)
        hotel_id = f"hotel-{hotel_id}"
        #print(f"Hotel ID: {hotel_id}")
        #print(models.HotelHasRoomType.objects.filter(hotel='hotel-2'))
        #room_types = models.HotelHasRoomType.objects.filter(hotel='hotel-2')
        #print(room_types)

        try:
            # Lọc dữ liệu theo hotel_id
            if not hotel_id:
                return Response({"detail": "Hotel ID is required."}, status=status.HTTP_400_BAD_REQUEST)
            room_types = models.HotelHasRoomType.objects.filter(hotel=hotel_id)
            #print(f"Hotel Rooms: {room_types}")
            # Nếu không có phòng nào được tìm thấy
            if not room_types.exists():
                return Response(
                    {"detail": "No rooms found for the specified hotel."},
                    status=status.HTTP_404_NOT_FOUND
                )

            room_data = []
            for room in room_types:
                # Serialize thông tin phòng
                #print(f"Processing room: {room.room_type}")
                room_serializer = serializers.HotelHasRoomTypeSerializer(room)
                room_info = room_serializer.data

                # Lấy thông tin dịch vụ cho mỗi loại phòng
                room_services = models.RoomTypeHasServices.objects.filter(room_type=room.room_type)
                #print(f"Room Services: {room_services}")
                
                services_list = [service.service_name.name for service in room_services]  # Giả sử 'name' là tên dịch vụ

                # Thêm dịch vụ vào thông tin phòng
                room_info['services'] = services_list
                room_data.append(room_info)
        
            # Trả về dữ liệu phòng
            #print(f"Returning room data: {room_data}")
            return Response(
                {"rooms": room_data}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print(e)
            return Response( 
                {"Detail": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchHotelsView(APIView):
    def post(self, request):
        print(request.data)     
        # Lấy dữ liệu từ frontend
        destination = request.data.get('destination')
        checkIn = request.data.get('checkIn')
        checkOut = request.data.get('checkOut')
        guests = request.data.get('guests')
        rooms = int(request.data.get('rooms',0))

        # Kiểm tra nếu thiếu dữ liệu
        if not all([destination, checkIn, checkOut, guests, rooms]):
            return Response({'error': 'Missing search parameters'}, status=status.HTTP_400_BAD_REQUEST)

        # Tìm kiếm trong cơ sở dữ liệu | street =destination | street = destination
        #hotels = models.Hotel.objects.filter(city=destination)
        hotels = models.Hotel.objects.filter(
            Q(city__icontains=destination) |
            Q(district__icontains=destination) |
            Q(street__icontains=destination)
            #thêm điều kiện date checkin out
        )

        # Nếu không tìm thấy
        if hotels.count() == 0:
            return Response({'error': 'No hotels found'}, status=status.HTTP_404_NOT_FOUND)
        
        hotels_with_rooms = []

        for hotel in hotels:
            # Lấy tổng số phòng từ max_vacant trong HotelHasRoomType
            total_rooms = models.HotelHasRoomType.objects.filter(hotel=hotel).aggregate(
                total_vacant=Sum('max_vacant')
            )['total_vacant'] or 0

            # Lấy tổng số phòng đã được đặt từ BookingHasRoom
            booked_rooms = models.BookingHasRoom.objects.filter(
                hotel_id=hotel,
                booking_id__in=models.Booking.objects.filter(
                    check_in__lt=checkOut,  # Booking có check-in trước ngày check-out người dùng yêu cầu
                    check_out__gt=checkIn   # Booking có check-out sau ngày check-in người dùng yêu cầu
                ).values_list('field_id', flat=True)
            ).count()

            available_rooms = total_rooms - booked_rooms

            # Kiểm tra nếu số phòng trống đủ với yêu cầu
            if available_rooms >= rooms:
                hotels_with_rooms.append(hotel)

        if not hotels_with_rooms:
            return Response({'error': 'No available hotels with enough vacant rooms'}, status=status.HTTP_404_NOT_FOUND)
        
        hotel_inf_serializer = serializers.HotelHasServicesInfoSerializer(hotels_with_rooms, many = True)
        # Trả về danh sách khách sạn
        #hotels_data = hotel_inf_serializer.data
        #print(hotels_data)
        return Response({'hotels': hotel_inf_serializer.data}, status=status.HTTP_200_OK)
    
"""
class RoomTypeListView(APIView):
    def get(self, request):
        room_types = models.RoomType.objects.all()  # Lấy danh sách các loại phòng
        serializer = serializers.RoomTypeSerializer(room_types, many=True)
        return Response(serializer.data)
    
class HotelRoomsView(APIView):
    def get(self, request, hotel_id):  
        rooms = models.Room.objects.filter(field_id=hotel_id)  # Lấy tất cả các phòng của một khách sạn
        serializer = serializers.RoomSerializer(rooms, many=True)
        return Response(serializer.data)
"""
    
#class HotelHasRoomTypeView(APIView):
class GuestHotelHasRoomTypeView(APIView):
    def get(self, request):
        hotel_id = request.GET.get('hotel_id', None)
        hotel_id = f"hotel-{hotel_id}"

        try:
            # Lọc dữ liệu theo hotel_id
            if not hotel_id:
                return Response({"detail": "Hotel ID is required."}, status=status.HTTP_400_BAD_REQUEST)
            room_types = models.HotelHasRoomType.objects.filter(hotel=hotel_id)
            #print(f"Hotel Rooms: {room_types}")
            # Nếu không có phòng nào được tìm thấy
            if not room_types.exists():
                return Response(
                    {"detail": "No rooms found for the specified hotel."},
                    status=status.HTTP_404_NOT_FOUND
                )

            room_data = []
            for room in room_types:
                # Serialize thông tin phòng
                #print(f"Processing room: {room.room_type}")
                room_serializer = serializers.HotelHasRoomTypeSerializer(room)
                room_info = room_serializer.data

                # Lấy thông tin dịch vụ cho mỗi loại phòng
                room_services = models.RoomTypeHasServices.objects.filter(room_type=room.room_type)
                #print(f"Room Services: {room_services}")
                
                services_list = [service.service_name.name for service in room_services]  # Giả sử 'name' là tên dịch vụ

                # Thêm dịch vụ vào thông tin phòng
                room_info['services'] = services_list
                room_data.append(room_info)
        
            # Trả về dữ liệu phòng
            #print(f"Returning room data: {room_data}")
            return Response(
                {"rooms": room_data}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print(e)
            return Response( 
                {"Detail": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class BookingCreateView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            #print(data)
            #data = json.loads(request.body)
            # Extract fields
            guests = data.get('guests', {})  # Giả sử guests là một đối tượng chứa adults, children, babies
            adults = guests.get('adults', 0)  # Số lượng người lớn
            children = guests.get('children', 0)  # Số lượng trẻ em
            babies = guests.get('babies', 0)  # Số lượng trẻ sơ sinh
            email = data.get('guest_email')
            hotel_id = data.get('hotel_id')
            check_in = data.get('check_in')  
            check_out = data.get('check_out') 
            total_cost = float(data.get('total_cost', 0))
            room_details = data.get('room_details', [])  # Danh sách loại phòng và số lượng từ frontend
            # Truy vấn để lấy id từ email
            user = models.User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
            guest_id = user.field_id  # Lấy id người dùng từ kết quả truy vấn

            if not guest_id or not hotel_id or not check_in or not check_out or not room_details:
                return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            #print(check_in)
            tz = pytz.timezone("Asia/Ho_Chi_Minh")
            check_in_datetime = parser.isoparse(check_in).astimezone(tz).date()
            check_out_datetime = parser.isoparse(check_out).astimezone(tz).date()
            #print(check_in_datetime)
            now_naive = timezone.now().date()  # Lấy ngày hiện tại không có thời gian
            days_in_waiting_list = (check_in_datetime.date() - now_naive).days
            #days_in_waiting_list = datetime.strptime(days_in_waiting_list, "%Y-%m-%d")
            stays_day = (check_out_datetime - check_in_datetime).days
            #stays_day = datetime.strptime(stays_day, "%Y-%m-%d")
            is_repeated_guest = models.Booking.objects.filter(guest_id=guest_id).exists()

            # Lấy tất cả các field_id trong bảng Booking
            bookings = models.Booking.objects.all()

            # Tìm chiều dài lớn nhất của field_id
            max_length = max([len(booking.field_id) for booking in bookings])

            # Lọc ra các field_id có chiều dài lớn nhất
            valid_bookings = [booking.field_id for booking in bookings if len(booking.field_id) == max_length]
            field_id_numbers = [booking_id[8:] for booking_id in valid_bookings]  # Lấy phần số sau "booking-"
            field_id_numbers_int = [int(num) for num in field_id_numbers]
            max_field_id_number = max(field_id_numbers_int)
            #print(max_field_id_number)
            field_id = f"booking-{max_field_id_number + 1}"

            book_date = timezone.now() + timedelta(hours=7)
            print("Book date: ", book_date)
            payment_method_instance = models.TransactionMethod.objects.get(method=2)
            booking = models.Booking.objects.create(
                field_id = field_id,
                guest_id=guest_id,
                hotel_id=hotel_id,
                is_repeated_guest = is_repeated_guest,
                distribution_channel="TA/TO",
                reservation_status = "No-Show",
                reservation_status_date=book_date.replace(microsecond=0),
                total_of_special_requests=0,
                check_in=check_in_datetime,
                check_out=check_out_datetime,
                days_in_waiting_list = max(days_in_waiting_list, 0),
                booking_date = book_date.replace(microsecond=0),
                stays_day = stays_day,
                payment_method = payment_method_instance,
                payment = None,
                rating = None,
                price = total_cost
            )
           
            # Tạo các bản ghi trong BookingHasRoom
            for room in room_details:
                room_type = room.get('type')  # Loại phòng từ frontend
                quantity = int(room.get('quantity', 0))
                meal = room.get('meal', None)
                parking_spaces = room.get('parking_spaces', None)

                # Truy vấn danh sách phòng trống phù hợp
                vacant_rooms = models.Room.objects.filter(
                    hotel=hotel_id,
                    type=room_type,
                    status="vacant"
                ).order_by('room_no')[:quantity]

                if vacant_rooms.count() < quantity:
                    return Response({"message": f"Not enough vacant rooms for type {room_type}"}
                                    , status=status.HTTP_400_BAD_REQUEST)

                # Cập nhật trạng thái phòng và thêm vào BookingHasRoom
                for room in vacant_rooms:
                    models.BookingHasRoom.objects.create(
                        booking_id=booking.field_id,
                        hotel_id=hotel_id,
                        room_no=room.room_no,
                        meal=meal,
                        parking_spaces=parking_spaces, 
                        adults=adults,  
                        children=children, 
                        babies=babies,
                    )
                    models.Room.objects.filter(hotel_id=hotel_id, room_no=room.room_no).update(status="occupied")      
                
                updated_rows = models.HotelHasRoomType.objects.filter(
                    hotel_id=hotel_id,
                    room_type=room_type
                ).update(vacant=F("vacant") - quantity)

                if updated_rows == 0:
                    # Nếu không có bản ghi nào được cập nhật, tạo bản ghi mới
                    models.HotelHasRoomType.objects.create(
                        hotel_id=hotel_id,
                        room_type=room_type,
                        vacant=max(0, quantity)  # Đảm bảo không để giá trị âm
                    )

            return JsonResponse({
                "message": "Booking created successfully",
                "booking_id": booking.field_id,
                "guest_id": guest_id,
                "hotel_id": hotel_id,
                "is_repeated_guest": is_repeated_guest,
                "check in date": check_in,
                "check out date": check_out,
                "total_cost": total_cost
            }, status=200)
        
        except Exception as e:
            print("Error: ", e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        