#!/bin/sh
pipenv install
export FLASK_APP=./api/index.py
export FLASK_ENV=development
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0