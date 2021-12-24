<?php header("location: index.html");?>
<pre>
<?php
$global = true;
$debut_text = true;
$min_mesure = false;
$text = ""; // Le $text va contenir le texte (presque final) à inscrire dans le fichier d'instructions "temp.txt"
$compteur = 0; // Le $compteur va permettre de compter le nombre de silos qui vont lancer une prise de mesure

/* Affichons d'abord le tableau de données du formulaire */
print_r($_POST);
echo "\n/***********************************************************/\nTRADUCTION DU TABLEAU CI-DESSUS EN INSTRUCTIONS DE COMMANDE :\n/***********************************************************/\n\n";

/* On crée ensuite 2 tableaux : 
- Un tableau 2D complet de tous les silos, pour récupérer la valeur 0 ou 1 associée à chaque silo.
- Un tableau des délégués, pour identifier les délégués et garder leur ID qui sera nécessaire lors de l'envoi des instructions vers les microcontrôleurs. */
$tab_silos_complet = [
    ["sil01", "sil02", "sil03", "sil04", "sil05", "sil06"],
    ["sil11", "sil12", "sil13", "sil14", "sil15", "sil16", "sil17", "sil18", "sil19"],
    ["sil21", "sil22", "sil23", "sil24", "sil25", "sil26", "sil27", "sil28", "sil29"],
    ["sil31", "sil32", "sil33", "sil34", "sil35", "sil36", "sil37", "sil38", "sil39"],
    ["sil41", "sil42", "sil43", "sil44", "sil45", "sil46", "sil47", "sil48", "sil49"],
    ["sil51", "sil52", "sil53", "sil54", "sil55", "sil56", "sil57", "sil58", "sil59"],
    ["sil101", "sil102", "sil111", "sil112", "sil113", "sil114"],
    ["sil131", "sil132", "sil141", "sil142", "sil143", "sil144"]
];
$delegues = ["sil01", "sil11", "sil21", "sil31", "sil41", "sil51", "sil101", "sil131"];

/* On traite le tableau de données récupéré de la façon suivante :
1) On découpe le tableau 2D complet en lignes. On lit les lignes une à une. Et à l'intérieur de chaque ligne, on fait ceci...
2) À l'intérieur de chaque ligne, on récupère chaque élément du tableau (donc chaque ID de silo)
3) Si l'ID est un délégué : a) On l'insère dans la variable $text en récupérant sa partie numérique. Exemple: on passe de "sil01" à "01"
                            b) Après ce découpage, on ajoute un point. On passe donc de "sil01" à "01."
4) Que l'étape 3 soit exécutée ou non, dans tous les cas on exécute ce qui suit : on récupère la valeur "0" ou "1" associée à l'élément de la ligne auquel on est et on l'ajoute à $text
5) Si on a sur l'ensemble de la lecture une valeur "0", c'est que l'instruction à envoyer n'est pas l'instruction universelle ("99.111111111")
6) Si on a sur l'ensemble de la lecture une valeur "1", c'est qu'il y a au moins un silo sur lequel prendre la mesure, donc on pourra écrire dans le fichier d'instructions.
7) Pour chaque valeur "1", on peut incrémenter le compteur de 1 */
foreach($tab_silos_complet as $line){
    foreach($line as $element){
        if(in_array($element, $delegues)){
            if(!$debut_text) $text .= "\n";
            else $debut_text = false;
            $delID = str_replace("sil", "", $element);
            $text .= $delID;
            $text .= ".";
        }
        $text .= $_POST[$element];
        if($_POST[$element] == "0") $global = false;
        else if($_POST[$element] == "1"){ 
            $min_mesure = true; 
            $compteur += 1;
        }
    }
}

// Si il n'y a pas minimum une mesure, il n'y a rien à faire, et le programme s'arrête ici. Sinon, le programme continue...
if(!$min_mesure) exit("AUCUN SILO SÉLECTIONNÉ, RIEN NE SE PASSE !");

/* On écrit les données du formulaire dans le fichier "post.txt", en le transformant en chaîne de caractères lisible */
$post_file = fopen("post.txt", "w"); // On tente une ouverture en écriture du fichier "post.txt" (si le fichier n'existe pas, il est automatiquement créé).
                                     // Si le fichier existe et contient des informations, l'écriture va effacer automatiquement le contenu précédent.
