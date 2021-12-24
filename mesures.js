var compteur = 0;
var mode_mesure = false;

// Fonction pour vérifier si un fichier existe
function doesFileExist(urlToFile) {
  var req = new XMLHttpRequest(); // On crée une requête XHR, qui permet de demander des données en provenance du serveur
  req.open('HEAD', urlToFile, false); // Requête = ouverture du fichier renseigné : HEAD = demande des entêtes de la ressource
                                      //                                            false = mode synchrone, le script JS se bloque tant que la requête n'a pas de réponse
  req.send(); // On envoie la requête d'ouverture du fichier
  if (req.status == "404") return false; // Si le statut de la requête est "404", c'est que la requête a échouée, donc que le fichier n'exite pas
  else return true; // Dans le cas contraire, la requête d'ouverture du fichier a fonctionné, donc le fichier existe
}

let liste_silos = [
  ["L0", "L10", "L20", "L30", "L40", "L50", "L100", "L130"],
  ["S01", "S02", "S03", "S04", "S05", "S06"],
  ["S11", "S12", "S13", "S14", "S15", "S16", "S17", "S18", "S19"],
  ["S21", "S22", "S23", "S24", "S25", "S26", "S27", "S28", "S29"],
  ["S31", "S32", "S33", "S34", "S35", "S36", "S37", "S38", "S39"],
  ["S41", "S42", "S43", "S44", "S45", "S46", "S47", "S48", "S49"],
  ["S51", "S52", "S53", "S54", "S55", "S56", "S57", "S58", "S59"],
  ["S101", "S102", "S111", "S112", "S113", "S114"],
  ["S131", "S132", "S141", "S142", "S143", "S144"]
];
  
let liste_sil = [
  ["sil01", "sil02", "sil03", "sil04", "sil05", "sil06"],
  ["sil11", "sil12", "sil13", "sil14", "sil15", "sil16", "sil17", "sil18", "sil19"],
  ["sil21", "sil22", "sil23", "sil24", "sil25", "sil26", "sil27", "sil28", "sil29"],
  ["sil31", "sil32", "sil33", "sil34", "sil35", "sil36", "sil37", "sil38", "sil39"],
  ["sil41", "sil42", "sil43", "sil44", "sil45", "sil46", "sil47", "sil48", "sil49"],
  ["sil51", "sil52", "sil53", "sil54", "sil55", "sil56", "sil57", "sil58", "sil59"],
  ["sil101", "sil102", "sil111", "sil112", "sil113", "sil114"],
  ["sil131", "sil132", "sil141", "sil142", "sil143", "sil144"]
];

// On crée un tableau de clés d'accès. Ces clés d'accès permettent d'activer des raccourcis clavier
// Pour chaque bouton de sélection de ligne (L0, L1, etc), on associe le raccourci clavier ALT+TOUCHE_ASSOCIÉE
let access_keys = ["à", "&", "é", '"', "'", "(", "§", "è"];
for(var i=0; i<8; i++) document.getElementById(liste_silos[0][i]).accessKey = access_keys[i];

// Si un caractère clavier est tapé...
$(document).keypress(function(e){
  // Dans le cas d'un point d'interrogation, on affiche une fenêtre pop-up d'aide
  if(e.key == "?") alert("Raccourcis de la page (utiliser le pad numérique tout à droite du clavier pour les trois derniers) :\n\nAlt + M | Retour au menu principal\n\nAlt + à | Sélection de la ligne 0\nAlt + & | Sélection de la ligne 1\nAlt + é | Sélection de la ligne 2\nAlt + \" | Sélection de la ligne 3\nAlt + ' | Sélection de la ligne 4\nAlt + ( | Sélection de la ligne 5\nAlt + § | Sélection de la ligne 6 \nAlt + è | Sélection de la ligne 7\nAlt + ! | Sélection de la ligne 8\nAlt + ç | Sélection de la ligne 9\nAlt + ) | Sélection de la ligne 50\n\nAlt + / | Sélectionner tout\nAlt + * | Enlever la sélection\nAlt + - | Envoyer la sélection");
});

// Lorsque le document est chargé...
$(document).ready(function(){
  // Si le fichier temp.txt existe sur le serveur, on désactive le bouton d'envoi de sélection. On active également le mode mesure sur le reste de la page.
  // Sinon, on active le bouton d'envoi de sélection.
  if(doesFileExist("temp.txt")){ document.getElementById("send").disabled = true; mode_mesure = true;}
  else document.getElementById("send").disabled = false;
});

