from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from unfold.decorators import display
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    """
    Enhanced UserAdmin with modern Unfold styling, badge indicators, and search.
    """
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    list_display = (
        'display_user',
        'email',
        'phone_number',
        'display_staff',
        'display_active',
        'date_joined',
    )
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone_number')
    ordering = ('-date_joined',)
    list_per_page = 20

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Smart Expenses Profile', {
            'classes': ['tab'],
            'fields': ('phone_number', 'bio')
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Smart Expenses Profile', {
            'classes': ['tab'],
            'fields': ('phone_number', 'bio')
        }),
    )

    @display(description="User Account", header=True)
    def display_user(self, instance: User):
        full_name = instance.get_full_name()
        subtitle = full_name if full_name else (instance.email if instance.email else "Registered User")
        return [instance.username, subtitle]

    @display(description="Staff Status", boolean=True)
    def display_staff(self, instance: User):
        return instance.is_staff

    @display(description="Active", boolean=True)
    def display_active(self, instance: User):
        return instance.is_active
