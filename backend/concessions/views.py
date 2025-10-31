from django.shortcuts import render
from rest_framework import viewsets
from .models import Concession
from .serializers import ConcessionSerializer

class ConcessionViewSet(viewsets.ModelViewSet):
    queryset = Concession.objects.all()
    serializer_class = ConcessionSerializer
