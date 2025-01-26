from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from .models import *

# Create your views here.
def index(request):
    return redirect("/groups")


def calendar(request, group_id):
    group = Group.objects.get(id=group_id)
    context = {
        "group_id": group_id,
        "group_name": group.group_name,
        "signed_in": 0
    }
    
    if request.method == "GET":
        try:
            user_ids = request.session["users"]
            client_users = []
            for user_id in user_ids:
                try:
                    client_users.append(User.objects.get(id=user_id))
                except User.DoesNotExist:
                    request.session["users"].remove(user_id)

            for user in group.members.all():
                if user in client_users:
                    # having multiple accounts in the group would be weird
                    print("user is signed in.")
                    context["signed_in"] = 1
        except KeyError:
            # this session isn't linked to any users yet,
            # they will have to make a new user.
            request.session["users"] = []

        return render(request, "calendarapp/calendar.html", context)
    
    if request.method == "POST":
        try:
            new_username = request.POST["calendarapp-username"]
            group_members = group.members.all()
            for member in group_members:
                if member.username == new_username:
                    # this user exists, GIVE THEM THE EXISTING USER
                    request.session["users"].append(member.id)
                    request.session.save()
                    context["signed_in"] = 1
                    return JsonResponse(context)

            # user doesn't exist in this group, make one
            new_user = User(username=new_username)
            new_user.save()
            group.members.add(new_user)
            group.save()
            request.session["users"].append(new_user.id)
            request.session.save()
            context["signed_in"] = 1
        except KeyError:
            # post request does not contain the "calendarapp-username" field
            pass
        return JsonResponse(context)


def groups(request):

    request.session.save()

    try:
        user_ids = request.session["users"]
    except KeyError:
        # this session isn't linked to any users yet
        request.session["users"] = []

    # groups = [model_to_dict(group) for group in Group.objects.filter(members="1")]
    # print(groups)

    if request.method == "GET":
        context = {"groups": groups}
        return render(request, "calendarapp/groups.html", context)
    
    elif request.method == "POST":
        username = request.POST["username"]
        user = User(username=username)
        user.save()

        new_group_name = request.POST["group-name"]
        new_group = Group(group_name=new_group_name, 
                          group_creator=user)
        new_group.save()
        new_group.members.add(user)
        new_group.save()
        try:
            request.session["users"].append(user.id)
        except KeyError:
            request.session["users"] = [user.id]
        request.session.save()

        return redirect(new_group)
