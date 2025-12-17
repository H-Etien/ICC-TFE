from openai import OpenAI
import json
import os


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Prompt pour la conversation et comprendre le projet que l'utilisateur veut
CHAT_SYSTEM_PROMPT = """
Tu es un assistant de planification de projet conversationnel.
Tu parles et réponds par la langue de l'interlocuteur, si il parle anglais, tu parles anglais, si il par français, tu parles français, etc.
Ton but est de discuter avec l'utilisateur pour bien comprendre son projet.
Pose des questions pour clarifier les objectifs, les fonctionnalités clés, et les éventuelles deadlines.
Sois amical.

Pose des questions mais ne fais pas trop de propositions de tâches prématurément.
Ton message doit faire 3 à 5 phrases maximum !!!
Séparer chaque phrase par un retour à la ligne (\n) pour aérer le texte.
Format du text respecte :
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed non risus. 
Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.

Après ton premier message, demande l'emploi du temps de la personne pour mieux planifier les tâches.
Si l'utilisateur n'a pas d'emploi du temps, demande-lui ses disponibilités générales.

Quand tu estimes avoir assez d'informations pour générer un plan de projet complet, préviens l'utilisateur qu'il peut appuyer sur le bouton "Générer le projet" ou l'équivalent dans la langue qu'il parle.
Ne génère pas de JSON dans cette phase de conversation.
"""

# Prompt pour générer le projet
GENERATION_SYSTEM_PROMPT = """
Tu es un assistant expert en planification de projet.
En te basant sur la conversation fournie, transforme la demande de l'utilisateur en un titre de projet pertinent, trouve une description de 2-3 lignes et une liste de tâches structurées.
Chaque tâche doit avoir un titre, une description détaillée, un start_time et un end_time si possible.

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

Pour le start_time et end_time des tâches, il y a 2 cas :
Soit l'utilisateur t'a parlé de sa disponibilité et tu peux planifier les tâches en fonction de son emploi du temps.
Soit il ne t'a pas donné d'emploi du temps, dans ce cas, mets les start_time et end_time à null.

Le start_time et end_time doivent finir le même jour.
Pour l'heure, estime le temps que prend la tâche et choisis un start_time puis un end_time.
Chaque tâche est a un jour différent, pas 2 tâche le même jour.


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