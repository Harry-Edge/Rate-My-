from rest_framework import serializers
from .models import *


class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rating
        fields = ('id', 'beer', 'venue', 'serving_size', 'price', 'submitted_by', 'rating',)


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ('id', 'name', 'location')


class GenericSerializer(serializers.ModelSerializer):
    beer_name = serializers.CharField()
    brewery_name = serializers.CharField()
    price = serializers.CharField()

    class Meta:
        model = Rating
        fields = ('beer_name', 'brewery_name', 'price')

