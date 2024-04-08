from typing import Sequence
from .database import engine, Hook
from sqlmodel import Session, select, func


def get_hook(session: Session, hook_id: int) -> Hook | None:
    return session.get(Hook, hook_id)


def get_random_hooks(session: Session, n=1) -> Sequence[Hook]:
    return session.exec(select(Hook).order_by(func.random()).limit(n)).all()


if __name__ == "__main__":
    with Session(engine) as session:
        print(get_random_hooks(session, 10))
