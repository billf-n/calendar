from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    path("/calendar/", consumers.EventsConsumer.as_asgi(), name="events"),
]
