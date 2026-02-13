from django.conf import settings
from django.db import models


class Account(models.Model):
    """
    Workspace/Tenant: un contenitore logico per dati e utenti.
    """
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name} (id={self.id})"


class Membership(models.Model):
    """
    Relazione tra User e Account con ruolo fisso.
    Un utente può appartenere a più Account.
    """
    ROLE_OWNER = "OWNER"
    ROLE_ADMIN = "ADMIN"
    ROLE_MEMBER = "MEMBER"

    ROLE_CHOICES = [
        (ROLE_OWNER, "Owner"),
        (ROLE_ADMIN, "Admin"),
        (ROLE_MEMBER, "Member"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "account")

    def __str__(self) -> str:
        return f"{self.user} -> {self.account} [{self.role}]"
