# # This is an auto-generated Django model module.
# # You'll have to do the following manually to clean this up:
# #   * Rearrange models' order
# #   * Make sure each model has one field with primary_key=True
# #   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# #   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# # Feel free to rename the models, but don't rename db_table values or field names.
# from django.db import models

# class User(models.Model):
#     field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
#     name = models.CharField(max_length=100)
#     email = models.CharField(max_length=50, blank=True, null=True)
#     phone_number = models.CharField(max_length=11, blank=True, null=True)
#     password = models.CharField(max_length=50)
#     avatar = models.TextField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'user'
        
# class HotelManager(models.Model):
#     user = models.OneToOneField(User, models.DO_NOTHING, primary_key=True, db_column="_id")
#     hotel_id = models.CharField(max_length=50)

#     class Meta():
#         managed = False
#         db_table = 'hotel_manager'

# class Receptionist(models.Model):
#     user = models.OneToOneField(User, models.DO_NOTHING, primary_key=True, db_column="_id")
#     hotel_id = models.CharField(max_length=50)

#     class Meta():
#         managed = False
#         db_table = 'receptionist'

# class HotelServices(models.Model):
#     name = models.TextField(primary_key=True)
#     class Meta:
#         managed = False
#         db_table = 'hotel_services'

# class Hotel(models.Model):
#     field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
#     name = models.CharField(max_length=100)
#     country = models.TextField(blank=True, null=True)
#     city = models.TextField(blank=True, null=True)
#     district = models.TextField(blank=True, null=True)
#     street = models.TextField(blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     avg_rating = models.FloatField(blank=True, null=True)
#     min_price = models.FloatField(blank=True, null=True)
#     max_price = models.FloatField(blank=True, null=True)
#     num_rating = models.IntegerField(blank=True, null=True)
#     type = models.TextField(blank=True, null=True)
#     img = models.TextField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'hotel'

# class HotelHasServices(models.Model):
#     hotel = models.ForeignKey(Hotel, models.DO_NOTHING)
#     service_name = models.OneToOneField(HotelServices, models.DO_NOTHING, db_column='service_name', primary_key=True)  # The composite primary key (service_name, hotel_id) found, that is not supported. The first column is selected.

#     class Meta:
#         managed = False
#         db_table = 'hotel_has_services'
#         unique_together = (('service_name', 'hotel'),)

# class HotelHasRoomType(models.Model):
    
#     hotel = models.ForeignKey('Hotel', on_delete=models.DO_NOTHING, db_column='hotel_id')
#     room_type = models.ForeignKey('RoomType', on_delete=models.DO_NOTHING, db_column='room_type')
#     # room_type = models.CharField( db_column='room_type')
#     avg_rating = models.FloatField(blank=True, null=True)
#     price = models.FloatField(blank=True, null=True)
#     max_vacant = models.IntegerField(blank=True, primary_key=True)
#     vacant = models.IntegerField(blank=True, null=True)

#     class Meta:
#         managed = False  # Set to False if the table already exists in the database and should not be managed by Django
#         db_table = 'hotel_has_room_type'
#         unique_together = (('hotel_id', 'room_type'),)

# class RoomTypeServices(models.Model):
#     name = models.CharField(primary_key=True)

#     class Meta:
#         managed = False
#         db_table = 'room_type_services'

# class RoomType(models.Model):
#     name = models.CharField(primary_key=True, max_length=50)

#     class Meta:
#         managed = False
#         db_table = 'room_type'


# class RoomTypeHasServices(models.Model):
#     room_type = models.ForeignKey('RoomType', on_delete=models.CASCADE, db_column='room_type', primary_key=True)
#     service_name = models.ForeignKey('RoomTypeServices', on_delete=models.CASCADE, db_column='service_name')

#     class Meta:
#         db_table = 'room_type_has_services'
#         unique_together = (('room_type', 'service_name'),)
#         managed = False 

