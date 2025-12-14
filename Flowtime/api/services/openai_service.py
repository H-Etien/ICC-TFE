from openai import OpenAI
import json
import os


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Prompt pour la conversation et comprendre le projet que l'utilisateur veut
CHAT_SYSTEM_PROMPT = """
Tu es un assistant de planification de projet conversationnel.
Ton but est de discuter avec l'utilisateur pour bien comprendre son projet.
Pose des questions pour clarifier les objectifs, les fonctionnalités clés, et les éventuelles deadlines.
Sois amical et encourageant.

Pose des questions mais ne fais pas trop de propositions de tâches prématurément.
Ton message doit faire 3 à 5 lignes maximum et mets de line break pour laisser un espace entre chaque question.

Après ton premier message, demande l'emploi du temps de la personne pour mieux planifier les tâches.
Si l'utilisateur n'a pas d'emploi du temps, demande-lui ses disponibilités générales.

Quand tu estimes avoir assez d'informations pour générer un plan de projet complet, préviens l'utilisateur qu'il peut appuyer sur le bouton "Générer le projet".
Ne génère pas de JSON dans cette phase de conversation.
"""

# Prompt pour générer le projet
GENERATION_SYSTEM_PROMPT = """
Tu es un assistant expert en planification de projet.
En te basant sur la conversation fournie, transforme la demande de l'utilisateur en un titre de projet pertinent, trouve une description de 2-3 lignes et une liste de tâches structurées.

Réponds UNIQUEMENT en format JSON valide, comme ceci :

{
  "project_title": "Le nom du projet que tu as généré",
  "project_description": "Une description de 2-3 lignes du projet.",
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
Pour le start_time et end_time des tâches, pour le jour prends toujours le lendemain pour la première tâche et les autres jours pour les tâches suivantes.
Pour la durée des tâches, estime-les en fonction de l'emploi du temps prévu par l'utilisateur.
Start_time est le début de la tâche et end_time la fin, ça doit être le même jour et cohérent avec l'emploi du temps.

S'il n'a pas d'emploi du temps, laisse les valeurs à null.
N'ajoute aucun commentaire ou texte en dehors du JSON.
"""

OPENAI_model = "gpt-5.1"

# Pour conversation avec l'user
def get_ai_chat_response(messages: list):
    try:
        # On ajoute le prompt au début de la conversation
        system_message = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
        
        response = client.chat.completions.create(
            model = OPENAI_model,
            messages = system_message + messages
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"ERROR CHAT TO OPENAI : {e}")
        return

# Pour générer les Task avec le prompt
def generate_project_from_conversation(messages):
    try:

      conversation_summary = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
      final_prompt = f"Voici la conversation. Synthétise-la pour créer un projet complet :\n\n{conversation_summary}"

      response = client.chat.completions.create(
          model = OPENAI_model, 
          # Pour avoir le format en JSON
          response_format={"type": "json_object"},
          messages=[
              {"role": "system", "content": GENERATION_SYSTEM_PROMPT},
              {"role": "user", "content": final_prompt}
          ]
      )
      create_message = response.choices[0].message
      if create_message.content is None:
          raise ValueError("Réponse OpenAI vide")
      
      data = json.loads(create_message.content)
      return data

    except Exception as e:
        print(f"ERROR CALL TO OPENAI : {e}")
        return