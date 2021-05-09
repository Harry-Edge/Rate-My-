from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('top-pints', TopPints.as_view()),
    path('get-top-rated-pints-in-area', GetTopRatedPintsInArea.as_view()),
    path('search-location', SearchLocations.as_view()),
    path('get-beer-names', GetBeerNames.as_view()),
    path('submit-rating', SubmitBeerRating.as_view())
]
