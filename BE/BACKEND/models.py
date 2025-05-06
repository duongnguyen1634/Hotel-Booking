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


#class HotelManager(models.Model):
