from openai import OpenAI
import json
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
Tu es un assistant expert en planification de projet.
Transforme la description de l'utilisateur en un titre de projet pertinent et une liste de tâches structurées.

Réponds UNIQUEMENT en format JSON valide, comme ceci :

{
  "project_title": "Le nom du projet que tu as généré",
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
    try:
      response = client.chat.completions.create(
          model="gpt-4o-mini", 
          # Pour avoir le format en JSON
          response_format={"type": "json_object"},
          messages=[
              {"role": "system", "content": SYSTEM_PROMPT},
              {"role": "user", "content": prompt}
          ]
      )
      message = response.choices[0].message
      if message.content is None:
          raise ValueError("Réponse OpenAI vide")
      
      data = json.loads(message.content)
      return data

    except Exception as e:
        print(f"ERROR CALL TO OPENAI : {e}")
        return