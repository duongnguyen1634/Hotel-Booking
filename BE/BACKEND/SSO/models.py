from django.db import models

# Create your models here.
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
    field_id = models.CharField(max_length=50, primary_key=True, db_column='_id')
    hotel_id = models.CharField(max_length=50)

    class Meta():
        managed = False
        db_table = 'hotel_manager'

class Receptionist(models.Model):
    field_id = models.CharField(max_length=50, primary_key=True, db_column='_id')
    hotel_id = models.CharField(max_length=50)

    class Meta():
        managed = False
        db_table = 'receptionist'