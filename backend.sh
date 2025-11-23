#!/bin/bash
echo activate venv
source venv/Scripts/activate
cd ICC_Calendar
echo activate backend
py manage.py runserver