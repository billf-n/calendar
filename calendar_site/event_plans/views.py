from django.shortcuts import render
from django.http import HttpResponse, HttpRequest

# Create your views here.

def event_plans(response):
    return render(response, "calendar.html")

