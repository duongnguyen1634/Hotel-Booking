from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import check_password
# Create your models here.

from . manager import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    _id = models.CharField(primary_key=True, max_length=50, unique=True)
    id = None
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now, null=True, blank=True)
    is_superuser = models.BooleanField(default=True, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta():
        db_table = 'custom_user'

    def verify_password(self, password):
        return password == self.password

    def __str__(self):
        return self.email

class Hotel_Searching (models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    max_guests = models.IntegerField()
    rooms_available = models.IntegerField()
