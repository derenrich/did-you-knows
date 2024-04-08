from sqlmodel import Field, SQLModel, create_engine, Session
import os


class HookBase(SQLModel):
    wiki: str
    page_id: int
    rev_id: int
    title: str
    slug: str
    hook_text: str
    image: str | None


class Hook(HookBase, table=True):
    id: int = Field(primary_key=True)


if os.environ["TOOL_TOOLSDB_USER"]:
    mysql_username = os.environ["TOOL_TOOLSDB_USER"]
    mysql_password = os.environ["TOOL_TOOLSDB_PASSWORD"]
    mysql_host = "tools.db.svc.wikimedia.cloud"
    database_name = "s55747__dyk"
    conn_string = (
        f"mysql://{mysql_username}:{mysql_password}@{mysql_host}/{database_name}"
    )
    engine = create_engine(conn_string)
else:
    sqlite_file_name = "./dyk.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == "__main__":
    create_db_and_tables()

    import glob
    import json

    with Session(engine) as session:
        for hook_fname in glob.glob("hooks_*.json"):
            with open(hook_fname) as f:
                hooks = json.load(f)
                for hook in hooks:
                    rev_id = int(hook.pop("rev_id"))
                    page_id = int(hook.pop("page_id"))
                    wiki = hook.pop("wiki")
                    title = hook.pop("title")
                    slug = hook.pop("phrase")
                    hook_text = hook.pop("hook")

                    hook_row = Hook(
                        wiki=wiki,
                        page_id=page_id,
                        rev_id=rev_id,
                        title=title,
                        slug=slug,
                        hook_text=hook_text,
                    )
                    session.add(hook_row)
            session.commit()
