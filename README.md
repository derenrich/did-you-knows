# Did You Knows
Web app that shows interesting "did you know" facts from enwiki


# Running

# With poetry

```
poetry run uvicorn --host 0.0.0.0 --workers 4 did_you_knows:app
```

## With docker

```
pack build --builder tools-harbor.wmcloud.org/toolforge/heroku-builder:22 dyk
docker run -e PORT=8000 -e HF_TOKEN=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 -p 8000:8000 --rm --entrypoint web dyk
```

```
pack build --builder tools-harbor.wmcloud.org/toolforge/heroku-builder:22 --buildpack heroku/nodejs --buildpack heroku/python dyk
docker run -e PORT=8000 -e HF_TOKEN=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 -p 8000:8000 --rm --entrypoint web dyk
```