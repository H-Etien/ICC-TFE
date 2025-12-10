from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsProjectOwnerOrReadOnly(BasePermission):
    """
    - Les membres et le owner peuvent lire (GET).
    - Les membres et le owner peuvent mettre à jour (PUT/PATCH).
    - Seul le owner peut DELETE.
    """
    def has_object_permission(self, request, view, obj):
        # lecture autorisée si membre ou owner
        if request.method in SAFE_METHODS:
            return (request.user == obj.owner) or (request.user in obj.members.all())

        # Pour updates (PUT/PATCH), membres ou owner
        if request.method in ('PUT', 'PATCH'):
            return (request.user == obj.owner) or (request.user in obj.members.all())

        # DELETE uniquement owner
        if request.method == 'DELETE':
            return (request.user == obj.owner)

        # par défaut refuser
        return False