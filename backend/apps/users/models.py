from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Adds optional phone_number and bio fields.
    """
    phone_number = models.CharField(max_length=20, blank=True, default='')
    bio = models.TextField(blank=True, default='')

    def __str__(self):
        return self.username