if(!$post_file) exit("Ouverture du fichier \"post.txt\" impossible"); // Si l'ouverture a échoué, on quitte le programme.
$post_text = file_get_contents('php://input'); // On récupère les données du formulaire.
$post_text = str_replace("=", " => ", $post_text); // On remplace le caractère"=" par une flèche avec des espaces entre les éléments " => "
$post_text = str_replace("&", "\n", $post_text); // On remplace le caractère séparateur "&" par un passage à la ligne
$post_text = str_replace("sil", "S", $post_text); // On remplace l'expression "sil" par la lettre "S"
if(!fwrite($post_file, $post_text)) exit("Problème d'écriture du fichier \"post.txt\""); // On tente d'écrire le texte ainsi modifié dans le fichier "post.txt". En cas d'échec, le programme s'arrête.
if(!fclose($post_file)) exit("Fermeture du fichier \"post.txt\" impossible"); // On tente de fermer le fichier "post.txt". En cas d'échec, le programme s'arrête.

/* On écrit dans le fichier "nb_silos.txt" le nombre de silos à devoir prendre une mesure */
$nb_silos_f = fopen("nb_silos.txt", "w"); // On tente une ouverture en écriture du fichier "nb_silos.txt" (si le fichier n'existe pas, il est automatiquement créé).
                                          // Si le fichier existe et contient des informations, l'écriture va effacer automatiquement le contenu précédent.
if(!$nb_silos_f) exit("Ouverture du fichier \"nb_silos.txt\" impossible"); // Si l'ouverture a échoué, on quitte le programme.
if(!fwrite($nb_silos_f, $compteur)) exit("Problème d'écriture du fichier \"nb_silos.txt\""); // On tente d'écrire la valeur du compteur dans le fichier "nb_silos.txt". En cas d'échec, le programme s'arrête.
if(!fclose($nb_silos_f)) exit("Fermeture du fichier \"nb_silos.txt\" impossible"); // On tente de fermer le fichier "nb_silos.txt". En cas d'échec, le programme s'arrête.

/* On écrit dans le fichier "date.txt" la date à laquelle on prend la mesure */
$date_f = fopen("date.txt", "w"); // On tente une ouverture en écriture du fichier "date.txt" (si le fichier n'existe pas, il est automatiquement créé).
                                  // Si le fichier existe et contient des informations, l'écriture va effacer automatiquement le contenu précédent.
if(!$date_f) exit("Problème d'ouverture du fichier \"date.txt\" de stockage du formulaire brut qui vient d'être envoyé"); // Si l'ouverture a échoué, on quitte le programme.
date_default_timezone_set("Europe/Brussels"); // On définit le fuseau horaire de la Belgique
$date = date("d/m/Y à H:i:s"); // On récupère la date avec le format suivant : 24/12/2000 à 18:45:52
if(!fwrite($date_f, $date)) exit("Problème d'écriture du fichier \"date.txt\""); // On tente d'écrire le texte ainsi constitué dans le fichier "date.txt". En cas d'échec, le programme s'arrête.
if(!fclose($date_f)) exit("Fermeture du fichier \"date.txt\" impossible"); // On tente de fermer le fichier "date.txt". En cas d'échec, le programme s'arrête.

/* Si la mesure est globale, c'est-à-dire si chaque silo doit lancer une mesure, on lance directement une instruction universelle */
if($global){
    echo "TOUS LES SILOS ONT ÉTÉ SÉLECTIONNÉS | LES INSTRUCTIONS QUI SUIVENT NE SERONT PAS RENSEIGNÉES DANS LE FICHIER \"temp.txt\".\nÀ LA PLACE, NOUS AURONS LA SEULE COMMANDE UNIVERSELLE : 99.111111111\n\n";
    $fichier = fopen("temp.txt", "w"); // On tente une ouverture en écriture du fichier "temp.txt" (si le fichier n'existe pas, il est automatiquement créé).
                                       // Si le fichier existe et contient des informations, l'écriture va effacer automatiquement le contenu précédent.
    if(!$fichier) exit("Ouverture du fichier \"temp.txt\" impossible"); // Si l'ouverture a échoué, on quitte le programme.
    if(!fwrite($fichier, "99.111111111")) exit("Problème d'écriture du fichier \"temp.txt\""); // On tente d'écrire l'instruction universelle dans le fichier "temp.txt". En cas d'échec, le programme s'arrête.
    if(!fclose($fichier)) exit("Fermeture du fichier \"temp.txt\" impossible"); // On tente de fermer le fichier "date.txt". En cas d'échec, le programme s'arrête.
}

