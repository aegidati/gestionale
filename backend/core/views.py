from django.shortcuts import render


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound

from .models import Customer
from .serializers import CustomerSerializer
from .permissions import get_membership, is_admin_role


class CustomerListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomerSerializer

    def get_account_id(self):
        return int(self.kwargs["account_id"])

    def ensure_can_access(self):
        account_id = self.get_account_id()
        membership = get_membership(self.request.user, account_id)
        if not membership:
            raise PermissionDenied("You are not a member of this account.")
        return membership

    def get_queryset(self):
        self.ensure_can_access()
        return Customer.objects.filter(account_id=self.get_account_id()).order_by("id")

    def perform_create(self, serializer):
        membership = self.ensure_can_access()
        if not is_admin_role(membership.role):
            raise PermissionDenied("You need ADMIN/OWNER role to create customers.")
        serializer.save(account_id=self.get_account_id())


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomerSerializer

    def get_account_id(self):
        return int(self.kwargs["account_id"])

    def ensure_can_access(self):
        account_id = self.get_account_id()
        membership = get_membership(self.request.user, account_id)
        if not membership:
            raise PermissionDenied("You are not a member of this account.")
        return membership

    def get_object(self):
        self.ensure_can_access()
        obj = Customer.objects.filter(
            account_id=self.get_account_id(),
            id=self.kwargs["customer_id"],
        ).first()
        if not obj:
            raise NotFound("Customer not found in this account.")
        return obj

    def perform_update(self, serializer):
        membership = self.ensure_can_access()
        if not is_admin_role(membership.role):
            raise PermissionDenied("You need ADMIN/OWNER role to update customers.")
        serializer.save()

    def perform_destroy(self, instance):
        membership = self.ensure_can_access()
        if not is_admin_role(membership.role):
            raise PermissionDenied("You need ADMIN/OWNER role to delete customers.")
        instance.delete()
