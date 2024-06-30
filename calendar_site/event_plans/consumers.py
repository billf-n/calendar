import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from . import models

class EventsConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, code):
        return super().disconnect(code)

    def load_events(self, event):
        event_list = models.Event.get_events(event["date"])
        self.send(event_list)

    def create_event(self, event):
        models.Event.create_event(event["title"], event["date"], event["info"], event["group"], event["username"])

