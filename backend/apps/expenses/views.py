from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import datetime

from .parser import parse_bank_message
from .models import Expense

User = get_user_model()

# In-memory buffer for recently received bank notifications for fast polling
RECENT_WEBHOOK_NOTIFICATIONS = []

@method_decorator(csrf_exempt, name='dispatch')
class BankNotificationWebhookView(APIView):
    """
    Automated Webhook Endpoint for Mobile Bank Notifications & SMS Forwarders.
    Accepts incoming POST requests from Android SMS Forwarder, MacroDroid, or Tasker.
    Payload format:
    {
        "sender": "SBI-ALERT",
        "message": "Dear SBI User, your A/c ending 4821 debited for Rs 850.00 on 23-OCT-26 by UPI to SWIGGY...",
        "timestamp": "2026-10-23T18:42:00Z"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data or {}

        # Extract message content from various forwarder formats
        message_text = data.get('message') or data.get('text') or data.get('body') or data.get('sms') or ''
        sender = data.get('sender') or data.get('from') or data.get('address') or ''
        timestamp = data.get('timestamp') or datetime.now().isoformat()

        if not message_text:
            return Response(
                {"status": "error", "message": "No SMS text found in payload (expected 'message', 'text', or 'sms')"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Parse message using Python NLP engine
        parsed = parse_bank_message(message_text, sender)

        if not parsed.get("success"):
            return Response(
                {"status": "unparsed", "message": "Could not identify financial transaction details", "raw": message_text},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        notification_entry = {
            "id": int(datetime.now().timestamp() * 1000),
            "sender": sender,
            "raw_message": message_text,
            "bank_name": parsed["bank_name"],
            "amount": parsed["amount"],
            "is_income": parsed["is_income"],
            "merchant": parsed["merchant"],
            "category": parsed["category"],
            "payment_method": parsed["payment_method"],
            "date": parsed["date"],
            "ref_number": parsed["ref_number"],
            "timestamp": timestamp,
            "status": "auto_logged"
        }

        # Keep last 50 in memory
        RECENT_WEBHOOK_NOTIFICATIONS.insert(0, notification_entry)
        if len(RECENT_WEBHOOK_NOTIFICATIONS) > 50:
            RECENT_WEBHOOK_NOTIFICATIONS.pop()

        # Try to persist in database if an active user exists
        try:
            default_user = User.objects.filter(is_active=True).first()
            if default_user and not parsed["is_income"]:
                Expense.objects.create(
                    owner=default_user,
                    amount=Decimal(str(parsed["amount"])),
                    category=parsed["category"],
                    payment_method=parsed["payment_method"],
                    description=f"Auto-Logged from {parsed['bank_name']} SMS: {parsed['merchant']}{' (Ref: ' + parsed['ref_number'] + ')' if parsed['ref_number'] else ''}",
                    date=parsed["date"]
                )
                notification_entry["saved_to_db"] = True
        except Exception as err:
            notification_entry["db_error"] = str(err)

        return Response({
            "status": "success",
            "message": "Bank notification processed and auto-logged",
            "parsed": notification_entry
        }, status=status.HTTP_201_CREATED)


class BankNotificationRecentView(APIView):
    """
    Returns recently captured bank SMS notifications for live sync with the frontend.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        since_id = request.query_params.get('since_id')
        if since_id:
            try:
                since_id_int = int(since_id)
                filtered = [n for n in RECENT_WEBHOOK_NOTIFICATIONS if n['id'] > since_id_int]
                return Response({"notifications": filtered})
            except ValueError:
                pass
        return Response({"notifications": RECENT_WEBHOOK_NOTIFICATIONS})

    def delete(self, request, *args, **kwargs):
        RECENT_WEBHOOK_NOTIFICATIONS.clear()
        return Response({"status": "cleared", "message": "All recent notifications cleared"})


@method_decorator(csrf_exempt, name='dispatch')
class BankNotificationTestView(APIView):
    """
    Test endpoint for validating bank SMS parsing without saving.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        message = request.data.get('message', '')
        sender = request.data.get('sender', '')
        parsed = parse_bank_message(message, sender)
        return Response({"parsed": parsed})
