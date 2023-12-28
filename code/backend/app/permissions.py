from rest_framework.permissions import BasePermission


class IsSupervisor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.type=='manager' or request.user.type=='supervisor')

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.type=='manager' 
    
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.type=='employee'