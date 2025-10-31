from django.db import models

class Concession(models.Model):
    nom = models.CharField(max_length=100)
    adresse = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    visite = models.BooleanField(default=False)
    interet = models.CharField(max_length=50, blank=True)
    TYPES = [
        ("ZTT", "Zone de Transit et de Tri"),
        ("RES", "Résidence"),
        ("ENT",'Entreprise'),
        ("COM","Commerce"),
        ("AUT","Autre")
    ]

    type = models.CharField(max_length=3,choices=TYPES,default='RES')

    def __str__(self):
        return self.nom
