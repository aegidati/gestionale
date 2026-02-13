from django.db import models
from accounts.models import Account


class AccountScopedModel(models.Model):
    """
    Base astratta: ogni record appartiene a un Account (tenant).
    """
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="%(class)ss")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Customer(AccountScopedModel):
    """
    Esempio di risorsa scoped (CRUD per account).
    """
    name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.name} (account={self.account_id})"
