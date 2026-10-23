from django.urls import path
from .views import (
    BankNotificationWebhookView,
    BankNotificationRecentView,
    BankNotificationTestView,
)

urlpatterns = [
    path('webhook/', BankNotificationWebhookView.as_view(), name='bank_webhook'),
    path('recent/', BankNotificationRecentView.as_view(), name='bank_recent'),
    path('test/', BankNotificationTestView.as_view(), name='bank_test'),
]
