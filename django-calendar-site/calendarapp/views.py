from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from .models import *

from zoneinfo import ZoneInfo
from datetime import datetime


# Create your views here.
def index(request):
    return redirect("/groups")


def calendar(request, group_id):
    group = Group.objects.get(id=group_id)
    context = {
        "group_id": group_id,
        "group_name": group.name,
        "signed_in": 0,
        "events": None
    }

    try:
        user_ids = request.session["users"]
    except KeyError:
        # this session isn't linked to any users yet,
        # they will have to make a new user.
        request.session["users"] = []
        return render(request, "calendarapp/calendar.html", context)
    
    client_users = []
    for user_id in user_ids:
        try:
            client_users.append(User.objects.get(id=user_id))
        except User.DoesNotExist:
            request.session["users"].remove(user_id)

    creator = None
    for user in group.members.all():
            if user in client_users:
                # TODO: having multiple accounts in the group would be weird
                context["signed_in"] = 1
                creator = user # for group creation

    if request.method == "GET":
        if context["signed_in"] == 1:
            context["events"] = [{
                "id": event.id,
                "name": event.name,
                "date": event.date,
                "info": event.info,
                "group": event.group.id,
                "creator": event.creator.username
            } for event in group.events.all()]
        return render(request, "calendarapp/calendar.html", context)
    
    if request.method == "POST":
        # event submitted
        
        # fix timezone!! submit with a timezone.
        date = request.POST["event-date"] # in format yyyy-mm-dd
        title = request.POST["event-title"]
        info = request.POST["event-info"]
        timezone = request.POST["timezone"]

        date_with_tz = datetime.fromisoformat(date)
        print(date_with_tz)
        
        event = Event(date=date, name=title, info=info, 
                      group=group, creator=creator)
        event.save()
        return redirect(group)


def groups(request):
    try:
        request.session["users"] = list(set(request.session["users"]))
        user_ids = request.session["users"]
    except KeyError:
        # this session isn't linked to any users yet
        request.session["users"] = []
    request.session.save()

    groups = get_group_dicts(request.session["users"])

    if request.method == "GET":
        context = {"groups": groups}
        return render(request, "calendarapp/groups.html", context)
    
    elif request.method == "POST":
        username = request.POST["username"]

        new_group_name = request.POST["group-name"]
        new_group = Group(name=new_group_name)
        new_group.save()
        # TODO: change new group id to be random.

        user = User(username=username, group=new_group)
        user.save()
        new_group.creator = user
        new_group.save()
        try:
            request.session["users"].append(user.id)
        except KeyError:
            request.session["users"] = {user.id}
        request.session.save()

        return redirect(new_group)


# not its own webpage, just for signing up
def signup(request):

    if request.method == "POST":
        try:
            request.session["users"] = list(set(request.session["users"]))
            user_ids = request.session["users"]
        except KeyError:
            # this session isn't linked to any users yet
            request.session["users"] = []
        request.session.save()

        group_id = request.POST["group-id"]
        group = Group.objects.get(id=group_id)
        try:
            new_username = request.POST["calendarapp-username"]
            group_members = group.members.all()
            for member in group_members:
                if member.id in request.session["users"]:
                    # already signed in!
                    return redirect(group)
                elif member.username == new_username:
                    # this user exists, GIVE THEM THE EXISTING USER
                    request.session["users"].append(member.id)
                    request.session.save()
                    return redirect(group)

            # user doesn't exist in this group, make one
            new_user = User(username=new_username, group=group)
            new_user.save()
            request.session["users"].append(new_user.id)
            request.session.save()
        except KeyError:
            # post request does not contain the "calendarapp-username" field
            print("signup request does not contain calendarapp-username field")

        return redirect(group)

def get_group_dicts(users):
    # input: a list of user ids.
    # output: a list of groups as dictionaries.
    groups = []
    for user_id in users:
        try:
            user = User.objects.get(id=user_id)
            group = user.group # get id, groupname, creator
            groups.append({"id": group.id,
                           "name": group.name,
                           "creator": group.creator.username,
                           "members": [user.username for user in group.members.all()]})
        except User.DoesNotExist:
            users.remove(user_id)

    return groups

