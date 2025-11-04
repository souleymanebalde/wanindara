from django.shortcuts import render
from rest_framework import viewsets
from .models import Concession
from .serializers import ConcessionSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .optimizer import tsp

class ConcessionViewSet(viewsets.ModelViewSet):
    queryset = Concession.objects.all()
    serializer_class = ConcessionSerializer

@api_view(['GET'])
def optimize_route(request):
    points = list(Concession.objects.values('id', 'nom', 'latitude', 'longitude'))
    route, total_dist = tsp(points)
    return Response({
        "optimized_route": route,
        "total_distance_km": total_dist
    })