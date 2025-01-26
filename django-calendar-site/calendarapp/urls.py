from django.urls import path

from . import views

app_name = "calendarapp"
urlpatterns = [
    path("", views.index, name="index"),
    path("groups", views.groups, name="groups"),
    path("calendar/<int:group_id>", views.calendar, name="calendar"),
]
