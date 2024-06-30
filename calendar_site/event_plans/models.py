import datetime

from django.db import models
from django.utils import timezone

# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=255)
    info = models.TextField(default="")
    date = models.DateField()
    group = models.UUIDField() # UUID field? each group gets a uuid?
    creator = models.CharField(max_length=255, default="None") # only creator / admin can delete the event
    
    def __str__(self):
        return self.title # maybe include date here as well
    
    def get_events(given_date):
        return list(Event.objects.filter(date=given_date))
    
    def create_event(title, date, info="No information provided.",  group=0, creator="None"):
        Event.objects.create(title = title, date = date, info = info, group = group, creator = creator)

