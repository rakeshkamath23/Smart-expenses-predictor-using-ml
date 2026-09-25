from django.db import models
from django.conf import settings

CATEGORY_CHOICES = [
    ('Food', 'Food'),
    ('Travel', 'Travel'),
    ('Shopping', 'Shopping'),
    ('Education', 'Education'),
    ('Bills', 'Bills'),
    ('Entertainment', 'Entertainment'),
    ('Healthcare', 'Healthcare'),
    ('Other', 'Other'),
]

PAYMENT_METHOD_CHOICES = [
    ('Cash', 'Cash'),
    ('UPI', 'UPI'),
    ('Card', 'Card'),
    ('Bank Transfer', 'Bank Transfer'),
]


class Expense(models.Model):
    """
    Model representing an expense record.
    """
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expenses"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.date} - {self.category}: {self.amount} ({self.owner})"
