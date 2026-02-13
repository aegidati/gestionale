from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import MyAccountsListView
from core.views import CustomerListCreateView, CustomerDetailView

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Accounts (my accounts)
    path("api/accounts/", MyAccountsListView.as_view(), name="my_accounts"),

    # Scoped Customers
    path(
        "api/accounts/<int:account_id>/customers/",
        CustomerListCreateView.as_view(),
        name="customers_list_create",
    ),
    path(
        "api/accounts/<int:account_id>/customers/<int:customer_id>/",
        CustomerDetailView.as_view(),
        name="customers_detail",
    ),
]
