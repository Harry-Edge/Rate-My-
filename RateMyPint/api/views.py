from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
import time


class TopPints(APIView):
    permission_classes = (AllowAny, )

    def get(self, request):
        time.sleep(0.1)
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