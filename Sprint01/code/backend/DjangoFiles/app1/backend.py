from django.contrib.auth.backends import ModelBackend
from .models import Account

class UniversityIDBackend(ModelBackend):
    def authenticate(self, request, university_id=None, password=None, **kwargs):
        try:
            account = Account.objects.get(university_id=university_id)
            if account.check_password(password):
                return account
        except Account.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Account.objects.get(pk=user_id)
        except Account.DoesNotExist:
            return None

##In this example, we define a custom authentication backend called `UniversityIDBackend`. The `authenticate` method takes the `university_id` and `password` as input and checks if an `Account` instance with the provided `university_id` exists. If found, it verifies the password and returns the `Account` instance. Otherwise, it returns `None`.

##The `get_user` method retrieves the user based on the `user_id` and returns the corresponding `Account` instance.