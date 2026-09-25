from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.filters.admin import (
    ChoicesDropdownFilter,
    RangeDateFilter,
    RangeNumericFilter,
)
from .models import Budget, CategoryBudget


class CategoryBudgetInline(TabularInline):
    """
    Modern Unfold inline editor for Category budgets within a monthly Budget.
    """
    model = CategoryBudget
    extra = 1
    tab = True
    fields = ('category', 'limit')


@admin.register(Budget)
class BudgetAdmin(ModelAdmin, ImportExportModelAdmin):
    """
    Modern Unfold ModelAdmin for Budget model with currency formatting and month displays.
    """
    list_display = (
        'id',
        'display_month',
        'owner',
        'display_limit',
        'created_at',
    )
    list_filter = (
        ('month', RangeDateFilter),
        ('monthly_limit', RangeNumericFilter),
    )
    search_fields = ('owner__username', 'owner__email')
    autocomplete_fields = ('owner',)
    ordering = ('-month',)
    inlines = [CategoryBudgetInline]

    fieldsets = (
        ('Budget Plan', {
            'fields': (
                ('owner', 'month'),
                'monthly_limit',
            )
        }),
    )

    @display(description="Target Month", ordering="month", header=True)
    def display_month(self, instance: Budget):
        return [instance.month.strftime("%B %Y"), f"FY {instance.month.year}"]

    @display(description="Monthly Limit", ordering="monthly_limit")
    def display_limit(self, instance: Budget):
        return f"₹{instance.monthly_limit:,.2f}"


@admin.register(CategoryBudget)
class CategoryBudgetAdmin(ModelAdmin):
    """
    Modern Unfold ModelAdmin for CategoryBudget model.
    """
    list_display = (
        'id',
        'budget',
        'display_category',
        'display_limit',
    )
    list_filter = (
        ('category', ChoicesDropdownFilter),
        ('limit', RangeNumericFilter),
    )
    search_fields = ('budget__owner__username', 'category')
    autocomplete_fields = ('budget',)

    @display(description="Category", label=True)
    def display_category(self, instance: CategoryBudget):
        return instance.category

    @display(description="Limit Allocation", ordering="limit")
    def display_limit(self, instance: CategoryBudget):
        return f"₹{instance.limit:,.2f}"
