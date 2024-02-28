# Description de l'arborescence

Project
|-- data : contient les différents fichiers .csv et .json sur lesquelles se base la visualisation
|   |-- cityCoordinates.json : contient les coordonnées GPS de chaque localité, et ceux afin d'éviter les requêtes à l'API d'openstreetmap à chaque chargement de la visualisation  
|   |-- dataQuestionnaire.csv : contient les données d'origine de l'étude
|   |-- regions.geojson : contient une représentation de la carte de france métropolitaine, utilisé pour la visualtion de donné combiné carte et nuage de mot.
|   |-- structured_data.json : contient une version reformarté des données de dataQuestionnaire.csv afin de facilité leur manipulation par app.js
|   |-- venn_data.json : contient les informations nécessaire à la construction du diagramme de venn, créer par venn_data.py, utilisé par app.js
|   |-- Notation
|       |-- expressions.csv : contient l'ensemble des expressions trouvées pour chaque sondé. 
|       |-- resultat_analyse_sentiments_float.csv : associe une note floatante à chaque question ouverte 
|-- preprocess : contient les différents fichiés pythons servant au traitement et au formatage des données pour la visualisation
|   |-- main_preprocess.py : génère cityCoordinates.json et structured_data.json à partir de dataQuestionnaire.csv, resultat_analyse_sentiments_float.csv et expressions.csv
|   |-- venn_data.py : géère venn_data.json à partir de dataQuestionnaire.csv
|-- src : contient l'essentiel des fichiers servant à la construction de la page web
|   |-- index.html : Sert de point d'entré pour la visualisation
|   |-- app.js : Script générant la visualisation des données fournies dans le dossier /data. Celle ci est composé des fonctions map, vennDiagram, circular_diagram, stacked_bar ,  createStackedExpression générant chacune les visualisations qui leur correspondent.
|   |-- *.css : Feuille de style métant en forme la page index.html
|   |-- favicon.ico : Exemple d'îcone utilisatble pour index.html
|-- server.js

<!-- Miena -->


<!-- # Prepocess IA
# Neural Network -->



<!-- Lucas -->

# Mettre à jour le jeux de données 
- Exécuter "main_preprocess.py" avec python : python /preprocess/main_preprocess.py
=> nécessite panda et spacy
- Exécuter "venn_data.py" avec python : python /preprocess/venn_data.py

# Lancer la visualisation
- Exécuter "server.js" avec NodeJS : node.exe ./server.js
=> celui-ci créer un serveur localement qui s'exécute par défaut sur le port 3000
- Accéder via un navigateur au lien donnée par le serveur
=> celui-ci sera par défaut http://localhost:3000

# Visualisation 
TODO : description des visualisation.