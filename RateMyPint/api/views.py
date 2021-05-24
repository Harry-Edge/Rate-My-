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

        def get_list():
            for count, beer_entry in enumerate(
                    Rating.objects.filter().order_by('-overall_rating')):
                def add_entry():
                    serialized_data = RatingSerializer(beer_entry).data
                    serialized_data['beer'] = beer_entry.beer.name
                    serialized_data['brewery'] = beer_entry.beer.brewery
                    serialized_data['venue'] = {'name': beer_entry.venue.name, 'street': beer_entry.venue.street}
                    serialized_data['location'] = beer_entry.venue.location
                    serialized_data['lat'] = beer_entry.venue.latitude
                    serialized_data['lng'] = beer_entry.venue.longitude
                    serialized_data['ratings'] = 1
                    top_list.append(serialized_data)

                if count == 0:
                    add_entry()
                else:
                    def check_repeats():
                        for count, entry in enumerate(top_list):
                            if beer_entry.beer.name == entry['beer'] and beer_entry.venue.name == entry['venue']['name']:
                                top_list[count]['ratings'] += 1
                                top_list[count]['price'] += beer_entry.price
                                return True

                    if not check_repeats():
                        add_entry()
            for count, entry in enumerate(top_list):
                entry['price'] = round((entry['price'] / entry['ratings']), 2)
                entry['rank'] = count + 1

        get_list()

        return Response(top_list, status=status.HTTP_200_OK)


class GetTopRatedPintsInArea(APIView):

    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = VenueSerializer(data=request.data)

        if serializer.is_valid():
            time.sleep(delay_local_host_server_time)
            location = serializer.data.get('location')
            top_list = []

            def get_list():
                for count, beer_entry in enumerate(Rating.objects.filter(venue__location=location).order_by('-overall_rating')):
                    def add_entry():
                        serialized_data = RatingSerializer(beer_entry).data
                        serialized_data['beer'] = beer_entry.beer.name
                        serialized_data['brewery'] = beer_entry.beer.brewery
                        serialized_data['venue'] = {'name': beer_entry.venue.name, 'street': beer_entry.venue.street}
                        serialized_data['location'] = beer_entry.venue.location
                        serialized_data['lat'] = beer_entry.venue.latitude
                        serialized_data['lng'] = beer_entry.venue.longitude
                        serialized_data['ratings'] = 1
                        top_list.append(serialized_data)
                    if count == 0:
                        add_entry()
                    else:
                        def check_repeats():
                            for count, entry in enumerate(top_list):
                                if beer_entry.beer.name == entry['beer'] and beer_entry.venue.name == entry['venue']['name']:
                                    top_list[count]['ratings'] += 1
                                    top_list[count]['price'] += beer_entry.price
                                    return True
                        if not check_repeats():
                            add_entry()
                for count, entry in enumerate(top_list):
                    entry['price'] = round((entry['price'] / entry['ratings']), 2)
                    entry['rank'] = count + 1
            get_list()

            return Response(top_list , status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SearchLocations(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):

        serializer = VenueSerializer(data=request.data)

        if serializer.is_valid():
            location = serializer.data.get('location')
            top_list = []

            for count, beer_entry in enumerate(Rating.objects.filter(Q(venue__location__icontains=location) |
                                                                     Q(venue__name__icontains=location)).order_by('-overall_rating')):
                serialized_data = RatingSerializer(beer_entry).data
                serialized_data['rank'] = count + 1
                serialized_data['beer'] = beer_entry.beer.name
                serialized_data['brewery'] = beer_entry.beer.brewery
                serialized_data['venue'] = beer_entry.venue.name
                serialized_data['location'] = beer_entry.venue.location
                top_list.append(serialized_data)

            return Response(top_list * 3, status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class GetMostPopularLocations(APIView):
    permission_classes = (AllowAny, )


    def get(self, request):

        """
        1. get total ratings of a city
        2. get most popular beer of the given city
        3. get most popular venues by amount of ratings
        4. get the venues which have the best rated pints

        5. Find the most popular location

        """
        locations = ['Manchester', 'Salford', 'Manchester']

        data1 = []

        def get_location_data():
            for location in locations:
                data_dic = {}

                # Adds location to dic
                data_dic['location'] = location
                # Adds total pints ratings to dic
                data_dic['total_ratings'] = Rating.objects.filter(venue__location=location).order_by('-overall_rating').count()

                def find_most_popular_beer():
                    popular_beer = Rating.objects.filter(venue__location=location)
                    def most_frequent(list):
                        counter = 0
                        num = list[0]
                        for i in list:
                            curr_frequency = list.count(i)
                            if curr_frequency > counter:
                                counter = curr_frequency
                                num = i
                        return num

                    all_beer_id_list = []
                    for i in popular_beer:
                        all_beer_id_list.append(i.beer.id)
                    all_beer_id_list.sort()
                    return Beer.objects.get(id=most_frequent(all_beer_id_list))

                def find_most_popular_venues():
                    venues = Rating.objects.filter(venue__location=location)
                    for i in venues:
                        print(i.venue)
                find_most_popular_venues()



                most_popular_beer = find_most_popular_beer()
                data_dic['most_popular_beer'] = {'name': most_popular_beer.name, 'brewery': most_popular_beer.brewery}
                data1.append(data_dic)
        get_location_data()

        print(data1)
        return Response(data1, status=status.HTTP_200_OK)


class GetBeerNames(APIView):
    permission_classes = (AllowAny, )

    def get(self, request):

        data = Beer.objects.filter().values().order_by('name')

        return Response(data, status=status.HTTP_200_OK)


class SubmitBeerRating(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
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
                                                    google_maps_id=submitted_data['venue']['googleMapsPlaceID'],
                                                    latitude=submitted_data['venue']['latitude'],
                                                    longitude=submitted_data['venue']['longitude'])
            else:
                venue_object = venue_object[0]

            rating_object = Rating.objects.create(beer=beer_object,
                                                  venue=venue_object,
                                                  serving_size=submitted_data['serving_size'],
                                                  price=float(submitted_data['price']),
                                                  venue_rating=float(submitted_data['venue_rating']),
                                                  atmosphere_rating=float(submitted_data['atmosphere_rating']),
                                                  taste_rating=float(submitted_data['taste_rating']),
                                                  submitted_by=submitted_data['submitted_by'])

            rating_object.overall_rating = round(((rating_object.venue_rating +
                                            rating_object.atmosphere_rating + rating_object.taste_rating) / 3), 2)
            rating_object.save()

            return Response("Pint Entry Added Successfully", status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class ReportABug(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = BugReportsSerializer(data=request.data)

        if serializer.is_valid():
            BugReports.objects.create(message=serializer.data.get('message'))
            return Response('Successfully Submitted Bug Report', status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class Contact(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = ContactMessagesSerializer(data=request.data)

        if serializer.is_valid():

            ContactMessages.objects.create(message=serializer.data.get('message'),
                                           name=serializer.data.get('name') )

            return Response("Message Sent", status=status.HTTP_200_OK)

        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)





