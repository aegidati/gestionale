from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Account
from .serializers import AccountSerializer


class MyAccountsListView(generics.ListAPIView):
    """
    Restituisce gli account a cui l'utente autenticato appartiene.
    """
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Restituisce gli account in cui l'utente ha una membership attiva
        return Account.objects.filter(
            memberships__user=user,
            memberships__is_active=True
        ).distinct()
