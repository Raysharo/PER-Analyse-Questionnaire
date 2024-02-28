import pandas as pd
from matplotlib import pyplot as plt
from matplotlib_venn import venn2, venn3

csv_file = "./data/dataQuestionnaire.csv"

# Load the CSV file into a pandas DataFrame
df = pd.read_csv(csv_file, encoding='latin1', sep=';')


# Define the headers of the open-ended columns
OPEN_ENDED_COLUMNS_HEADERS = [
    "Commentaires éventuels (sur le formulaire ou sur votre situation personnelle)",
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement)",
    "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche)",
    "Pouvez-vous expliquer vos réponses merci ..."
]
# Create subsets based on the values in the specified columns
set1 = set(df[df[OPEN_ENDED_COLUMNS_HEADERS[0]].notnull()].index)
set2 = set(df[df[OPEN_ENDED_COLUMNS_HEADERS[1]].notnull()].index)
set3 = set(df[df[OPEN_ENDED_COLUMNS_HEADERS[2]].notnull()].index)
set4 = set(df[df[OPEN_ENDED_COLUMNS_HEADERS[3]].notnull()].index)

# Create the Venn diagram
plt.figure(figsize=(10, 10))

# First subplot (2 circles)
plt.subplot(2, 2, 1)
venn2(subsets=(len(set1), len(set2), len(set1 & set2)), set_labels=(OPEN_ENDED_COLUMNS_HEADERS[0], OPEN_ENDED_COLUMNS_HEADERS[1]))

# Second subplot (3 circles)
plt.subplot(2, 2, 2)
venn3(subsets=(len(set1), len(set2), len(set3), len(set1 & set2), len(set1 & set3), len(set2 & set3), len(set1 & set2 & set3)),
      set_labels=(OPEN_ENDED_COLUMNS_HEADERS[0], OPEN_ENDED_COLUMNS_HEADERS[1], OPEN_ENDED_COLUMNS_HEADERS[2]))

# Third subplot (2 circles)
plt.subplot(2, 2, 3)
venn2(subsets=(len(set1), len(set4), len(set1 & set4)), set_labels=(OPEN_ENDED_COLUMNS_HEADERS[0], OPEN_ENDED_COLUMNS_HEADERS[3]))

# Fourth subplot (intersection of all sets)
plt.subplot(2, 2, 4)
venn3(subsets=(len(set1), len(set2), len(set3), len(set4), len(set1 & set2 & set3 & set4)),
      set_labels=(OPEN_ENDED_COLUMNS_HEADERS[0], OPEN_ENDED_COLUMNS_HEADERS[1], OPEN_ENDED_COLUMNS_HEADERS[2], OPEN_ENDED_COLUMNS_HEADERS[3]))

plt.suptitle("Venn Diagram of Open-Ended Responses")
plt.show()