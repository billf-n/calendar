from django.urls import path

from . import views

app_name = "calendarapp"
urlpatterns = [
    path("", views.index, name="index"),
    path("groups", views.groups, name="groups"),
    path("calendar/<str:group_id>", views.calendar, name="calendar"),
    path("signup", views.signup, name="signup"),
    path("leavegroup/<str:group_id>", views.leave_group, name="leave_group")
]
