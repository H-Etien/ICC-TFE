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
from django.db.models import Max

# Obtenir toutes les Tasks
class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    # Obtenir les Tasks pour chaque User
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
         # positionner l'ordre à la fin de la liste de l'utilisateur
        user = self.request.user
        max_order = Task.objects.filter(user=user).aggregate(Max('order'))['order__max']
        if max_order is None:
            max_order = -1
        serializer.save(user=user, order=max_order + 1)
       


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
        """
        Attendu: request.data = { "order": [ { "id": <task_id>, "order": <index> }, ... ] }
        """
        order_tasks = request.data.get("order")

        user = request.user
        ids = [item.get("id") for item in order_tasks if "id" in item]

        """
        transation.atomic = ouvre une transaction DB
        Toutes opérations sont appliqués ensemble et si une erreur, alors rollback
        """
        with transaction.atomic():
            # récupérer les tâches de l'utilisateur concernées
            tasks = Task.objects.filter(user=user, id__in=ids)
            tasks_map = {t.id: t for t in tasks}
            for item in order_tasks:
                try:
                    tid = int(item.get("id"))
                    order_val = int(item.get("order"))
                except Exception:
                    continue
                task = tasks_map.get(tid)
                if task:
                    task.order = order_val
                    task.save()