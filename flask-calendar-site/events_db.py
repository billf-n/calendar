
from sqlalchemy import create_engine, Table, Column, String, Date, Uuid, ForeignKey, select
from sqlalchemy.orm import Session, DeclarativeBase, Mapped, mapped_column, relationship
from typing import List


import uuid
import datetime
import hashlib
import secrets

engine = create_engine("sqlite:///events.sqlite3")

class Base(DeclarativeBase):
    pass

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String)
    creator: Mapped[str] = mapped_column(String, default="None")
    group: Mapped[int] = mapped_column(ForeignKey("groups.id"))
    info: Mapped[str] = mapped_column(String)
    date: Mapped[datetime.date] = mapped_column(Date)

    def to_dict(self):
        # for use in returning events to the client, so no ID
        return {
            "title": self.title,
            "creator": self.creator,
            "info": self.info,
            "date": self.date.strftime("%Y-%m-%d"), # using ISO format here, to return.
        }

user_group_table = Table(
    "user_group_table",
    Base.metadata,
    Column("username", ForeignKey("users.username"), primary_key=True),
    Column("id", ForeignKey("groups.id"), primary_key=True),
)

user_invite_table = Table(
    "user_invite_table",
    Base.metadata,
    Column("username", ForeignKey("users.username"), primary_key=True),
    Column("id", ForeignKey("groups.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    username: Mapped[str] = mapped_column(String, primary_key=True)
    password: Mapped[bytes] = mapped_column()
    salt: Mapped[bytes] = mapped_column()
    tokens: Mapped[List["AuthToken"]] = relationship()
    groups: Mapped[List["Group"]] = relationship(
        secondary=user_group_table,
        back_populates="users"
    )
    group_invites: Mapped[List["Group"]] = relationship(
        secondary=user_invite_table,
        back_populates="invitees"
    )

class Group(Base):
    __tablename__ = "groups"
    id: Mapped[int] = mapped_column(primary_key=True)
    group_name: Mapped[str] = mapped_column(String)
    users: Mapped[List[User]] = relationship(
        secondary=user_group_table, 
        back_populates="groups"
    )
    invitees: Mapped[List[User]] = relationship(
        secondary=user_invite_table, 
        back_populates="group_invites"
    )
    creator: Mapped[str] = mapped_column(ForeignKey("User.username"))
    def to_dict(self):
        return {
            "group_id": self.id,
            "group_name": self.group_name,
            "creator": self.creator,
            "users": self.users,
        }

class AuthToken(Base):
    __tablename__ = "tokens"
    token: Mapped[str] = mapped_column(String, primary_key=True)
    user: Mapped[str] = mapped_column(ForeignKey("users.username"))


Base.metadata.create_all(engine)


def load_events(requested_date: datetime.date):
    with Session(engine) as session:
        result = list(session.execute(select(Event).filter_by(date=requested_date)))
        for index, event in enumerate(result):
            result[index] = event[0].to_dict()
        return result


def create_event(title: str, info: str, date: datetime.date, creator: str = "None"):
    with Session(engine) as session:
        new_event = Event(title=title, info=info, date=date, creator=creator)
        session.add(new_event)
        session.commit()

def add_user(username: str, password: str):
    with Session(engine) as session:
        if session.get(User, username):
            return False
        else:
            salt = secrets.token_bytes(32)
            new_user = User(
                username=username, 
                password=hashlib.pbkdf2_hmac(
                    "sha256", 
                    password.encode(), 
                    salt, 
                    100000
                ),
                salt=salt
            )
            session.add(new_user)
            session.commit()
            return True

def check_login(username: str, password: str):
    with Session(engine) as session:
        user = session.get(User, username)
        new_hash = hashlib.pbkdf2_hmac(
                    "sha256", 
                    password.encode(), 
                    user.salt, 
                    100000
                )
        if new_hash == user.password:
            return True
        else:
            return False
        
def add_user_token(username: str, token_str: str):
    with Session(engine) as session:
        token = AuthToken(token=token_str, user=username)
        session.add(token)
        session.commit()

def create_group(username: str, group_name: str):
    with Session(engine) as session:
        group_id = uuid.uuid4()
        while session.get(Group, group_id) is not None:
            print("Group id already exists. Generating another.")
            group_id = uuid.uuid4()
        user = session.get(User, username)
        new_group = Group(group_id, group_name=group_name, 
                          users=[username,], invitees=[], creator = user)
        session.add(new_group)
        session.commit()

def join_group(username: str, group_id: int):
    with Session(engine) as session:
        user = session.get(User, username)
        group = session.get(Group, group_id)
        group.users.append(user)
        user.groups.append(group)
        session.commit()

def username_from_token(token: str):
    with Session(engine) as session:
        token_obj = session.get(AuthToken, token)
        if token_obj is None:
            return None
        return token_obj.user
    
def get_group_invites(username: str):
    with Session(engine) as session:
        user = session.get(User, username)
        group_invites = user.group_invites
        for index, invite in enumerate(group_invites):
            group_invites[index] = invite.to_dict()
        return group_invites

def remove_group_invite(username: str, group_name: str):
    with Session(engine) as session:
        user = session.get(User, username)
        group = session.get(Group, group_name)
        user.group_invites.remove(group)
        group.invitees.remove(user)
        session.commit()
        return

def get_groups(username: str):
    with Session(engine) as session:
        user = session.get(User, username)
        groups = user.groups
        for index, group in enumerate(groups):
            groups[index] = group.to_dict()
        return groups


