from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
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

        return Response(top_list, status=status.HTTP_200_OK)


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

            return Response(top_list, status=status.HTTP_200_OK)
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

            return Response(top_list, status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)