# class Room(models.Model):
#     hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, db_column='hotel_id')
#     # hotel = models.CharField( db_column='hotel_id')
#     room_no = models.IntegerField(db_column='no', primary_key=True)
#     type = models.ForeignKey('RoomType', on_delete=models.CASCADE, db_column='type')
#     type = models.CharField( db_column='type')
#     size = models.FloatField(blank=True, null=True)
#     avg_rating = models.FloatField(blank=True, null=True)
#     status = models.CharField(max_length=10, blank=True, null=True)
#     img = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'room'
#         unique_together = (('hotel', 'room_no'),)  # Enforce unique hotel-room_no combination
#         managed = False

# class Payment(models.Model):
#     field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
#     amount = models.FloatField()
#     original_amount = models.FloatField()
#     credit_card = models.TextField(blank=True, null=True)
#     deposit_type = models.TextField(blank=True, null=True)
#     discount = models.FloatField(blank=True, null=True)
#     # guest = models.ForeignKey('Guest', models.DO_NOTHING, blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'payment'

# class TransactionMethod(models.Model):
#     method = models.IntegerField(primary_key=True)
#     name = models.TextField()

#     class Meta:
#         managed = False
#         db_table = 'transaction_method'

# class Booking(models.Model):
#     field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
#     guest_id = models.CharField(max_length=50)
#     # guest = models.ForeignKey('Guest', models.DO_NOTHING)
#     hotel_id = models.CharField(max_length=50)
#     is_repeated_guest = models.BooleanField(blank=True, null=True)
#     distribution_channel = models.TextField(blank=True, null=True)
#     reservation_status = models.TextField()
#     reservation_status_date = models.DateTimeField(blank=True, null=True)
#     total_of_special_requests = models.IntegerField(blank=True, null=True)
#     days_in_waiting_list = models.IntegerField(blank=True, null=True)
#     booking_date = models.DateTimeField()
#     check_in = models.DateField()
#     check_out = models.DateField(blank=True, null=True)
#     stays_day = models.IntegerField(blank=True, null=True)
#     payment_method = models.ForeignKey('TransactionMethod', models.DO_NOTHING, db_column='payment_method', blank=True, null=True)
#     payment = models.ForeignKey('Payment', models.DO_NOTHING, blank=True, null=True, db_column='payment_id')
#     rating = models.FloatField(blank=True, null=True)
#     price = models.FloatField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'booking'



# class TransactionMethod(models.Model):
#     method = models.IntegerField(primary_key=True)
#     name = models.TextField()

#     class Meta:
#         managed = False
#         db_table = 'transaction_method'


# # class Payment(models.Model):
# #     field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
# #     amount = models.FloatField()
# #     original_amount = models.FloatField()
# #     credit_card = models.TextField(blank=True, null=True)
# #     deposit_type = models.TextField(blank=True, null=True)
# #     discount = models.FloatField(blank=True, null=True)
# #     # guest = models.ForeignKey('Guest', models.DO_NOTHING, blank=True, null=True)

# #     class Meta:
# #         managed = False
# #         db_table = 'payment'


# class BookingHasRoom(models.Model):
#     booking_id = models.CharField(max_length=50, primary_key=True)  # The composite primary key (booking_id, hotel_id, room_no) found, that is not supported. The first column is selected.
#     # hotel = models.ForeignKey(Room, models.DO_NOTHING)
#     hotel_id = models.CharField(max_length=50, db_column='hotel_id')
#     room_no = models.IntegerField(db_column='room_no')
#     meal = models.CharField(max_length=10, blank=True, null=True)
#     parking_spaces = models.IntegerField(blank=True, null=True)
#     adults = models.IntegerField(blank=True, null=True)
#     children = models.IntegerField(blank=True, null=True)
#     babies = models.IntegerField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'booking_has_room'
#         unique_together = (('booking_id', 'hotel_id', 'room_no'),)

# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class User(models.Model):
    field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    password = models.CharField(max_length=50)
    avatar = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'
        
class HotelManager(models.Model):
    user = models.OneToOneField(User, models.DO_NOTHING, primary_key=True, db_column="_id")
    hotel_id = models.CharField(max_length=50)

    class Meta():
        managed = False
        db_table = 'hotel_manager'

class Receptionist(models.Model):
    user = models.OneToOneField(User, models.DO_NOTHING, primary_key=True, db_column="_id")
    hotel_id = models.CharField(max_length=50)

    class Meta():
        managed = False
        db_table = 'receptionist'

class HotelServices(models.Model):
    name = models.TextField(primary_key=True)
    class Meta:
        managed = False
        db_table = 'hotel_services'

class Hotel(models.Model):
    field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
    name = models.CharField(max_length=100)
    country = models.TextField(blank=True, null=True)
    city = models.TextField(blank=True, null=True)
    district = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    avg_rating = models.FloatField(blank=True, null=True)
    min_price = models.FloatField(blank=True, null=True)
    max_price = models.FloatField(blank=True, null=True)
    num_rating = models.IntegerField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    img = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hotel'

class HotelHasServices(models.Model):
    hotel = models.ForeignKey(Hotel, models.DO_NOTHING)
    service_name = models.OneToOneField(HotelServices, models.DO_NOTHING, db_column='service_name', primary_key=True)  # The composite primary key (service_name, hotel_id) found, that is not supported. The first column is selected.

    class Meta:
        managed = False
        db_table = 'hotel_has_services'
        unique_together = (('service_name', 'hotel'),)

