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

Quand tu estimes avoir assez d'informations pour générer un plan de projet complet, termine ta réponse par le signal spécial : [PROJET_PRET].
Ne génère pas de JSON dans cette phase de conversation.
"""

# Prompt pour générer le projet
GENERATION_SYSTEM_PROMPT = """
Tu es un assistant expert en planification de projet.
En te basant sur la conversation fournie, transforme la description de l'utilisateur en un titre de projet pertinent et une liste de tâches structurées.

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

# Pour conversation avec l'user
def get_ai_chat_response(messages: list):
    try:
        # On ajoute le prompt au début de la conversation
        system_message = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
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
          model="gpt-4o-mini", 
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