// Si jamais on bouge la souris sur le document...
$(document).mousemove(function(){
  // On crée une variable mesure en cours qu'on met à faux par défaut
  var mes_en_cours = false;
  // Si le fichier temp.txt existe, (1) on désactive le bouton d'envoi de la sélection, (2) on met à vrai la variable de mesure en cours, ainsi que le mode mesure.
  // Sinon, on active le bouton d'envoi de la sélection.
  if(doesFileExist("temp.txt")){document.getElementById("send").disabled = true; mes_en_cours = true; mode_mesure = true;}
  else document.getElementById("send").disabled = false;
  // Si la mesure en cours s'est terminée et que le mode mesure est toujours actif, on désactive le mode mesure et on recharge la page.
  if(!mes_en_cours && mode_mesure){
    mode_mesure = false;
    location.reload();
  }
  // Sinon, si on a bien une mesure en cours...
  else if(mes_en_cours){
    // On récupère le contenu du fichier post.txt, et on utilise son contenu dans une fonction.
    $.get("post.txt", function(post_text){
      var lignes = post_text.split("\n"); // On crée un tableau dont chaque élément est une ligne du fichier post.txt
      // Pour chaque élément du tableau, on crée une variable qui récupère cet élément sous forme d'un tableau bis.
      // De ce tableau bis, on vérifie si la valeur du dernier caractère est "1".
      // Si oui, on assigne au bouton associé une couleur de fond brune et une couleur de texte blanche.
      for(var i=0; i<63; i++){
        var str = lignes[i];
        var L = str.length;
        if(str[L-1] == "1"){
          $("#"+str.substring(0, L-5)).css("background-color", "#7C4F00").css("color", "#FFFFFF");
        }
      }
    });
  }
});
// Si nous avons une sélection faite au niveau du formulaire, on crée une fonction
$("input").click(function(){
  // On commence par récupérer la valeur de l'élément sélectionné
  var nom = $(this).val();
  // Si on n'est pas en mode mesure, la sélection peut être considérée. Sinon, rien ne se passera.
  if(!mode_mesure){
    // Si le contenu de l'élément de formulaire correspond au texte du bouton d'envoi de sélection, on vérifie si un silo a été sélectionné.
    // Si ce n'est pas le cas, on génère un message d'avertissement.
    if(nom=="Envoyer la sélection"){
      if(compteur == 0) alert("Aucun silo n'a été sélectionné. Dès lors, aucune mesure ne sera lancée sur les silos.\n\nVous allez maintenant être redirigé vers la page d'accueil.");
    }
    // Si le contenu de l'élément de formulaire correspond au texte du bouton de sélection totale...
    if(nom=="Sélectionner tout"){
        compteur = 63; // On met le compteur à 51, soit le nombre total de silos
        for(var i=0; i<8; i++){ // Pour chaque ligne de silos
            var nb_sil = 9; // On crée une variable qui prend la valeur initiale 9, soit le nombre de silos généralement rencontrés sur une ligne
            if(i==0 || i == 6 || i == 7){ nb_sil = 6;} // Si on est à la ligne 0, 100 ou 130, le nombre de silos est en fait de 6
            for(var j=0; j<nb_sil; j++){ // Pour chaque silo...
                var id = liste_silos[i+1][j]; // On récupère son premier ID associé
                var id2 = liste_sil[i][j]; // On récupère son deuxième ID associé
                $("#"+id).css("background-color", "#0CB90A").css("color", "#FFFFFF"); // On passe sa couleur de fond à vert, et sa couleur de texte à blanche
                $("#"+id2).val("1"); // On met sa valeur à 1
            }
            // On change la couleur de fond de chaque bouton de sélection de ligne pour mettre la couleur de sélection. Le dernier élément est à 196 pour l'indiquer.
            // 199, 197, 196 = ligne sélectionnée | 199, 197, 196 = ligne non sélectionnée
            $("#"+liste_silos[0][i]).css("background-color", "rgb(199, 197, 196)");
        }
    }
    // Si le contenu de l'élément de formulaire correspond au texte du bouton de désélection totale...
    else if(nom=="Enlever la sélection"){
      compteur = 0; // On met le compteur à 0
      for(var i=0; i<8; i++){ // Pour chaque ligne de silos
          var nb_sil = 9; // On crée une variable qui prend la valeur initiale 9, soit le nombre de silos généralement rencontrés sur une ligne
          if(i==0 || i == 6 || i == 7){ nb_sil = 6;} // Si on est à la ligne 0, 100 ou 130, le nombre de silos est en fait de 6
          for(var j=0; j<nb_sil; j++){ // Pour chaque silo...
              var id = liste_silos[i+1][j]; // On récupère son premier ID associé
              var id2 = liste_sil[i][j]; // On récupère son deuxième ID associé
              $("#"+id).css("background-color", "#FFFFFF").css("color", "#006DA2"); // On passe sa couleur de fond à blanche, et sa couleur de texte à bleu Euroquartz
              $("#"+id2).val("0"); // On met sa valeur à 0
          }
          // On change la couleur de fond de chaque bouton de sélection de ligne pour mettre la couleur de sélection. Le dernier élément est à 196 pour l'indiquer.
          // 199, 197, 196 = ligne sélectionnée | 199, 197, 196 = ligne non sélectionnée
          $("#"+liste_silos[0][i]).css("background-color", "rgb(199, 197, 197)");
      }
    }
    // Sinon, le contenu de l'élément de formulaire correspond à autre chose (une ligne, ou un silo)...
    else{
      var silo = true; // On crée une variable silo qu'on passe par défaut à vrai. On postule que le bouton de formulaire sélectionné est un silo (et non une ligne)
      for(var i=0; i<8; i++){ // Pour chaque ligne de silos
          if(liste_silos[0][i].includes(nom)){ // Si le contenu de l'élément de formulaire correspond à une ligne
              var selected = false; // On crée une variable pour savoir si la ligne est sélectionnée ou non
              var color = $(this).css("background-color"); // On récupère la couleur du bouton de la ligne
              if(color=="rgb(199, 197, 197)"){ // Si la couleur est 199, 197, 197, la ligne était non-sélectionnée. Donc on la sélectionne...
                  selected = true; // La variable de sélection passe à vrai
                  $(this).css("background-color", "rgb(199, 197, 196)"); // La couleur de fond passe à ligne sélectionnée
              }
              else $(this).css("background-color", "rgb(199, 197, 197)"); // Sinon, la couleur passe à ligne non-sélectionnée (et la variable de sélection reste fausse)
              silo = false; // La variable silo passe à faux, car c'est bien une ligne et non juste un silo qu'on sélectionne
              var nb_s = 9; // on crée une variable pour le nombre de silos de la ligne. Par défaut, cette valeur est à 9
              if(i == 0 || i == 6 || i == 7) nb_s = 6; // Si la ligne 0, 100 ou 130 a été sélectionnée, le nombre de silos de la ligne est de 6
              if(!selected) compteur -= nb_s; // Si la sélection est fausse, on décrémente le compteur de silos sélectionnés du nombre de silos de la ligne
              else compteur += nb_s; // Sinon, on incrémente le compteur de silos sélectionnés du nombre de silos de la ligne
              for(var j=0; j<nb_s;j++){ // Pour chaque silo de la ligne
                  var id = liste_silos[i+1][j]; // On récupère le premier ID associé
                  var id2 = liste_sil[i][j]; // On récupère le deuxième ID associé
                  // Si la ligne a été sélectionnée : fond vert, texte blanc | Si la ligne n'a pas été sélectionnée : fonc blanc, texte bleu Euroquartz
                  if(!selected){ $("#"+id).css("background-color", "#FFFFFF").css("color", "#006DA2"); $("#"+id2).val("0");}
                  else{ $("#"+id).css("background-color", "#0CB90A").css("color", "#FFFFFF"); $("#"+id2).val("1");}
              }
              break; // Puisque la détection a été faite, inutile de faire les autres, on sort de la boucle
          }
      }
      // Si le bouton de formulaire sélectionné est effectivement un silo...
      if(silo){
        var nom = $(this).val(); // On récupère le nom de ce bouton
        var color = $(this).css("background-color"); // On récupère la couleur de ce bouton
        var nb_sil; // On crée une variable pour compter le nombre de silos de la ligne du silo concerné
        var selected = true; // On crée une variable de sélection qu'on passe à vrai par défaut
        // Si la couleur de fond = vert : couleur de fond = blanc, et couleur de texte = bleu Euroquartz. Sinon, couleur de fond = vert, couleur de texte = blanc
        if(color == "rgb(12, 185, 10)") $(this).css("background-color", "#FFFFFF").css("color", "#006DA2");
        else{ $(this).css("background-color", "#0CB90A").css("color", "#FFFFFF"); selected = false;}
        // Pour chaque ligne...
        for(var i=1; i<9; i++){
          if(i==1 || i == 7 || i == 8) nb_sil = 6; // Si la ligne est la ligne 0, 100 ou 130 (le tableau liste_silos a comme première ligne les noms de lignes), le nombre de silos de la ligne est 6
          else nb_sil = 9; // Sinon, le nombre de silos de la ligne est 9
          if(liste_silos[i].includes(nom)){ // Si la ligne inclut le silo sélectionné
            for(var j=0; j<nb_sil; j++){ // Pour chaque silo de la ligne...
              if(liste_silos[i][j] == nom){ // Si l'élément de la liste de silos est le silo sélectionné
                var id = nom; // Le premier ID du silo est son nom
                var id2 = liste_sil[i-1][j]; // Le second ID du silo est dans le tableau liste_sil
                if(selected){ $("#"+id2).val("0"); compteur -=1;} // Si le silo est sélectionné, on met sa valeur à 0, on décrémente le compteur de 1
                else { $("#"+id2).val("1"); compteur +=1;} // Sinon, on met sa valeur à 1, on incrémente le compteur de 1
                break; // On sort de la boucle
              }
            }
          }
        }
      }
    }
  }
});
