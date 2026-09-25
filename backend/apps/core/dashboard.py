from django.db.models import Sum, Count


def dashboard_callback(request, context):
    """
    Callback function that injects KPI metrics into the Unfold Admin index page context.
    """
    from apps.expenses.models import Expense
    from apps.budgets.models import Budget
    from apps.users.models import User

    expense_stats = Expense.objects.aggregate(
        total_amount=Sum('amount'),
        total_count=Count('id')
    )
    total_users = User.objects.count()
    total_budgets = Budget.objects.count()

    context.update({
        "kpi_total_amount": expense_stats.get('total_amount') or 0.0,
        "kpi_total_count": expense_stats.get('total_count') or 0,
        "kpi_total_users": total_users,
        "kpi_total_budgets": total_budgets,
    })
    return context
