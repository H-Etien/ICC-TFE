from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..model.task_model import Task
from ..model.tag_model import Tag
from ..serializers import TaskSerializer, TagSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Max, F

# Obtenir toutes les Tasks
class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    # Obtenir les Tasks pour chaque User
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by("order")

    def perform_create(self, serializer):
         # positionner l'ordre à la fin de la liste de l'utilisateur
        user = self.request.user

        """
        transation.atomic = ouvre une transaction DB
        Toutes opérations sont appliqués ensemble et si une erreur, alors rollback

        F est un objet qui référence un champ de modèle dans une expression SQL
        -> pas de condition de course (read-modify-write) si plusieurs requêtes en même temps  

        order + 1 pour que la nouvelle Task soit la 1er dans la liste, les autres ont +1 dans l'ordre
        """
        with transaction.atomic():
            Task.objects.filter(user=user).update(order=F("order") + 1)
            serializer.save(user=user, order=0)
       
    

# Supprimer, modifier une Task
class TaskUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    # Pour debug avec les données reçues
    def perform_update(self, serializer):
        data = getattr(self.request, "data", None)
        print('\n', "perform_update request.data:", data, '\n')
        serializer.save()
        
class TaskReorder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        # Attendu: request.data = { "order": [ { "id": <task_id>, "order": <index> }, ... ] }
        order_tasks = request.data.get("order")

        user = request.user
        ids = [item.get("id") for item in order_tasks if "id" in item]

        """
        transation.atomic = ouvre une transaction DB
        Toutes opérations sont appliqués ensemble et si une erreur, alors rollback
        """
        
        with transaction.atomic():
            tasks = list(Task.objects.filter(user=user, id__in=ids))
            tasks_map = {task.id: task for task in tasks}
            updated = []
            for item in order_tasks:
                try:
                    tid = int(item.get("id"))
                    order_val = int(item.get("order"))
                except Exception:
                    continue
                task = tasks_map.get(tid)
                if task:
                    task.order = order_val
                    updated.append(task)
            if updated:
                Task.objects.bulk_update(updated, ["order"])
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
