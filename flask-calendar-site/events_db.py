
from sqlalchemy import create_engine, String, Date, Uuid, select
from sqlalchemy.orm import Session, DeclarativeBase, Mapped, mapped_column, relationship

import uuid
import datetime

engine = create_engine("sqlite:///events.sqlite3")

class Base(DeclarativeBase):
    pass

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String)
    creator: Mapped[str] = mapped_column(String, default="None")
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

