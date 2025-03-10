from django.db import models

import uuid

class Group(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=32)
    creator = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="created_groups")

    def __str__(self):
        return "Name: "+ self.name + \
        "; Creator: " + str(self.creator) + \
        "; Members:" + str(self.members)

    def get_absolute_url(self):
        return "/calendar/%s" % self.id


class User(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    username = models.CharField(max_length=32)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name = "members")
    
    def __str__(self):
        return "id: " + str(self.id) + "; Username:" + self.username
    
    def create_user(username: str, group: Group):
        new_id = str(uuid.uuid4())
        new_user = User(id=new_id, username=username, group=group)
        new_user.save()
        return


class Event(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=64)
    info = models.CharField(max_length=500)
    date = models.DateTimeField()
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="events")
    creator = models.ForeignKey("User", on_delete=models.SET_NULL, related_name="created_events",null=True)

    def __str__(self):
        return "Name: " + self.name + "; Group: " + str(self.group.id)