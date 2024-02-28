import csv
import json
from collections import defaultdict
from itertools import combinations

def generate_venn_data(input_file="./data/dataQuestionnaire.csv", output_file="./data/venn_data.json"):
    # Load the data from the CSV file with semicolon delimiter
    with open(input_file, newline='', encoding='latin1') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        data = list(reader)

        # Array containing the names of the open-ended questions
        question_names = [
            "Commentaires éventuels (sur le formulaire ou sur votre situation personnelle)",
            "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de l'enseignement)",
            "Commentaires éventuels (sur le formulaire ou sur votre appréciation personnelle de la recherche)",
            "Pouvez-vous expliquer vos réponses merci ..."
        ]

        name_set = [
            "A : " + question_names[0],
            "B : " + question_names[1],
            "C : " + question_names[2],
            "D : " + question_names[3]
        ]

        

        # Prepare the sets for the Venn diagram
        sets = [
            
            {"sets": [name_set[0]], "size": 0},
            {"sets": [name_set[1]], "size": 0},
            {"sets": [name_set[2]], "size": 0},
            {"sets": [name_set[3]], "size": 0},
            {"sets": [name_set[0], name_set[1]], "size": 0},
            {"sets": [name_set[0], name_set[2]], "size": 0},
            {"sets": [name_set[0], name_set[3]], "size": 0},
            {"sets": [name_set[1], name_set[2]], "size": 0},
            {"sets": [name_set[1], name_set[3]], "size": 0},
            {"sets": [name_set[2], name_set[3]], "size": 0},
            {"sets": [name_set[0], name_set[1], name_set[2]], "size": 0},
            {"sets": [name_set[0], name_set[1], name_set[3]], "size": 0},
            {"sets": [name_set[0], name_set[2], name_set[3]], "size": 0},
            {"sets": [name_set[1], name_set[2], name_set[3]], "size": 0},
            {"sets": [name_set[0], name_set[1], name_set[2], name_set[3]], "size": 0}
        ]

        print("Total : ", len(data))
        no_response = 0

        # Count the number of answers for each question and their intersections
        for row in data:
            answers = [row[question] for question in question_names]
            if not any(answers):
                no_response += 1
            for i in range(len(answers)):
                if answers[i]:
                    sets[i]["size"] += 1
                for j in range(i + 1, len(answers)):
                    if answers[i] and answers[j]:
                        sets[4 + 3 * i + j - 1]["size"] += 1
                    for k in range(j + 1, len(answers)):
                        if answers[i] and answers[j] and answers[k]:
                            sets[10 + 2 * i + k - 1]["size"] += 1
                            if i == 0 and answers[i] and answers[j] and answers[k] and answers[3]:
                                sets[14]["size"] += 1

        # Convert sets to JSON format
        json_data = {"sets": sets}

        print("Number of people who did not answer any question:", no_response)

        # Write the data to a JSON file
        with open(output_file, "w") as jsonfile:
            json.dump(json_data, jsonfile, indent=4)

# Call the function with default arguments
generate_venn_data()
