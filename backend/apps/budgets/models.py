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


class Budget(models.Model):
    """
    Monthly overall budget for an owner.
    month is stored as the 1st day of the given month.
    """
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets"
    )
    month = models.DateField(help_text="Stored as the 1st of the month")
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("owner", "month")
        ordering = ["-month"]

    def __str__(self):
        return f"{self.owner.username} Budget ({self.month.strftime('%Y-%m')}): {self.monthly_limit}"


class CategoryBudget(models.Model):
    """
    Budget allocation for a specific category within a monthly budget.
    """
    budget = models.ForeignKey(
        Budget,
        on_delete=models.CASCADE,
        related_name="category_budgets"
    )
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    limit = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("budget", "category")
        ordering = ["category"]

    def __str__(self):
        return f"{self.budget} - {self.category}: {self.limit}"
