import spacy
import pandas as pd
from collections import Counter

import requests
import json
from urllib.parse import quote

csv_file = "./data/dataQuestionnaire.csv"

OPEN_ENDED_COLUMNS_HEADERS = [
    "Commentaires éventuels (sur le formulaire ou sur votre situation personnelle)",
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement)", 
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche)",
    "Pouvez-vous expliquer vos réponses merci ..."
]


df = pd.read_csv(csv_file, encoding='latin1', sep=';')
df = df.dropna(subset=OPEN_ENDED_COLUMNS_HEADERS, how='all')


def extract_unique_strings(df, column_name):
    """
    Extracts unique string values from a specified column of a DataFrame.

    Parameters:
    - df: pandas DataFrame
        The DataFrame containing the data.
    - column_name: str
        The name of the column from which to extract unique string values.

    Returns:
    - unique_strings_set: set
        A set containing cleaned and standardized unique string values.
    """
    # Check if the column exists in the DataFrame
    if column_name not in df.columns:
        print(f"Error: Column '{column_name}' not found in DataFrame.")
        return set()

    # Extract the specified column
    column_data = df[column_name]

    # Initialize an empty set to store unique string values
    unique_strings_set = set()

    # Iterate over each value in the column
    for value in column_data:
        # Check if the value is a string
        if isinstance(value, str):
            # Clean and standardize the string value
            cleaned_value = value.strip().lower()  # Remove leading/trailing whitespace and convert to lowercase
            # Add the cleaned value to the set
            unique_strings_set.add(cleaned_value)

    return unique_strings_set


# set_type = extract_unique_strings(df, 'Type de votre établissement')
# print(f"Type de votre établissement : {len(set_type)}\n{set_type}")
# set_city = extract_unique_strings(df, 'Ville ')
# print(f"Villes : {len(set_city)}\n{set_city}")

nlp = spacy.load("fr_core_news_sm")


def clean_string(text):
    return text.strip().lower()


# def count_values_in_column(df, column_name):
#     """
#     Counts the occurrences of each unique value in a specified column of a DataFrame
#     and sorts the dictionary by decreasing count values.

#     Parameters:
#     - df: pandas DataFrame
#         The DataFrame containing the data.
#     - column_name: str
#         The name of the column for which to count unique values.

#     Returns:
#     - value_counts_dict: dict
#         A dictionary containing the count of each unique value in the specified column,
#         sorted by decreasing count values.
#     """
#     # Check if the column exists in the DataFrame
#     if column_name not in df.columns:
#         print(f"Error: Column '{column_name}' not found in DataFrame.")
#         return {}

#     # Extract the specified column
#     column_data = df[column_name].dropna()

#     # Initialize an empty dictionary to store value counts
#     value_counts_dict = {}

#     # Iterate over each value in the column
#     for value in column_data:
#         value_cleaned = clean_string(value)
#         # Increment the count of the value in the dictionary
#         value_counts_dict[value_cleaned] = value_counts_dict.get(value_cleaned, 0) + 1

#     # Sort the dictionary by decreasing count values
#     sorted_value_counts = dict(sorted(value_counts_dict.items(), key=lambda item: item[1], reverse=True))

#     return sorted_value_counts


