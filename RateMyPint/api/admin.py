from django.contrib import admin
from .models import *


@admin.register(Beer)
class BeerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'brewery')


@admin.register(Venue)
class Venue(admin.ModelAdmin):
    list_display = ('id', 'name', 'location')


@admin.register(Rating)
class Rating(admin.ModelAdmin):
    list_display = ('id', 'beer', 'venue', 'serving_size', 'price', 'submitted_by', 'rating')

@admin.register(BugReports)
class BugReports(admin.ModelAdmin):
    list_display = ('id', 'message', 'submitted_on')