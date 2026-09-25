import csv
from django.http import HttpResponse
from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.decorators import display, action
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.filters.admin import (
    ChoicesDropdownFilter,
    RangeDateFilter,
    RangeNumericFilter,
)
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(ModelAdmin, ImportExportModelAdmin):
    """
    Modern Unfold ModelAdmin for Expense model with colored category badges,
    formatted currency, dropdown filters, date hierarchy, and CSV export.
    """
    list_display = (
        'id',
        'display_date',
        'owner',
        'display_category',
        'display_amount',
        'display_payment_method',
        'short_description',
        'created_at',
    )
    list_filter = (
        ('category', ChoicesDropdownFilter),
        ('payment_method', ChoicesDropdownFilter),
        ('date', RangeDateFilter),
        ('amount', RangeNumericFilter),
    )
    search_fields = ('description', 'owner__username', 'owner__email', 'category')
    autocomplete_fields = ('owner',)
    date_hierarchy = 'date'
    ordering = ('-date', '-created_at')
    list_per_page = 25
    actions = ['export_to_csv']

    fieldsets = (
        ('Transaction Details', {
            'fields': (
                ('owner', 'date'),
                ('amount', 'category', 'payment_method'),
                'description',
            )
        }),
        ('Audit Information', {
            'classes': ['collapse'],
            'fields': (
                ('created_at', 'updated_at'),
            )
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    @display(description="Transaction Date", ordering="date", header=True)
    def display_date(self, instance: Expense):
        return [instance.date.strftime("%b %d, %Y"), instance.date.strftime("%A")]

    @display(
        description="Category",
        ordering="category",
        label={
            "Food": "success",
            "Travel": "info",
            "Shopping": "primary",
            "Education": "warning",
            "Bills": "danger",
            "Entertainment": "purple",
            "Healthcare": "teal",
            "Other": "gray",
        }
    )
    def display_category(self, instance: Expense):
        return instance.category

    @display(description="Amount", ordering="amount")
    def display_amount(self, instance: Expense):
        return f"₹{instance.amount:,.2f}"

    @display(description="Payment Method", label=True)
    def display_payment_method(self, instance: Expense):
        return instance.payment_method

    @display(description="Description")
    def short_description(self, instance: Expense):
        if not instance.description:
            return "-"
        if len(instance.description) > 35:
            return f"{instance.description[:35]}..."
        return instance.description

    @action(description="📥 Export Selected Expenses to CSV")
    def export_to_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="smart_expenses_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Owner', 'Date', 'Category', 'Amount', 'Payment Method', 'Description'])
        for item in queryset:
            writer.writerow([
                item.id,
                item.owner.username,
                item.date,
                item.category,
                item.amount,
                item.payment_method,
                item.description,
            ])
        return response
