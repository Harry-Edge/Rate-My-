from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.core import serializers as s
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q
from .models import *
from .serializers import *
import time

delay_local_host_server_time = 0.25


class TopPints(APIView):
    permission_classes = (AllowAny, )

    def get(self, request):
        time.sleep(delay_local_host_server_time)
        top_list = []

        for count, beer_entry in enumerate(Rating.objects.filter().order_by('-rating')):
            serialized_data = RatingSerializer(beer_entry).data
            serialized_data['rank'] = count + 1 if count != 0 else 1
            serialized_data['beer'] = beer_entry.beer.name
            serialized_data['brewery'] = beer_entry.beer.brewery
            serialized_data['venue'] = beer_entry.venue.name
            serialized_data['location'] = beer_entry.venue.location
            top_list.append(serialized_data)

        return Response(top_list * 4, status=status.HTTP_200_OK)


class GetTopRatedPintsInArea(APIView):

    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = VenueSerializer(data=request.data)

        if serializer.is_valid():
            time.sleep(delay_local_host_server_time)

            print(serializer.data.get('location'))

            location = serializer.data.get('location')

            top_list = []

            for count, beer_entry in enumerate(Rating.objects.filter(venue__location=location).order_by('-rating')):
                serialized_data = RatingSerializer(beer_entry).data
                serialized_data['rank'] = count + 1 if count != 0 else 1
                serialized_data['beer'] = beer_entry.beer.name
                serialized_data['brewery'] = beer_entry.beer.brewery
                serialized_data['venue'] = beer_entry.venue.name
                serialized_data['location'] = beer_entry.venue.location
                top_list.append(serialized_data)

            print(top_list)

            return Response(top_list * 5, status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SearchLocations(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):

        serializer = VenueSerializer(data=request.data)

        if serializer.is_valid():
            location = serializer.data.get('location')
            top_list = []

            for count, beer_entry in enumerate(Rating.objects.filter(Q(venue__location__icontains=location) |
                                                                     Q(venue__name__icontains=location)).order_by('-rating')):
                serialized_data = RatingSerializer(beer_entry).data
                serialized_data['rank'] = count + 1 if count != 0 else 1
                serialized_data['beer'] = beer_entry.beer.name
                serialized_data['brewery'] = beer_entry.beer.brewery
                serialized_data['venue'] = beer_entry.venue.name
                serialized_data['location'] = beer_entry.venue.location
                top_list.append(serialized_data)

            return Response(top_list * 3, status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)



class GetBeerNames(APIView):
    permission_classes = (AllowAny, )

    def get(self, request):

        data = Beer.objects.filter().values()

        return Response(data, status=status.HTTP_200_OK)


class SubmitBeerRating(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):

        #serializer = RatingSerializer(data=request.data)

        """
        sort out thing can be in lower can if manullay typed

        or dont let a use have the option to type


        """

        submitted_data = request.data

        if submitted_data:
            beer_object = Beer.objects.filter(name=submitted_data['beer']['name'])
            venue_object = Venue.objects.filter(google_maps_id=submitted_data['venue']['googleMapsPlaceID'])
            if not beer_object:
                beer_object = Beer.objects.create(name=submitted_data['beer']['name'],
                                                  brewery=submitted_data['beer']['brewery'])
            else:
                beer_object = beer_object[0]
            if not venue_object:
                venue_object = Venue.objects.create(name=submitted_data['venue']['name'],
                                                    street=submitted_data['venue']['street'],
                                                    location=submitted_data['venue']['location'],
                                                    google_maps_id=submitted_data['venue']['googleMapsPlaceID'])
            else:
                venue_object = venue_object[0]

            if not submitted_data['submitted_by']:
                submitted_data['submitted_by'] = "Anonymous User"

            rating_object = Rating.objects.create(beer=beer_object,
                                                  venue=venue_object,
                                                  serving_size=submitted_data['serving_size'],
                                                  price=float(submitted_data['price']),
                                                  value_for_money_rating=float(submitted_data['value_for_money_rating']),
                                                  atmosphere_rating=float(submitted_data['atmosphere_rating']),
                                                  taste_rating=float(submitted_data['taste_rating']),
                                                  submitted_by=submitted_data['submitted_by'])

            print(rating_object)
            return Response("Pint Entry Added Successfully", status=status.HTTP_200_OK)


        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


        """
        if serializer.is_valid():
            print(serializer)
            print(serializer.data.get('beer_name'))
            print(serializer.data.get('brewery_name'))
            price = int(serializer.data.get('price'))
            print(price)

            beer_entry = Beer.objects.filter(name=serializer.data.get('beer_name'))
            if beer_entry.exists():
                beer_object = Beer.objects.get(name=serializer.data.get('beer_name'))
                Rating.objects.create(beer=beer_object, price=int(serializer.data.get('price')))
            else:
                print("created new beer entery ")
                
        

            return Response("All Good ", status=status.HTTP_200_OK)
            """









