from django.urls import path

from . import views

app_name = "calendarapp"
urlpatterns = [
    path("", views.index, name="index"),
    path("groups", views.groups, name="groups"),
    path("calendar/<str:group_id>", views.calendar, name="calendar"),
    path("signup", views.signup, name="signup"),
    path("leavegroup/<str:group_id>", views.leave_group, name="leave_group"),
    path("going/<str:group_id>&<str:event_id>", views.change_event_attendance, name="change_event_attendance"),
    path("delete_event/<str:group_id>&<str:event_id>", views.delete_event, name="delete_event")
]
