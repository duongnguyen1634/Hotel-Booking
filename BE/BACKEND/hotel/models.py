# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


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


class HotelServices(models.Model):
    name = models.TextField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'hotel_services'


class HotelHasServices(models.Model):
    hotel = models.ForeignKey(Hotel, models.DO_NOTHING)
    service_name = models.OneToOneField(HotelServices, models.DO_NOTHING, db_column='service_name', primary_key=True)  # The composite primary key (service_name, hotel_id) found, that is not supported. The first column is selected.

    class Meta:
        managed = False
        db_table = 'hotel_has_services'
        unique_together = (('service_name', 'hotel'),)


class RoomType(models.Model):
    name = models.CharField(primary_key=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'room_type'


class RoomTypeServices(models.Model):
    name = models.TextField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'room_type_services'


class RoomTypeHasServices(models.Model):
    room_type = models.ForeignKey(RoomType, models.DO_NOTHING, db_column='room_type')
    service_name = models.OneToOneField(RoomTypeServices, models.DO_NOTHING, db_column='service_name', primary_key=True)  # The composite primary key (service_name, room_type) found, that is not supported. The first column is selected.

    class Meta:
        managed = False
        db_table = 'room_type_has_services'
        unique_together = (('service_name', 'room_type'),)


class Room(models.Model):
    hotel = models.OneToOneField(Hotel, models.DO_NOTHING, primary_key=True)  # The composite primary key (hotel_id, no) found, that is not supported. The first column is selected.
    no = models.IntegerField()
    type = models.ForeignKey(RoomType, models.DO_NOTHING, db_column='type')
    size = models.FloatField(blank=True, null=True)
    avg_rating = models.FloatField(blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)
    img = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'room'
        unique_together = (('hotel', 'no'),)


##
"""class RoomType(models.Model):
    hotel_id = models.CharField(max_length=50)  # ID của khách sạn
    room_type = models.CharField(max_length=10)  # Loại phòng
    avg_rating = models.FloatField(blank=True, null=True)  # Đánh giá trung bình
    price = models.FloatField()  # Giá phòng
    max_vacant = models.IntegerField()  # Số lượng phòng tối đa có sẵn
    vacant = models.IntegerField()  # Số lượng phòng còn trống

    class Meta:
        managed = False
        db_table = 'room_type'  # Tên bảng trong cơ sở dữ liệu
"""