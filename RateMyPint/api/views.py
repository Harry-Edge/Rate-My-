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
        print(data)

        return Response(data, status=status.HTTP_200_OK)


class SubmitBeerRating(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):

        serializer = GenericSerializer(data=request.data)
        print(serializer)

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
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)








