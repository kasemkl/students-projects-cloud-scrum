from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Account)
admin.site.register(Manager)
admin.site.register(Supervisor)
admin.site.register(Project)
admin.site.register(Requests)
admin.site.register(SuggestionProjects)
admin.site.register(Products)
admin.site.register(Department)