class HotelHasRoomType(models.Model):
    
    hotel = models.ForeignKey('Hotel', on_delete=models.DO_NOTHING, db_column='hotel_id')
    room_type = models.ForeignKey('RoomType', on_delete=models.DO_NOTHING, db_column='room_type')
    # room_type = models.CharField( db_column='room_type')
    avg_rating = models.FloatField(blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    max_vacant = models.IntegerField(blank=True, primary_key=True)
    vacant = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False  # Set to False if the table already exists in the database and should not be managed by Django
        db_table = 'hotel_has_room_type'
        unique_together = (('hotel_id', 'room_type'),)

class RoomTypeServices(models.Model):
    name = models.CharField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'room_type_services'

class RoomType(models.Model):
    name = models.CharField(primary_key=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'room_type'


class RoomTypeHasServices(models.Model):
    room_type = models.ForeignKey('RoomType', on_delete=models.CASCADE, db_column='room_type', primary_key=True)
    service_name = models.ForeignKey('RoomTypeServices', on_delete=models.CASCADE, db_column='service_name')

    class Meta:
        db_table = 'room_type_has_services'
        unique_together = (('room_type', 'service_name'),)
        managed = False 

class Room(models.Model):
    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, db_column='hotel_id')
    # hotel = models.CharField( db_column='hotel_id')
    room_no = models.IntegerField(db_column='no', primary_key=True)
    type = models.ForeignKey('RoomType', on_delete=models.CASCADE, db_column='type')
    type = models.CharField( db_column='type')
    size = models.FloatField(blank=True, null=True)
    avg_rating = models.FloatField(blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)
    img = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'room'
        unique_together = (('hotel', 'room_no'),)  # Enforce unique hotel-room_no combination
        #managed = False

class Payment(models.Model):
    field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
    amount = models.FloatField()
    original_amount = models.FloatField()
    credit_card = models.TextField(blank=True, null=True)
    deposit_type = models.TextField(blank=True, null=True)
    discount = models.FloatField(blank=True, null=True)
    # guest = models.ForeignKey('Guest', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment'

class Booking(models.Model):
    field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
    guest_id = models.CharField(max_length=50)
    # guest = models.ForeignKey('Guest', models.DO_NOTHING)
    hotel_id = models.CharField(max_length=50)
    is_repeated_guest = models.BooleanField(blank=True, null=True)
    distribution_channel = models.TextField(blank=True, null=True)
    reservation_status = models.TextField()
    reservation_status_date = models.DateTimeField(blank=True, null=True)
    total_of_special_requests = models.IntegerField(blank=True, null=True)
    days_in_waiting_list = models.IntegerField(blank=True, null=True)
    booking_date = models.DateTimeField()
    check_in = models.DateField()
    check_out = models.DateField(blank=True, null=True)
    stays_day = models.IntegerField(blank=True, null=True)
    payment_method = models.ForeignKey('TransactionMethod', models.DO_NOTHING, db_column='payment_method', blank=True, null=True)
    payment = models.ForeignKey('Payment', models.DO_NOTHING, blank=True, null=True, db_column='payment_id')
    rating = models.FloatField(blank=True, null=True)
    price = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'booking'



class TransactionMethod(models.Model):
    method = models.IntegerField(primary_key=True)
    name = models.TextField()

    class Meta:
        managed = False
        db_table = 'transaction_method'


# class Payment(models.Model):
#     field_id = models.CharField(db_column='_id', primary_key=True, max_length=50)  # Field renamed because it started with '_'.
#     amount = models.FloatField()
#     original_amount = models.FloatField()
#     credit_card = models.TextField(blank=True, null=True)
#     deposit_type = models.TextField(blank=True, null=True)
#     discount = models.FloatField(blank=True, null=True)
#     # guest = models.ForeignKey('Guest', models.DO_NOTHING, blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'payment'


class BookingHasRoom(models.Model):
    booking_id = models.CharField(max_length=50, primary_key=True)  # The composite primary key (booking_id, hotel_id, room_no) found, that is not supported. The first column is selected.
    # hotel = models.ForeignKey(Room, models.DO_NOTHING)
    hotel_id = models.CharField(max_length=50, db_column='hotel_id')
    room_no = models.IntegerField(db_column='room_no')
    meal = models.CharField(max_length=10, blank=True, null=True)
    parking_spaces = models.IntegerField(blank=True, null=True)
    adults = models.IntegerField(blank=True, null=True)
    children = models.IntegerField(blank=True, null=True)
    babies = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'booking_has_room'
        unique_together = (('booking_id', 'hotel_id', 'room_no'),)

class RoomTypeServices(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    class Meta:
        managed = False
        db_table = "room_type_services"

#    def __str__(self):
#        return f"{self.room_type.name} - {self.service.name}"

class HotelHasRoomType(models.Model):
    hotel = models.ForeignKey('Hotel',max_length=50, on_delete=models.DO_NOTHING, primary_key=True)
    room_type = models.CharField('RoomType',max_length=50) 
    avg_rating = models.FloatField(null=True, blank=True) 
    price = models.PositiveIntegerField(blank=True, null=True)  
    max_vacant = models.PositiveIntegerField(blank=True, null=True)  
    vacant = models.PositiveIntegerField(blank=True, null=True) 

    class Meta:
        managed = False
        db_table = 'hotel_has_room_type'
        constraints = [
            models.UniqueConstraint(fields=['hotel', 'room_type'], name='room_type_in_hotel')
        ]  

    #def __str__(self):
     #   return f"{self.hotel_id} - Room Type: {self.room_type}"

class RoomTypeHasServices(models.Model): 
    room_type = models.ForeignKey(RoomType, on_delete=models.DO_NOTHING, db_column='room_type', primary_key=True) 
    service_name = models.ForeignKey(RoomTypeServices, on_delete=models.DO_NOTHING, db_column='service_name') 
    #_id = models.UUIDField(default=uuid.uuid4, editable=False)
    class Meta: 
        managed = False
        unique_together = (('room_type', 'service_name'),) 
        db_table = 'room_type_has_services'