
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
    info: Mapped[str] = mapped_column(String)
    date: Mapped[datetime.date] = mapped_column(Date)


Base.metadata.create_all(engine)


def load_events(requested_date: datetime.date):
    with Session(engine) as session:
        return session.execute(select(Event).filter_by(date=requested_date))

def create_event(title: str, info: str, date: datetime.date):
    with Session(engine) as session:
        new_event = Event(title=title, info=info, date=date)
        session.add(new_event)
        session.commit()