/* Si la mesure n'est pas globale, on lance directement une instruction universelle */
else{
    echo "/***** Contenu de la variable \$text avant traitement *****/\n\n";
    echo $text; // On affiche le texte
    echo "\n\n/***** Nombre de silos sur la ligne *****/\n\n"; // On affiche une ligne séparatrice
    $filtre_tab = explode("\n", $text); // On crée un tableau reprenant dans chque élément les instructions
    $final_text = ""; // On crée une variable qui va reprendre le texte final, le texte qui va être écrit dans le fichier "temp.txt"
    
    /* Pour chaque ligne du texte brut, on exécute les actions suivantes... */
    foreach($filtre_tab as $ligne){
        $ID = substr($ligne, 0, 3); // On récupère l'ID de la ligne et le caractère séparateur "."
        $ordres_de_ligne = substr($ligne, 3); // On enlève de la ligne les 3 premiers caractères (l'ID du délégué + le caractère séparateur ".")
        $nb_char = strlen($ordres_de_ligne); // On récupère le nombre d'instructions, soit le nombre de silos de la ligne
        echo $nb_char; // On affiche le nombre de silos / instructions de la ligne
        echo " => "; // On affiche une flèche
        if($nb_char == 4) $ordres_de_ligne .= "00000"; // Si il y a 4 silos sur la ligne, on ajoute 5 "0" après les 4 instructions de la ligne, pour arrondir à 9 caractères
        else if($nb_char == 6) $ordres_de_ligne .= "000"; // Si il y a 6 silos sur la ligne, on ajoute 5 "0" après les 6 instructions de la ligne, pour arrondir à 9 caractères
        echo $ordres_de_ligne; // On affiche la ligne ainsi modifié
        echo "\n"; // On passe à la ligne
        $min_ordre = false; // On crée une variable pour vérifier si il y a minimum une instruction "1" sur la ligne. Au départ, on la suppose fausse
        for($i=0; $i<$nb_char; $i++){
            if($ordres_de_ligne[$i] == "1") $min_ordre = true; // Si il y a minimum un caractère "1" sur la ligne, on peut inscrire cette ligne dans le fichier d'instructions
        }
        if($min_ordre){ // Si minimum un silo sur la ligne doit prendre une mesure, il y a lieu d'insérer cette ligne dans le fichier d'instructions. Dans ce cas...
            $final_text .= $ID; // On écrit l'ID de la ligne dans le texte final qui va être inscrit dans le fichier "temp.txt"
            $final_text .= $ordres_de_ligne; // On écrit les instructions de la ligne (en 9 caractères) dans le texte final qui va être inscrit dans le fichier "temp.txt"
            $final_text .= "\n"; // On écrit un passage à la ligne dans le texte final qui va être inscrit dans le fichier "temp.txt". 
        }                        // Ce passage à la ligne devient le caractère séparateur de la ligne
    }
    echo "\n/***** CONTENU DU FICHIER D'INSTRUCTIONS *****/\n\n";
    print_r($final_text); // On affiche le contenu du texte final

    $fichier = fopen("temp.txt", "w"); // On tente une ouverture en écriture du fichier "temp.txt" (si le fichier n'existe pas, il est automatiquement créé).
                                       // Si le fichier existe et contient des informations, l'écriture va effacer automatiquement le contenu précédent.
    if(!$fichier) exit("Ouverture du fichier \"temp.txt\" impossible"); // Si l'ouverture a échoué, on quitte le programme.
    if(!fwrite($fichier, $final_text)) exit("Ecriture dans le fichier \"temp.txt\" impossible"); // On tente d'écrire le texte ainsi modifié dans le fichier "temp.txt". En cas d'échec, le programme s'arrête.
    if(!fclose($fichier)) exit("Fermeture du fichier \"temp.txt\" impossible"); // On tente de fermer le fichier "date.txt". En cas d'échec, le programme s'arrête.
}
?>
</pre>
