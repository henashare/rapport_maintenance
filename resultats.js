/********** FONCTIONS REQUÊTES AJAX **********/
// Fonction pour filtrer le fichier JSON, et récupérer les informations de façon propre
function json_filter(data){
  var json = JSON.stringify(data);
  json = json.replaceAll("[", "");
  json = json.replaceAll("]", "");
  json = json.replaceAll("{", "");
  json = json.replaceAll("}", "");
  json = json.replaceAll('"', '');
  json = json.replaceAll("id_silo:", "");
  json = json.replaceAll("h_mm:", "");
  json = json.replaceAll("date:", "");
  json = json.replaceAll("MAX(date):", "");
  json = json.split(",");
  return json;
}
// Fonction pour inverser le jour et le mois d'une chaîne de caractères contenant une date, et pour ajouter un caractère "/"
function reverse_month_and_day(date){
  var month = date.substr(0, 2);
  var day = date.substr(3, 2);
  var rest = date.substr(5);
  var changed_date = day+"/"+month+rest;
  return changed_date;
}
// Fonction pour envoyer les dates sélectionnées dans le cas où les calendriers apparaissent sur la page
function send_dates(){
  var date_debut = $("#date_debut").val();
  var date_fin = $("#date_fin").val();
  if(date_debut == null || date_fin == null){
    var today = new Date();
    const final_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const post_form = (($("#ligne_silo").val()) + "&13&" + final_date + "&" + final_date);
    console.log(post_form);
    return post_form;
  }
  else{
    const post_form = (($("#ligne_silo").val()) + "&13&" + date_debut + "&" + date_fin);
    console.log(post_form);
    return post_form;
  }
}
//Fonction pour activer la création du tableau et du graphique lors du clic sur le bouton de validation de sélection des dates
function trigger(){
  $("#ligne_silo").triggerHandler("change");
}
// Fonction pour envoyer une requête ajax. Elle envoie la ligne sélectionnée et le type de sélection
function make_ajax_post(line_sel="#ligne_silo", type_sel="#type_select"){
  var line_sel_val = $(line_sel).val();
  var type_sel_val = $(type_sel).val();
  if(type_sel_val != "13"){
    const post = (line_sel_val + "&" + type_sel_val);
    console.log(post);
    return post;
  }
 else return send_dates();
}
/********** FONCTIONS TABLEAU **********/
// Fonction pour récupérer les valeurs des cellules
function get_td_val(a){
  var text = $("#"+a).val();
  return parseFloat(text);
}
// Fonction pour modifier l'unité de la hauteur renseignée dans la cellule du tableau, et pour ajuster la valeur en fonction
function change_height(){
  var unite = $("#h0").text();
  unite = unite.slice(unite.length-2, unite.length);
  for(var a=0; a<$("#table tr").length-1; ++a){
    var hauteur = get_td_val(a);
    if(unite == " m"){
      hauteur = (hauteur/10).toFixed(0);
      $("#h"+a).html(hauteur+" cm");
    }
    else if(unite == "cm"){
      hauteur = (hauteur).toFixed(0);
      $("#h"+a).html(hauteur+" mm");
    }
    else{
      hauteur = (hauteur/1000).toFixed(2);
      $("#h"+a).html(hauteur+" m");
    }
  }
}
/********** FONCTIONS GRAPHIQUES **********/
// Fonction qui récupère les IDs à partir du JSON filtré
function from_JSON_get_ids(json_filtered){
  var ids_array = [], j=0;
  for(var i=0; i<json_filtered.length; ++i){
    ids_array[j] = json_filtered[i];
    ++j; i+=2;
  }
  return add_S_to(ids_array);
}
// Fonction qui récupère les hauteurs relatives à partir du JSON filtré
function from_JSON_get_heights(json_filtered){
  const hauteur_max_silo = 12000;
  var heights_array = [], j=0;
  for(var i=1; i<json_filtered.length; ++i){
    heights_array[j] = json_filtered[i];
    heights_array[j] = ((parseInt(heights_array[j])/hauteur_max_silo)*100).toFixed(2);
    ++j; i+=2;
  }
  return heights_array;
}
// Fonction qui récupère les dates à partir du JSON filtré
function from_JSON_get_dates(json_filtered){
  var dates_array = [], j=0;
  for(var i=2; i<json_filtered.length; ++i){
    dates_array[j] = (json_filtered[i].substring(5,json_filtered[i].length-3));
    dates_array[j] = dates_array[j].replace("-", "/");
    dates_array[j] = reverse_month_and_day(dates_array[j]);
    ++j; i+=2;
  }
  return dates_array;
}
// Fonction pour éliminer les doublons d'un tableau simple entrée
function filter(full_array){
  var filtered_array = [];
  for(var i=0; i<full_array.length; ++i){
    if(!filtered_array.includes(full_array[i])) filtered_array.push(full_array[i]);
  }
  return filtered_array;
}
// Fonction qui forme un tableau à 3 dimensions à partir de 3 tableaux à une seule dimension
function triple_array(a, b, c){
  var final_array = [];
  final_array.push(a, b, c);
  return final_array;
}
// Fonction qui trie un tableau à plusieurs dimensions selon la dimension prioritaire
function sort_triple_array(triple_array, prior=0){
  var array_a = triple_array[0]; var array_b = triple_array[1]; var array_c = triple_array[2]; var sort_array = []; var a = []; var b = []; var c = [];
  if(prior == 0){
    sort_array = array_a.slice().sort();
    for(var i=0; i<sort_array.length; ++i){
      for(var j=0; j<sort_array.length; ++j){
        if(sort_array[i] == array_a[j] && (!b.includes(array_b[j]) ||  !c.includes(array_c[j]))){
          a.push(array_a[j]);
          b.push(array_b[j]);
          c.push(array_c[j]);
          break;
        }
      }
    }
  }
  else if(prior == 2){
    sort_array = array_c.slice().sort();
    for(var i=0; i<sort_array.length; ++i){
      for(var j=0; j<sort_array.length; ++j){
        if(sort_array[i] == array_c[j] && (!a.includes(array_a[j]) ||  !b.includes(array_b[j]))){
          a.push(array_a[j]);
          b.push(array_b[j]);
          c.push(array_c[j]);
          break;
        }
      }
    }
  }
  else return 0;
  var t_array = [];
  t_array.push(a); t_array.push(b); t_array.push(c);
  return t_array;
}
// Fonction qui sélectionne et retourne le titre du graphique
function set_title(){
  var select_type = $("#type_select").val();
  var ligne = $("#ligne_silo").val();
  var titre;
  if(ligne == "10") ligne = "50";
  if(select_type == "11") titre = ("Graphique du dernier niveau mesuré de chaque silo de la ligne " + ligne + " :");
  else if(select_type == "12") titre = ("Graphique des trente dernières mesures effectuées sur la ligne " + ligne + " :");
  else if(select_type == "13") titre = ("Graphique des niveaux mesurés pour les dates sélectionnées" + ligne + " :");
  return titre;
}
// Fonction pour afficher les ID de silo en abscisse sur le graphique
function add_S_to(tab){
  var S_tab = tab;
  for(var a=0; a<tab.length; ++a){
    if(tab[a].length == 1) tab[a] = "S0" + tab[a];
    else tab[a] = "S" + tab[a];
  }
  return S_tab;
}
// Fonction pour sélectionner le type de graphique à afficher
function kind_of_chart(){
  var val = $("#type_select").val();
  if(val == "11") return 'bar';
  else return 'line';
}
// Fonction pour regrouper
function regroup_elements(filtered_array, labels_array){
  var final_array = [], l_labels = [];
  var ids_array = filter(filtered_array[0].slice().sort());
  var ids_or_dates = 0;
  if(($("#type_select").val()) == "11") l_labels = filtered_array[0];
  else{
    l_labels = filtered_array[2];
    for(var a=0; a<ids_array.length; ++a){
      final_array[a] = Array(labels_array.length);
    }
    ids_or_dates = 1;
  }
  var data_array = filtered_array[1];
  for(var i=0; i<l_labels.length; ++i){
    for(var j=0; j<labels_array.length; ++j){
      if(l_labels[i] == labels_array[j]){
        if(!ids_or_dates){final_array[j] = data_array[i]; break;}
        else if(ids_or_dates){
          var k = ids_array.indexOf(filtered_array[0][i]);
          final_array[k].splice(j, 1, data_array[i]);
        }
      }
      else{
        if(ids_or_dates){
          var k = ids_array.indexOf(filtered_array[0][i]);
          if((final_array[k][j] == null) && (j == 0)) final_array[k].splice(j, 1, final_array[k][j]);
          else if(final_array[k][j] == null && (j > 0)) final_array[k].splice(j, 1, final_array[k][j]);
        }
      }
    }
  }
  return final_array;
}
// Fonction pour faire les tableaux définitifs, en ajoutant les options du tableau (couleurs, épaisseur de bordure, etc).
function make_chart_data(array, array_labels, silos=[0, 0]){
  var silo_data_array = [], datasets = [];
  for(var a=0; a<array.length; ++a){
    if($("#type_select").val() == "11"){
      datasets = [{
        data: array,
        backgroundColor: bg_colors,
        borderColor: bd_colors,
        borderWidth: 2
      }];
      break;
    }
    else{
      datasets[a] = {
        label: silos[a],
        data: array[a],
        backgroundColor: bg_colors[a],
        borderColor: bd_colors[a],
        borderWidth: 2,
        spanGaps: true,
        tension: 0.3
      };
    }
  }
  return datasets;
}
// Fonction pour déterminer quel type d'étiquettes (les ID de silo ou les dates) sera appliqué
function which_labels(a, b){
  if($("#type_select").val() == "11") return a;
  else return b;
}
// Fonction pour déterminer l'affichage de l'abscisse du graphique
function which_x_title(){
  if($("#type_select").val() == "11") return "Identifiants des silos";
  else return "Dates de la mesure";
}

