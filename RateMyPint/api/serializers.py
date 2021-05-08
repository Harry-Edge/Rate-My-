from rest_framework import serializers
from .models import *


class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rating
        fields = ('id', 'beer', 'venue', 'serving_size', 'price', 'submitted_by', 'rating')


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ('id', 'name', 'location')
