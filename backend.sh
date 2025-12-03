#!/bin/bash
# Activer le backend Django

source venv/Scripts/activate
echo "venv activé."

cd Flowtime
py manage.py runserver
echo "Serveur Django démarré."