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

# Mettre à jour le jeu de données 
- Exécuter "main_preprocess.py" avec python : python /preprocess/main_preprocess.py
=> nécessite panda et spacy
- Exécuter "venn_data.py" avec python : python /preprocess/venn_data.py

# Lancer la visualisation
- Exécuter "server.js" avec NodeJS : node.exe ./server.js
=> celui-ci crée un serveur localement qui s'exécute par défaut sur le port 3000
- Accéder via un navigateur au lien donné par le serveur
=> celui-ci sera par défaut http://localhost:3000

# Visualisation 

Dans chacune des représentations, on associe aux sentiments positifs, négatif et neutre les couleurs vert, rouge et bleu.

## Visualisation combinée carte et nuage de mots
Cliquer sur la localité souhaitée pour faire apparaître sur la droite un nuage de mot représentant les 50 thèmes les plus fréquents de la localité concernée.
La couleur des thèmes est définie par leur proportion de sentiment positif, négatif et neutre associé.

## Diagramme de Venn : 
Chaque cercle coloré représente l'ensemble des personnes ayant répondu à la question ouverte correspondante.
La légende indique les tailles absolues des différents ensembles ainsi que de leurs intersections.

## Diagrammes circulaires : 
Chaque diagramme circulaire représente les proportions des sentiments ressenties pour chaque type d'établissement.
La valeur absolue d'un secteur est affichée lorsque que la souris est au-dessus de celui-ci.
Les cases à cocher permettent de cacher les diagrammes de l'établissement 

## Diagrammes à barre empilées

Chaque diagramme à barres empilées représente les sentiments associés aux textes spécifiés.
Chaque diagramme possède :
- un sélecteur "Minimum Bar Value" : celui-ci permet de n'afficher que les barres ayant une valeur d'empilement associé supérieur à la valeur sélectionnée.
- un bouton de tri global : trie les barres empilées par ordres décroissant de tailles globales
- trois boutons de tri par valeur absolue : ceux-ci permettent de trier les barres empilées par ordres décroissant de la taille absolue de la barre du sentiment indiqué par le bouton
- trois boutons de tri par valeur relative : ceux-ci permettent de trier les barres empilées par ordres décroissant de la taille proportionnelle de la barre du sentiment indiqué par le bouton
- un sélecteur "Genre" : permet de n'afficher que les données issues du sélectionné
=> note que la sélection "all" (TODO : change this) inclut les hommes, les femmes et les personnes se désignant comme "autres".

### Sentiments by theme 

Dans chaqun de ces 4 diagrammes, les "thèmes" sont des ensembles de mot représentatif des réponses données pour chaqune des questions ouvertes

### Sentiments by expression TODO
Dans ce diagrammes, les "thèmes" sont des expressions représentatif le l'ensemble des réponses données aux questions .