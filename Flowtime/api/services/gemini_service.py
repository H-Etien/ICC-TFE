import json
from django.conf import settings
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain how AI works in a few words",
)


model = genai.GenerativeModel("gemini-1.5-flash")

# 3. Prompt système pour guider l'IA
SYSTEM_PROMPT = """
Tu es un assistant expert en planification de projet.
Transforme la description de l'utilisateur en une liste de tâches structurées.

Réponds UNIQUEMENT en format JSON valide, comme ceci :

{
  "tasks": [
    {
      "title": "Titre de la tâche",
      "content": "Description détaillée de la tâche.",
      "start_time": "YYYY-MM-DDTHH:MM:SS" | null,
      "end_time": "YYYY-MM-DDTHH:MM:SS" | null
    }
  ]
}

Si une information comme la date est inconnue, la valeur doit être `null`.
N'ajoute aucun commentaire ou texte en dehors du JSON.
"""

def generate_tasks_from_prompt(prompt: str):
    """
    Génère une liste de tâches à partir d'un prompt en utilisant l'API Gemini.
    """
    try:
        full_prompt = SYSTEM_PROMPT + "\n\nDescription du projet par l'utilisateur:\n" + prompt
        response = model.generate_content(full_prompt)
        
        # Nettoyer la réponse pour extraire uniquement le JSON
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        
        data = json.loads(cleaned_text)
        return data.get("tasks", [])
    except Exception as e:
        print(f"Erreur lors de la génération des tâches : {e}")
        return []
