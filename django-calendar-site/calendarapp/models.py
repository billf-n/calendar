from django.db import models


class Group(models.Model):
    group_name = models.CharField(max_length=32)
    group_creator = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="created_groups")

    def __str__(self):
        return "Name: "+ self.group_name + \
        "; Creator: " + str(self.group_creator) + \
        "; Members:" + str(self.members)

    def get_absolute_url(self):
        return "/calendar/%s" % self.id

class User(models.Model):
    username = models.CharField(max_length=32)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name = "members")
    def __str__(self):
        return "id: " + str(self.id) + "; Username:" + self.username
    


class Event(models.Model):
    id = models.IntegerField(primary_key=True)
    event_name = models.CharField(max_length=64)
    info = models.CharField(max_length=500)
    date = models.DateTimeField()
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="events")
    event_creator = models.ForeignKey("User", on_delete=models.SET_NULL, related_name="created_events",null=True)

    def __str__(self):
        return "Name: " + self.event_name + "; Group: " + self.group