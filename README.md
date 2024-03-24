# Did You Knows
Web app that shows interesting "did you know" facts from enwiki


# Running

# With poetry

```
poetry run uvicorn --host 0.0.0.0 --workers 4 did_you_knows:app
```

## With docker

Remember to first update `requirements.txt`

```
poetry export  --format=requirements.txt > requirements.txt
```


```
pack build --builder tools-harbor.wmcloud.org/toolforge/heroku-builder:22 --buildpack heroku/nodejs --buildpack heroku/python --buildpack heroku/procfile dyk --default-process python-web
docker run -e PORT=8000 -e  -p 8000:8000 --rm  dyk
```

--entrypoint python-web