from rest_framework import serializers
from .models import Account, Membership


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "name", "created_at"]


class MembershipSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ["id", "account", "role", "is_active", "created_at"]
