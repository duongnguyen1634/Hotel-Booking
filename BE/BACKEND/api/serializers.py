from rest_framework import serializers
from . models import *
from django.db import connection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class HotelManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = HotelManager
        fields = "__all__"

class ReceptionistSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Receptionist
        fields = "__all__"

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['name']

class HotelHasRoomTypeSerializer(serializers.ModelSerializer):
    hotel = serializers.StringRelatedField()  # If you want a nested hotel representation, use HotelInformationSerializer
    room_type = serializers.StringRelatedField()  # Nested RoomTypeSerializer to include room type details

    class Meta:
        model = HotelHasRoomType
        fields = ['hotel', 'room_type', 'avg_rating', 'price', 'max_vacant', 'vacant']
        
        

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['hotel', 'room_no', 'type', 'size', 'avg_rating', 'status', 'img']

    def validate(self, attrs):
        hotel = attrs.get('hotel')
        room_no = attrs.get('room_no')

        # Ensure the room doesn't already exist
        if Room.objects.filter(hotel=hotel, room_no=room_no).exists():
            raise serializers.ValidationError(
                {"room_no": f"Room {room_no} already exists in hotel {hotel}."}
            )

        return attrs
    
    
class RoomTypeHasServiceSerializer(serializers.ModelSerializer):
    room_type = RoomTypeSerializer()
    service_name = serializers.StringRelatedField()

    class Meta:
        model = RoomTypeHasServices
        fields = ['room_type', 'service_name']

class RoomTypeWithServicesSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()

    class Meta:
        model = RoomType
        fields = ['name', 'services']

    def get_services(self, obj):
        services = RoomTypeHasServices.objects.filter(room_type=obj)
        return RoomTypeHasServiceSerializer(services, many=True).data

class BookRoomSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Room
        fields = ['room_no', 'type']

class BookingHasRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingHasRoom
        fields = ['booking_id', 'hotel_id', 'room_no', 'meal', 'parking_spaces', 'adults', 'children', 'babies']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'original_amount', 'credit_card',  'deposit_type', 'discount']

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionMethod
        fields = ['name']

class BookingDetailSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer()
    payment_method = PaymentMethodSerializer()
    status = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = [
            'field_id', 'payment', 'guest_id', "is_repeated_guest", "distribution_channel",'hotel_id', 'status',
            # 'reservation_status', 'reservation_status_date',
            # 'total_of_special_requests', 'days_in_waiting_list', 
            'booking_date', 'check_in', 'check_out', 'payment_method',
            'stays_day', 'rating', 'price'
        ]
    
    def get_status(self, obj):
        return {
            "reservation_status": obj.reservation_status,
            "reservation_status_date": obj.reservation_status_date,
            "special_request": obj.total_of_special_requests,
            "days_in_waiting_list": obj.days_in_waiting_list
        }

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'field_id', 'reservation_status', 'booking_date', 'check_in', 'check_out', 'stays_day',  'price'
        ]

class HotelServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelHasServices
        fields = ['service_name']

class HotelInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields =["field_id", "name", "country", "city", "district", "street", "description", "avg_rating", "min_price", "max_price", "num_rating", "type", "img"]


"""class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['_id', 'guest_id', 'hotel_id', 'check_in', 'check_out', 
                  'total_of_special_requests', 'reservation_status', 'price']
"""
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['no', 'type', 'size', 'avg_rating', 'status', 'img']

class HotelHasServicesInfoSerializer(serializers.ModelSerializer):
    services = HotelServiceSerializer(source='hotelhasservices_set', many=True)  # Liên kết tới danh sách dịch vụ
    class Meta:
        model = Hotel
        fields = [
            "field_id", "name", "country", "city", "district", "street",
            "description", "avg_rating", "min_price", "max_price", "num_rating",
            "type", "img", "services"  # Thêm trường services vào
        ]
class RoomTypeServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomTypeServices
        fields = ['name']
class RoomTypeHasServiceSerializer(serializers.ModelSerializer):
    service_name = RoomTypeServiceSerializer()
    class Meta:
            model = RoomTypeHasServices
            fields = [
                "room_type", "service_name"
            ]
class HotelHasRoomTypeSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()
    
    class Meta:
        model = HotelHasRoomType
        fields = ['hotel', 'room_type', 'avg_rating', 'price', 'max_vacant', 'vacant', 'services']
    
    def get_services(self, obj):
        # Lấy danh sách dịch vụ theo room_type từ model `RoomTypeService`
        room_services = RoomTypeHasServices.objects.filter(room_type=obj.room_type)#.values_list('service_name', flat=True)
        return [service.service_name.name for service in room_services]
        #return RoomTypeServiceSerializer(room_services, many=True).data
    """    try:
            print(f"Fetching services for room_type: {obj.room_type}")
            room_services = RoomTypeHasServices.objects.filter(room_type=obj.room_type)
            print(f"Room services: {room_services}")
            return RoomTypeHasServiceSerializer(room_services, many=True).data
        except Exception as e:
            print(f"Error in get_services: {e}")
            return []
    """

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
