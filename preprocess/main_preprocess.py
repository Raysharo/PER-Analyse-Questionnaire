import pandas as pd
import spacy
import json

from urllib.parse import quote
import requests

import ast


nlp = spacy.load("fr_core_news_sm")

csv_file = "./data/dataQuestionnaire.csv"

milena_sentiment_float_file = "data/Notation/resultat_analyse_sentiments_float.csv"
milena_expression_file = "data/Notation/expressions.csv"

OPEN_ENDED_COLUMNS_HEADERS = [
    "Commentaires éventuels (sur le formulaire ou sur votre situation personnelle)",
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement)", 
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche)",
    "Pouvez-vous expliquer vos réponses merci ..."
]

OPEN_ENDED_COLUMNS_SHORT_HEADERS = {
    "Commentaires éventuels (sur le formulaire ou sur votre situation personnelle)": "Situation perso",
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement)": "Appréciation enseignement",
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche)": "Appréciation recherche",
    "Pouvez-vous expliquer vos réponses merci ...": "Explications réponses"
}

# HEADERS_NOTES 
# Commentaires éventuels (sur le formulaire ou sur votre situation personnelle):Note personnelle,
# Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement):Note enseignement,
# Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche):Note recherche,
# Pouvez-vous expliquer vos réponses merci ...:Note merci,


# Totalite des commentaires:Note totalite

# HEADERS_NOTES = {
#     "Commentaires éventuels (sur le formulaire ou sur votre situation personnelle)": "Note personnelle",
#     "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement)": "Note enseignement",
#     "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche)": "Note recherche",
#     "Pouvez-vous expliquer vos réponses merci ...": "Note merci"
# }

HEADERS_NOTES_FROM_SHORT = {
    "Situation perso": "Note personnelle",
    "Appréciation enseignement": "Note enseignement",
    "Appréciation recherche": "Note recherche",
    "Explications réponses": "Note merci"
}


def clean_string(text):
    return text.strip().lower()

def extract_themes_of_text(text, stopwords=nlp.Defaults.stop_words):
    if not pd.isna(text) and text is not None and isinstance(text, str) and text.strip():
        text = clean_string(text)
        doc = nlp(text)
        themes = []
        for chunk in doc.noun_chunks:
            # Check if the chunk contains only alphabetic characters
            if chunk.root.text.isalpha() and chunk.root.text.lower() not in stopwords and chunk.root.pos_ != 'PRON':
                themes.append(chunk.root.text)
        return themes
    else:
        return []


def create_structured_json_data(df, output_file='./data/structured_data.json'):

    milena_sentiment_df = pd.read_csv(milena_sentiment_float_file, sep=',')
    # Headers milena_sentiment_df : SID,Commentaires éventuels (sur le formulaire ou sur votre situation personnelle),Note personnelle,Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement),Note enseignement,Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche),Note recherche,Pouvez-vous expliquer vos réponses merci ...,Note merci,Totalite des commentaires,Note totalite


    milena_expression_df = pd.read_csv(milena_expression_file, sep=',')


    # Create a dictionary to store the structured data
    structure_json = {}

    # Iterate over each row in the DataFrame
    for index, row in df.iterrows():

        situation_data = {}

        situation_data["city"] = clean_string(row["Ville "]) if not pd.isna(row["Ville "]) else None
        # Type de votre établissement
        situation_data["type_etablissement"] = clean_string(row["Type de votre établissement"]) if not pd.isna(row["Type de votre établissement"]) else None

        # '1 - Vous êtes ? ', 'Votre statut :',
    #    'Votre ancienneté dans la profession d'enseignant/chercheur (permanent ou non)',
        
        situation_data["genre"] = clean_string(row["1 - Vous êtes ? "].split()[-1]) if not pd.isna(row["1 - Vous êtes ? "]) else None
        situation_data["statut"] = clean_string(row["Votre statut :"]) if not pd.isna(row["Votre statut :"]) else None
        situation_data["anciennete"] = clean_string(row["Votre ancienneté dans la profession d'enseignant/chercheur (permanent ou non)"]) if not pd.isna(row["Votre ancienneté dans la profession d'enseignant/chercheur (permanent ou non)"]) else None

        # Get the list of expressions for the SID 
        # Headers : SID,Totalite des commentaires,Expressions présentes
        expression_str = milena_expression_df[milena_expression_df['SID'] == row["SID"]]["Expressions présentes"].values[0] if row["SID"] in milena_expression_df["SID"].values else None
        situation_data["expression"] = ast.literal_eval(expression_str) if expression_str else None
        situation_data["sentiment_global"] = float_to_sentiment(milena_sentiment_df[milena_sentiment_df['SID'] == row["SID"]]["Note totalite"].values[0]) if row["SID"] in milena_sentiment_df["SID"].values else None

        for header, short_header in OPEN_ENDED_COLUMNS_SHORT_HEADERS.items():
            text = row[header]
            if pd.isna(text) or text is None or not isinstance(text, str) or not text.strip():
                continue
            themes = extract_themes_of_text(text)
            
            # Get the sentiment from the Milena's file using the SID
            sid = row["SID"]
            sentiment_col = HEADERS_NOTES_FROM_SHORT[short_header]
            sentiment = float_to_sentiment(milena_sentiment_df[milena_sentiment_df['SID'] == sid][sentiment_col].values[0])
           

            situation_data[short_header] = {
                "answer": text,
                "chunks": [{"theme": theme, "Sentiment": sentiment} for theme in themes]
            }
        # Store the data for each SID
        structure_json[row["SID"]] = situation_data

    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(structure_json, json_file, indent=4, ensure_ascii=False)

    print(f"JSON file {output_file} has been created successfully.")

def float_to_sentiment(value):
    if value < 1/3:
        return "negative"
    elif value <= 2/3:
        return "neutral"
    elif value > 2/3:
        return "positive"
    else:
        print(f"Error: sentiment value {value} is not in the range [0, 1].")
        return "positive"

def create_city_coord_json_data(df, output_file='./data/cityCoordinates.json'):

    df_city = df['Ville '].dropna()
    # Use the clean_string function to clean and standardize the city names
    df_city = df_city.apply(clean_string)
    # df_city = df_city.str.lower()
    df_city = df_city.drop_duplicates()

    json_data = {}

    for city in df_city:

        # USELESS : already drop duplicates
        # if city in json_data:
        #     continue

        if city:
            city_encoded = quote(city)
            response = requests.get(f'https://nominatim.openstreetmap.org/search?format=json&q={city_encoded}, France')

            if response.status_code == 200:
                if response.json():
                    coordinates = {
                        "lon": float(response.json()[0]['lon']),
                        "lat": float(response.json()[0]['lat'])
                    }
                    json_data[city] = coordinates
                else:
                    print(f'Response JSON for {city} is empty.')
            else:
                print(f'Request for {city} failed with status code {response.status_code}.')

    with open(output_file, 'w') as f:
        json.dump(json_data, f)
        print(f'City coordinates saved to {output_file}.')

df = pd.read_csv(csv_file, encoding='latin1', sep=';')
df = df.dropna(subset=OPEN_ENDED_COLUMNS_HEADERS, how='all')

create_structured_json_data(df)
create_city_coord_json_data(df)