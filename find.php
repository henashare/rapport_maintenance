<?php
include_once('portail/session.php');
include_once('portail/conn.php');
session_start(); // Ondémarre une session sur la page

// Fonction pour incrémenter de 1 l'année
function increment_year($Y){ return ($Y += 1);}

// Fonction pour incrémenter le mois selon la valeur entière renseignée en deuxième paramètre
function increment_month_per($M, $i){ return ($M += $i);}

// Fonction pour incrémenter le jour de sept unités, ce qui revient à incrémenter d'une semaine
function increment_week($D){ return $D += 7;}

// Fonction pour voir si le mois renseigné en paramètre est février ou non
function is_february($M){ return ($M == 2) ? true : false;}

// Fonction pour voir si le mois renseigné est un mois de 31 jours
function is_31($M){
    if(($M < 8) && ($M % 2)) return true; // Si le mois est inférieur à 8 et impair, alors le mois est de 31 jours. 
    else if(($M >= 8) && !($M % 2)) return true; // Si le mois est supérieur ou égal à 8 et pair, alors le mois est de 31 jours
    return false; // Sinon, le mois n'est pas de 31 jours
}

// Fonction pour déterminer si une année est bissextile:
// Si l'année est divisible par 4 mais pas par 100, ou si l'année est divisible par 400 => année bissextile.
function is_leap_year($Y){
    if(($Y % 4 == 0) && ($Y % 100 != 0)) return true;
    else if($Y % 400 == 0) return true;
    return false;
}

// Fonction pour créer une nouvelle date à partir de l'ordre de maintenance qui va être supprimé
function new_date($every){
    $current_date = date("Y-m-d"); // On récupère la date actuelle sous le format ['année'-'mois'-'jour']
    $date_array = explode("-", $current_date); // On divise la date en un tableau de trois éléments, chaque partie séparée par le caractère "-"
    $year = intval($date_array[0]); // On transforme la chaîne de caractères de l'année en valeur entière
    $month = intval($date_array[1]); // On transforme la chaîne de caractères du mois en valeur entière
    $day = intval($date_array[2]); // On transforme la chaîne de caractères du jour en valeur entière
    if($every == "1") $year = increment_year($year); // Si il faut renouveler tous les ans, on incrémente l'année de 1
    else if($every == "2") $month = increment_month_per($month, 9); // Si il faut renouveler tous les 9 mois, on incrémente le mois de 9
    else if($every == "3") $month = increment_month_per($month, 6); // Si il faut renouveler tous les 6 mois, on incrémente le mois de 6
    else if($every == "4") $month = increment_month_per($month, 3); // Si il faut renouveler tous les 3 mois, on incrémente le mois de 3
    else if($every == "5") $month = increment_month_per($month, 1); // Si il faut renouveler tous les mois, on incrémente le mois de 1
    else if($every == "6"){ // Si il faut renouveler chaque semaine...
        $day = increment_week($day); // ... on incrémente le jour de 7
        if(is_31($month)){ // Si le mois est un 31 et que le jour est supérieur à 31, on garde le modulo de 31 en jour et on incrémente le mois de 1
            if($day > 31){
                $day = $day % 31;
                $month = increment_month_per($month, 1);
            }
        }
        else if(is_february($month)){ // Si le mois février et que le jour est supérieur à 28 (ou 29 si année bissextile),
                                      // on garde le modulo de 31 en jour et on incrémente le mois de 1
            if(!is_leap_year($month) && ($day > 28)){
                $day = $day % 28;
                $month = increment_month_per($month, 1);
            }
            else if(is_leap_year($month) && ($day > 29)){
                $day = $day % 29;
                $month = increment_month_per($month, 1);
            }
        }
        else{ // Si le mois est un 30 et que le jour est supérieur à 30, on garde le modulo de 30 en jour et on incrémente le mois de 1
            if($day > 30){
                $day = ($day % 30);
                $month = increment_month_per($month, 1);
            }
        }
    }
    // Si le mois est inférieur ou égal à 12, alors on retourne la chaîne suivante :
    if($month <= 12) return (strval($year) . "-" . strval($month) . "-" . strval($day));
    // Sinon, on retourne la chaîne suivante (on incrémente d'un an et on garde le modulo du mois par 12) :
    else{
        $year = increment_year($year);
        return (strval($year) . "-" . strval($month % 12) . "-" . strval($day));
    }
}

// Si on a bel et bien des valeurs dans le post, au niveau de l'index et de l'identifiant de l'ordre de maintenance...
if(isset($_POST["index_"]) && isset($_POST["id_"])){
    // On récupère ces deux informations avec une protection HTML
    $index = htmlspecialchars($_POST["index_"]);
    $id = htmlspecialchars($_POST["id_"]);
    // Si jamais il y a un utilisateur connecté, le code pourra être exécuté. Sans connexion, rien ne se passe.
    if(is_logged()){
        $conn = new mysqli($servername, $username, $password, $database); // On ouvre une nouvelle connexion MYSQL avec les paramètres importés depuis un autre fichier
        if($conn->connect_error) die("ERREUR DE CONNEXION MYSQL : " . $conn->connect_error); // En cas d'erreur, on ferme la page et la suite ne sera pas exécutée
        $req = "SELECT * FROM gmao WHERE index_=" . $index; // On crée une première requête MYSQL pour récupérer les valeurs associées à l'index récupéré
        $results = $conn->query($req); // On exécute la requête
        foreach($results as $result){ // Pour chaque ligne retrouvée (en théorie il n'y en a qu'une)
            if($result["index_"] == $index && $result["random"] == $id){ // Si l'index est bon et que le code aussi
                $req = "DELETE FROM gmao WHERE index_=" . $index; // Alors on crée la requête de suppression à partir de l'index
                $conn->query($req); // Et on supprime effectivement la ligne correspondant à l'ordre de maintenance que l'utilisateur a validé
                echo($result["index_"] . "&" . $result["random"]); // On renvoie à la page utilisateur l'index et l'identifiant
                if($result["regularity"] == "1"){ // Si l'ordre de commande est à relancer en fonction de l'intervalle renseigné...
                    $random = rand(-32760, 32760); // On crée un nouveau code d'identification aléatoire
                    // on récupère les valeurs importantes de la ligne qui a été supprimée
                    $regularity = intval($result["regularity"]); 
                    $every = intval($result["every"]);
                    $toa = intval($result["toa"]);
                    $alter_subj = $result['alter_subj'];
                    $alter_desc = $result['alter_desc'];
                    // On crée une nouvelle échéance en fonction du paramètre spécifié (allant de 1 à 6)
                    $date = new_date($result["every"]);
                    // Si jamais le type d'ordre est original (créé par l'utilisateur-administrateur)
                    if($toa == 99) $req = "INSERT INTO gmao(regularity, echeance, every, toa, alter_subj, alter_desc, random) VALUES($regularity, '$date', $every, $toa, '$alter_subj', '$alter_desc', $random)";
                    // Si le type d'ordre est prédéfini...
                    else $req = "INSERT INTO gmao(regularity, echeance, every, toa, random) VALUES($regularity, '$date', $every, $toa, $random)";
                    $conn->query($req); // On exécute la requête d'insertion du nouvel ordre de maintenance
                }
            }
        }
    }
}
?>