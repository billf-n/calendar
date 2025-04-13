from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from django.core.exceptions import FieldError
from .models import *

import json
import uuid
from zoneinfo import ZoneInfo
from datetime import datetime

DELETED_USER_PLACEHOLDER = "Deleted User"

def create_id():
    return str(uuid.uuid4())

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
            context["username"] = user.username
            creator = user  # for group creation (POST)

    if request.method == "GET":
        if context["signed_in"] == 1:
            context["events"] = [{
                "id": event.id,
                "name": event.name,
                "date": event.date,
                "info": event.info,
                "group": event.group.id,
                "attendees": [attendee.username for attendee in event.attendees.all()],
                "creator": event.creator.username 
                    if event.creator is not None else DELETED_USER_PLACEHOLDER,
            } for event in group.events.all()] 
        return render(request, "calendarapp/calendar.html", context)
    
    if request.method == "POST":
        # event submitted
        if creator is None:
            return render(request, "calendarapp/calendar.html", context)

        # fix timezone!! submit with a timezone.
        date = request.POST["event-date"] # in format yyyy-mm-dd
        time = request.POST["event-time"]
        title = request.POST["event-title"]
        info = request.POST["event-info"]
        timezone = request.POST["timezone"]

        # set both date and time
        date_with_tz = datetime.strptime((date+"-"+time), "%Y-%m-%d-%H:%M")
        date_with_tz = date_with_tz.replace(tzinfo=ZoneInfo(timezone))
        print(date_with_tz)
        
        event = Event(id=create_id(), date=date_with_tz, name=title, info=info, 
                      group=group, creator=creator)
        event.save()
        return redirect(group)


def event(request, group_id):
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

    if request.method == "POST":
        event = Event.objects.get(id=request.POST["event_id"])
        for user_id in user_ids:
            user = User.objects.get(user_id)
            if user.group == group:
                event.attendees.add(user)
                break
        return HttpResponse(status=200)


def going(request, group_id, event_id):
    try:
        request.session["users"] = list(set(request.session["users"]))
        user_ids = request.session["users"]
    except KeyError:
        # this session isn't linked to any users yet
        request.session["users"] = []
    
    client_users = []
    for user_id in user_ids:
        try:
            client_users.append(User.objects.get(id=user_id))
        except User.DoesNotExist:
            request.session["users"].remove(user_id)

    event = Event.objects.get(id=event_id)
    group = Group.objects.get(id=group_id)
    current_user = None
    for user in group.members.all():
        if user in client_users:
            # TODO: having multiple accounts in the group would be weird
            current_user = user
    if current_user is None:
        return HttpResponse(400)
    event.attendees.add(current_user)
    event.save()
    return HttpResponse(headers={"username": current_user.username})



def groups(request):
    try:
        request.session["users"] = list(set(request.session["users"]))
        user_ids = request.session["users"]
    except KeyError:
        # this session isn't linked to any users yet
        request.session["users"] = []
    request.session.save()

    groups = get_group_dicts(request.session["users"])
    print(groups)
    if request.method == "GET":
        context = {"groups": groups}
        return render(request, "calendarapp/groups.html", context)
    
    elif request.method == "POST":
        username = request.POST["username"]

        new_group_name = request.POST["group-name"]
        new_group = Group(id=create_id(), name=new_group_name)
        new_group.save()

        user = User(id=create_id(), username=username, group=new_group)
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
            new_user = User(id=create_id(), username=new_username, group=group)
            new_user.save()
            request.session["users"].append(new_user.id)
            request.session.save()
        except KeyError:
            # post request does not contain the "calendarapp-username" field
            raise KeyError

        return redirect(group)


def leave_group(request, group_id):
    if request.method == "POST":
        body = json.loads(request.body)
        username = body["username"]
        group = Group.objects.get(id=group_id)
        user = User.objects.get(username=username, group=group)
        # this line below is the authentication? 
        # checking if the session actually has used that user.
        if user.id in request.session["users"]:
            request.session["users"].remove(user.id)
            user.delete()
            return HttpResponse()
        else:
            return HttpResponse(status=403)


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
                           "creator": group.creator.username 
                            if group.creator is not None else DELETED_USER_PLACEHOLDER,
                           "members": [user.username for user in group.members.all()],
                           "user": user.username})
        except User.DoesNotExist:
            users.remove(user_id)

    return groups