def proportion_details(df):
    df_with_city = df[df['Ville '].notna()]

    # TODO : create df_with_open_ended, df_with_two_open_ended, df_with_three_open_ended, df_with_four_open_ended

    # Filter the original DataFrame to include rows with at least one non-null value in the open-ended comment columns
    df_with_open_ended = df.dropna(subset=OPEN_ENDED_COLUMNS_HEADERS, how='all')

    # Filter the original DataFrame to include rows with at least two non-null values in the open-ended comment columns
    df_with_two_open_ended = df[df[OPEN_ENDED_COLUMNS_HEADERS].notna().sum(axis=1) >= 2]

    # Filter the original DataFrame to include rows with at least three non-null values in the open-ended comment columns
    df_with_three_open_ended = df[df[OPEN_ENDED_COLUMNS_HEADERS].notna().sum(axis=1) >= 3]

    # Filter the original DataFrame to include rows with at least four non-null values in the open-ended comment columns
    df_with_four_open_ended = df[df[OPEN_ENDED_COLUMNS_HEADERS].notna().sum(axis=1) >= 4]


    print("Proportion with city : ", len(df_with_city) / len(df), " (", len(df_with_city), "/", len(df), ")")
    print("Proportion with open ended : ", len(df_with_open_ended) / len(df), " (", len(df_with_open_ended), "/", len(df), ")")
    print("Proportion with two open ended : ", len(df_with_two_open_ended) / len(df), " (", len(df_with_two_open_ended), "/", len(df), ")")
    print("Proportion with three open ended : ", len(df_with_three_open_ended) / len(df), " (", len(df_with_three_open_ended), "/", len(df), ")")
    print("Proportion with four open ended : ", len(df_with_four_open_ended) / len(df), " (", len(df_with_four_open_ended), "/", len(df), ")")

    df_with_open_ended_1 = df_with_open_ended[df_with_open_ended[OPEN_ENDED_COLUMNS_HEADERS[0]].notna()]
    df_with_open_ended_2 = df_with_open_ended[df_with_open_ended[OPEN_ENDED_COLUMNS_HEADERS[1]].notna()]
    df_with_open_ended_3 = df_with_open_ended[df_with_open_ended[OPEN_ENDED_COLUMNS_HEADERS[2]].notna()]
    df_with_open_ended_4 = df_with_open_ended[df_with_open_ended[OPEN_ENDED_COLUMNS_HEADERS[3]].notna()]

    print("Proportion with open ended 1 : ", len(df_with_open_ended_1) / len(df), " (", len(df_with_open_ended_1), "/", len(df), ")")
    print("Proportion with open ended 2 : ", len(df_with_open_ended_2) / len(df), " (", len(df_with_open_ended_2), "/", len(df), ")")
    print("Proportion with open ended 3 : ", len(df_with_open_ended_3) / len(df), " (", len(df_with_open_ended_3), "/", len(df), ")")
    print("Proportion with open ended 4 : ", len(df_with_open_ended_4) / len(df), " (", len(df_with_open_ended_4), "/", len(df), ")")

# def proportion_with_notna(csv_file, OPEN_ENDED_COLUMNS_HEADERS):
#     # Read the CSV file into a DataFrame
#     df = pd.read_csv(csv_file, encoding='latin1', sep=';')
    
#     # Drop rows where all specified columns have missing values
#     df = df.dropna(subset=OPEN_ENDED_COLUMNS_HEADERS, how='all')
    
#     # Filter rows where 'Ville' column is not null and at least one of the OPEN_ENDED_COLUMNS_HEADERS is not null
#     filtered_df = df[df['Ville '].notna() & df[OPEN_ENDED_COLUMNS_HEADERS].notna().any(axis=1)]
    
#     # Calculate the proportion of filtered rows
#     proportion = len(filtered_df) / len(df)
    
#     return proportion

def extract_city_coordinates(df, output_file='./data/cityCoordinates.json'):

    df_city = df['Ville '].dropna()
    df_city = df_city.str.lower()
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
                    coordinates = [float(response.json()[0]['lon']), float(response.json()[0]['lat'])]
                    json_data[city] = coordinates
                else:
                    print(f'Response JSON for {city} is empty.')
            else:
                print(f'Request for {city} failed with status code {response.status_code}.')

    with open(output_file, 'w') as f:
        json.dump(json_data, f)
        print(f'City coordinates saved to {output_file}.')


def extract_themes_of_text(text):
    # Process the input text with spaCy if it's not empty
    if not pd.isna(text) and text is not None and isinstance(text, str) and text.strip():
        doc = nlp(text)
        
        # List to store themes in the current text
        themes = []
        
        # Extract themes (noun chunks) from the text
        for chunk in doc.noun_chunks:
            # Exclude if only stopwords or only pronouns
            if any(not token.is_stop for token in chunk) and any(token.pos_ != 'PRON' for token in chunk):
                themes.append(chunk.text)
        
        return themes
    else:
        return []
    



# def extract_themes_with_count(df):
#     theme_counter = Counter()

#     for header in OPEN_ENDED_COLUMNS_HEADERS:
#         for col in df[header]:
#             themes = extract_themes(col)
#             theme_counter.update(themes)

#     sorted_themes = sorted(theme_counter.items(), key=lambda x: x[1])

#     print(f"{'#'*30} Most common themes (sorted by increasing order): {'#'*30}")
#     for theme, count in sorted_themes:
#         print(f"Theme: {theme}, Count: {count}")


if __name__ == "__main__":
    
    # print(quote("aix en provence / marseille"))
    # print(f"# Ville dict :\n {count_values_in_column(df, 'Ville ')}\n")
    # print(f"# Type de votre établissement dict :\n {count_values_in_column(df, 'Type de votre établissement')}\n")
    # print(df.columns)
    # print("proportion_with_notna(csv_file, OPEN_ENDED_COLUMNS_HEADERS)", proportion_with_notna(csv_file, OPEN_ENDED_COLUMNS_HEADERS))
    # extract_city_coordinates(df)
    # extract_themes_with_count(df)
    proportion_details(df)