/**********************************************************************/
/************************ DÉBUT DU PROGRAMME **************************/
/**********************************************************************/
/***** Configuration préalable et variables globales *****/
var graphique, contexte, destruction = 0;
const bg_colors = ['rgba(250, 75, 80, 0.55)','rgba(80, 200, 0, 0.55)','rgba(140, 107, 9, 0.55)','rgba(222, 234, 206, 0.55)','rgba(255, 0, 255, 0.55)','rgba(42, 0, 116, 0.55)','rgba(129, 24, 8, 0.55)','rgba(255, 200, 64, 0.55)','rgba(45, 31, 29, 0.55)'];
const bd_colors = ['rgba(250, 75, 80, 1)','rgba(80, 200, 0, 1)','rgba(140, 107, 9, 1)','rgba(222, 234, 206, 1)','rgba(255, 0, 255, 1)','rgba(42, 0, 116, 1)','rgba(129, 24, 8, 1)','rgba(255, 200, 64, 1)','rgba(45, 31, 29, 1)'];

Chart.defaults.color = "#FFFFFF";
Chart.defaults.font.family = "Times";
Chart.defaults.font.size = 18;
/********** LORSQUE LA PAGE EST CHARGÉE **********/
$(document).ready(function(){
  // On prépare une requête AJAX et on prépare deux tableaux pour les étiquettes / labels du graphique
  var req = make_ajax_post();
  var id_labels = [], date_labels = [];
  // On envoie la requête AJAX vers le fichier PHP
  $.ajax({
    url: '/resultats.php',
    type: 'post',
    data: req,
    // Si la requête AJAX est un succès, alors on exécute le long bloc suivant, le but étant d'afficher le graphique
    success: function(response){
      // On affiche la table envoyée par le fichier PHP
      $("#silo_table").html(response);
      // On récupère les données depuis le fichier JSON, lui aussi modifié par le fichier PHP
      $.getJSON('data.json', function(data){
        /* On trie le contenu du fichier JSON pour récupérer en tableau les données débarrassées de la syntaxe JSON.
           Ensuite, on récupère dans deux tableaux différents (a) les identifiants de silos, (b) les hauteurs et (c) les dates auxquelles les mesures ont été prises.
           Puis, à partir des tableaux (a) et (c), on enlève les doublons des identifiants et des dates, tout en les triant dans un ordre alphabétique / numérique.
           Ils serviront pour l'affichage du graphique, comme données d'abscisse.
        */
        var tableau = json_filter(data);
        var l_id = from_JSON_get_ids(tableau);
        var l_dataset = from_JSON_get_heights(tableau);
        var l_date = from_JSON_get_dates(tableau);
        id_labels = filter(l_id).sort();
        date_labels = filter(l_date).sort();
        /*
          On fait un tableau 3 dimensions, dans lequel on rassemble les trois tableaux (a), (b) et (c).
          Ensuite, on trie le tableau en fonction de la colonne d'ordre de référence (selon les ID de silos ou selon les dates).
          On regroupe les différents éléments en fonction de leur appartenance à l'étiquette voulue. Exemple, si le graphique s'affiche selon les dates, on regroupe ensemble les hauteurs de la date A.
          A partir de ce tableau multidimensionnel, on crée un tableau final qui va être finalement utilisé pour le graphique.
        */
        var full_disorganised_array = triple_array(l_id, l_dataset, l_date);
        var tri_tab = sort_triple_array(full_disorganised_array, 2);
        var data_tab =[];
        var final_datasets =[];
        if($("#type_select").val() == "11"){
          data_tab = regroup_elements(tri_tab, id_labels);
          final_datasets = make_chart_data(data_tab, id_labels);
        }
        else{
          data_tab = regroup_elements(tri_tab, date_labels);
          final_datasets = make_chart_data(data_tab, date_labels, id_labels);
        }
        if(destruction == 1){ graphique.destroy();}
        contexte = document.getElementById('graphique').getContext('2d');
        contexte.canvas.width = screen.width / 2;
        graphique = new Chart(contexte, {
          type: kind_of_chart(),
          data:{
            labels:which_labels(id_labels, date_labels),
            datasets: final_datasets,
          },
          options:{
            responsive: false,
            plugins:{
              legend:{
               display: false
              },
              title:{
                display: true,
                text: set_title(),
                font:{
                  family: "Gabriola",
                  size: 35,
                  height: 2.5
                }
              }
            },
            scales:{
              y:{
                title:{
                  display: true,
                  text: "Taux de remplissage [%]",
                  color: "white",
                  font:{
                    size:18,
                    family: "Times"
                  }
                },
                min:0,
                max:100,
                grid:{
                  color: 'rgba(255, 255, 255, 0.4)'
                }
              },
              x:{
                title:{
                  display: true,
                  text: which_x_title(),
                  color: "white",
                  font:{
                    size:18,
                    family: "Times"
                  }
                },
                grid:{
                  display: false
                }
              }
            }
          }
        });
        destruction = 1;
      });
    },
    error: function(){alert("Erreur lors de la sélection de la ligne désirée. Problème d'AJAX.");}
  });
});
/********** LORSQUE L'UNE DES ENTRÉES DU MENU DÉROULANT EST MODIFIÉE **********/
$("#ligne_silo, #type_select").on("change", function(){
  // On prépare une requête AJAX et on prépare deux tableaux pour les étiquettes / labels du graphique
  var req = make_ajax_post();
  var id_labels = [], date_labels = [];
  // On envoie la requête AJAX vers le fichier PHP
  $.ajax({
    url: '/resultats.php',
    type: 'post',
    data: req,
    // Si la requête AJAX est un succès, alors on exécute le long bloc suivant, le but étant d'afficher le graphique
    success: function(response){
      // On affiche la table envoyée par le fichier PHP
      $("#silo_table").html(response);
      // On récupère les données depuis le fichier JSON, lui aussi modifié par le fichier PHP
      $.getJSON('data.json', function(data){
        /* On trie le contenu du fichier JSON pour récupérer en tableau les données débarrassées de la syntaxe JSON.
           Ensuite, on récupère dans deux tableaux différents (a) les identifiants de silos, (b) les hauteurs et (c) les dates auxquelles les mesures ont été prises.
           Puis, à partir des tableaux (a) et (c), on enlève les doublons des identifiants et des dates, tout en les triant dans un ordre alphabétique / numérique.
           Ils serviront pour l'affichage du graphique, comme données d'abscisse.
        */
        var tableau = json_filter(data);
        var l_id = from_JSON_get_ids(tableau);
        var l_dataset = from_JSON_get_heights(tableau);
        var l_date = from_JSON_get_dates(tableau);
        id_labels = filter(l_id).sort();
        date_labels = filter(l_date).sort();
        /*
          On fait un tableau 3 dimensions, dans lequel on rassemble les trois tableaux (a), (b) et (c).
          Ensuite, on trie le tableau en fonction de la colonne d'ordre de référence (selon les ID de silos ou selon les dates).
          On regroupe les différents éléments en fonction de leur appartenance à l'étiquette voulue. Exemple, si le graphique s'affiche selon les dates, on regroupe ensemble les hauteurs de la date A.
          A partir de ce tableau multidimensionnel, on crée un tableau final qui va être finalement utilisé pour le graphique.
        */
        var full_disorganised_array = triple_array(l_id, l_dataset, l_date);
        var tri_tab = sort_triple_array(full_disorganised_array, 2);
        var data_tab =[];
        var final_datasets =[];
        if($("#type_select").val() == "11"){
          data_tab = regroup_elements(tri_tab, id_labels);
          final_datasets = make_chart_data(data_tab, id_labels);
        }
        else{
          data_tab = regroup_elements(tri_tab, date_labels);
          final_datasets = make_chart_data(data_tab, date_labels, id_labels);
        }
        if(destruction == 1){ graphique.destroy();}
        contexte = document.getElementById('graphique').getContext('2d');
        contexte.canvas.width = screen.width / 2;
        graphique = new Chart(contexte, {
          type: kind_of_chart(),
          data:{
            labels:which_labels(id_labels, date_labels),
            datasets: final_datasets,
          },
          options:{
            responsive: false,
            plugins:{
              legend:{
               display: false
              },
              title:{
                display: true,
                text: set_title(),
                font:{
                  family: "Gabriola",
                  size: 35,
                  height: 2.5
                }
              }
            },
            scales:{
              y:{
                title:{
                  display: true,
                  text: "Taux de remplissage [%]",
                  color: "white",
                  font:{
                    size:18,
                    family: "Times"
                  }
                },
                min:0,
                max:100,
                grid:{
                  color: 'rgba(255, 255, 255, 0.4)'
                }
              },
              x:{
                title:{
                  display: true,
                  text: which_x_title(),
                  color: "white",
                  font:{
                    size:18,
                    family: "Times"
                  }
                },
                grid:{
                  display: false
                }
              }
            }
          }
        });
        destruction = 1;
      });
    },
    error: function(){alert("Erreur lors de la sélection de la ligne désirée. Problème d'AJAX.");}
  });
});
// Lorsqu'on clique sur une valeur du graphique inclue dans la table, la ligne de la valeur en question change de style CSS et passe à l'état hover
$("#graphique").click(function(evt){
  const element = graphique.getElementsAtEventForMode(evt, 'nearest',{intersect:true},true)[0].element.$context.parsed;
  const x = element.x, y = element.y;
  $.getJSON('data.json', function(data){
    var tableau = json_filter(data);
    var l_id = from_JSON_get_ids(tableau);
    var l_dataset = from_JSON_get_heights(tableau);
    var l_date = from_JSON_get_dates(tableau);
    id_labels = filter(l_id).sort();
    date_labels = filter(l_date).sort();
    var full_disorganised_array = triple_array(l_id, l_dataset, l_date);
    var tri_tab = sort_triple_array(full_disorganised_array, 2);
    if(($("#type_select").val() == "11")){
      const data_tab = regroup_elements(tri_tab, id_labels);
      var id_silo = data_tab.indexOf(String(y.toFixed(2)));
      $("#_"+id_silo).toggleClass("hovered");
    }
    else{
      const data_tab = regroup_elements(tri_tab, date_labels);
      var id_silo;
      for(var i=0; i<data_tab.length; ++i){
        if(data_tab[i].includes(String(y.toFixed(2)))){
          id_silo = i;
          break;
        }
      }
      for(i=0; i<$("#table tr").length; ++i){
        var str = String(y);
        str = str.substr(0, -1);
        if($("#S"+i).text() == id_labels[id_silo] && $("#r"+i).text().includes(str) && $("#d"+i).text() == date_labels[x]){
          $("#_"+i).toggleClass("hovered");
          break;
        }
      }
    }
  });
});
// Lorsque la souris bouge alors que le curseur est sur le graphique, on s'assure que l'état hover du CSS de la ligne du tableau concernée est cassé
$("#graphique").mousemove(function(){
  for(var i=0; i<$("#table tr").length; ++i){
    $("#_"+String(i)).removeClass("hovered");
  }
});
