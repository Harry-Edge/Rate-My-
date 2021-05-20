from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Beer(models.Model):

    name = models.CharField(null=True, max_length=50)
    brewery = models.CharField(blank=True, max_length=50)

    def __str__(self):
        return f'{self.brewery} - {self.name}'


class Venue(models.Model):

    name = models.CharField(null=True, max_length=100)
    street = models.CharField(null=True, max_length=100)
    location = models.CharField(null=True, max_length=50)
    google_maps_id = models.CharField(null=True, max_length=50)

    def __str__(self):
        return f'{self.name} - {self.location}'


class Rating(models.Model):
    MIN = 0
    MAX = 10

    SERVING_SIZES = [('Pint', 'Pint'), ('Schooner', 'Schooner'), ('Half-Pint', 'Half-Pint'), ('1/3 Pint', '1/3 Pint')]

    beer = models.ForeignKey(Beer, null=True, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, null=True, on_delete=models.CASCADE)
    serving_size = models.CharField(null=True, choices=SERVING_SIZES, max_length=10)
    price = models.FloatField(null=True, blank=True)
    value_for_money_rating = models.FloatField(null=True, validators=[MinValueValidator(MIN), MaxValueValidator(MAX)])
    atmosphere_rating = models.FloatField(null=True, validators=[MinValueValidator(MIN), MaxValueValidator(MAX)])
    taste_rating = models.FloatField(null=True, validators=[MinValueValidator(MIN), MaxValueValidator(MAX)])
    submitted_by = models.CharField(null=True, default='Anonymous User', max_length=20)


    rating = models.FloatField(null=True, validators=[MinValueValidator(MIN), MaxValueValidator(MAX)])

    def __str__(self):
        return f'{self.beer}{self.venue}{self.serving_size}{self.rating}'


