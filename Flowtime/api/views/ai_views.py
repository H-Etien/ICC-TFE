from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction

from ..models import Project, Task
from ..services.openai_service import get_ai_chat_response, generate_project_from_conversation

# Pour avoir la conversation entre user et IA
class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get("messages")

        if not user_message:
            return Response(
                {"error": "Le message est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ai_response = get_ai_chat_response(user_message)
            return Response({"response": ai_response}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Pour générer un projet complet avec tâches via IA
class AIProjectGeneratorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("messages")

        # L'utilisateur doit faire un prompt
        if not prompt:
            return Response(
                {"error": "Le prompt est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                #  Génération des données via l'IA
                generated_data = generate_project_from_conversation(prompt)
                
                project_title = generated_data.get("project_title") 
                generated_tasks = generated_data.get("tasks") 

                if not project_title or not generated_tasks:
                    raise Exception("L'IA n'a pas pu générer un titre ou des tâches.")

                # Création du projet dans le backend
                new_project = Project.objects.create(
                    title=project_title,
                    owner=request.user,
                    description=f"Projet généré par IA."
                )
                new_project.members.add(request.user)

                # Création des tâches dans le backend
                for i, task_data in enumerate(generated_tasks):
                    Task.objects.create(
                        project=new_project,
                        title=task_data.get("title", "Tâche sans titre"),
                        content=task_data.get("content"),
                        start_time=task_data.get("start_time"),
                        end_time=task_data.get("end_time"),
                        order=i
                    )
            
            # Response parce que class GeneratorView
            return Response({"project_id": new_project.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)