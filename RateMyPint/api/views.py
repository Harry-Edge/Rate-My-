from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.core import serializers as s
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q
from .models import *
from .serializers import *
import time
from django.db.models import Count

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

        locations = ['Manchester', 'Salford', 'Manchester']

        class GetMostPopularLocationAndVenueData:
            def __init__(self, location):
                self.location = location

            def find_most_popular_beer(self):
                popular_beer = Rating.objects.filter(venue__location=self.location)

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
                most_pop = Beer.objects.get(id=most_frequent(all_beer_id_list))

                return {'name': most_pop.name, 'brewery': most_pop.brewery}

            def find_most_popular_venues(self):
                venue_list = []

                top_venues = Venue.objects.filter(location=self.location) \
                                 .annotate(num_ratings=Count('rating')).order_by('-num_ratings')[:3]
                for venue in top_venues:
                    amount_of_ratings = Rating.objects.filter(venue=venue).count()
                    dic = {'name': venue.name, 'street': venue.street, 'ratings': amount_of_ratings}
                    venue_list.append(dic)

                return venue_list

            def find_top_rated_venues_for_pints(self):
                all_ratings_for_location = Rating.objects.filter \
                    (venue__location=self.location).order_by('-overall_rating')
                repeat_done_venues_ids = []
                top_rated_venue_list = []

                for rating in all_ratings_for_location:
                    if not rating.venue.id in repeat_done_venues_ids:
                        total_ratings_value = 0
                        count = 0
                        for i in Rating.objects.filter(venue__id=rating.venue.id):
                            if type(i.overall_rating) is float:
                                total_ratings_value += i.overall_rating
                                count += 1
                        if total_ratings_value:
                            average_rating = round((total_ratings_value / count), 2)
                            dic = {'name': rating.venue.name, 'street': rating.venue.street,
                                   'average_pint_rating': average_rating}
                            top_rated_venue_list.append(dic)
                        repeat_done_venues_ids.append(rating.venue.id)
                    continue
                top_rated_venue_list.sort(key=lambda x: x['average_pint_rating'], reverse=True)
                return top_rated_venue_list[:3]

            def get_total_ratings_for_location(self):

                return Rating.objects.filter(venue__location=self.location).order_by('-overall_rating').count()

            def return_all_location_data(self):

                return {
                    'location' : self.location,
                    'total_ratings': self.get_total_ratings_for_location(),
                    'most_popular_beer': self.find_most_popular_beer(),
                    'most_popular_venues': self.find_most_popular_venues(),
                    'top_rated_venues_for_pints': self.find_top_rated_venues_for_pints()
                }

        all_location_data = []

        for location in locations:
            get_data = GetMostPopularLocationAndVenueData(location)
            all_location_data.append(get_data.return_all_location_data())

        return Response(all_location_data, status=status.HTTP_200_OK)


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





