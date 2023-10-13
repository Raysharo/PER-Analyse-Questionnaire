import pandas as pd

# Spécifiez le chemin du fichier CSV
csv_file = "data/dataQuestionnaire.csv"

# Chargez le fichier CSV en utilisant Pandas
data = pd.read_csv(csv_file)

# Obtenez la liste des en-têtes de colonnes
column_headers = data.columns

# Imprimez chaque en-tête de colonne
for header in column_headers:
    print(header)
