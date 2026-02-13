from accounts.models import Membership


def get_membership(user, account_id):
    if not user or not user.is_authenticated:
        return None
    return (
        Membership.objects.filter(
            user=user, account_id=account_id, is_active=True
        ).only("id", "role").first()
    )


def is_admin_role(role: str) -> bool:
    return role in (Membership.ROLE_OWNER, Membership.ROLE_ADMIN)
