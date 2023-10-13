import pandas as pd

# Spécifiez le chemin du fichier CSV
csv_file = "data/dataQuestionnaire.csv"

# Chargez le fichier CSV en utilisant Pandas
data = pd.read_csv(csv_file)

# Créer une liste de toutes les colonnes à supprimer
columns_useless = ["Séquentiel", "SID", "Heure de soumission", "Heure de complétion", "Heure de modification", "Brouillon", "Adresse IP", "UID", "Nom d'utilisateur"]
# Supprime les colonnes de la liste ci-dessus
data = data.drop(columns=columns_useless)

# Construire une liste contenant les noms des colonnes contenant uniquement des valeurs numériques
numeric_columns = []
for header in data.columns:
    if data[header].dtype in [int, float]:
        numeric_columns.append(header)

# Imprimez la liste des colonnes contenant des valeurs numériques
print(numeric_columns)
