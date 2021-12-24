function doesFileExist(urlToFile) {
  var req = new XMLHttpRequest();
  req.open('HEAD', urlToFile, false);
  req.send();     
  if (req.status == "404") return false;
  else return true;
}

$(document).keypress(function(e){
  if(doesFileExist("date.txt")){
      $.get('date.txt', function(last_date_mes){
        if(e.key == "?") alert("La dernière mesure a été lancée le "+last_date_mes+".\n\nRaccourcis:\nAlt + L => Vers le lancement de mesures.\nAlt + R => Vers les analyses et résultats des mesures effectuées.");
      });
  }
  else alert("La dernière mesure a été lancée le [PAS DE DATE].\n\nRaccourcis:\nAlt + L => Vers le lancement de mesures.\nAlt + R => Vers les analyses et résultats des mesures effectuées.");
  
});

$("button").click(function(){
  var id = $(this).val();
  if(doesFileExist("temp.txt") && (id == "mesures")){
    if(doesFileExist("date.txt") && doesFileExist("nb_silos.txt")){
      var date = "";
      $.get('date.txt', function(date_mes){
          date = date_mes;
      });
      $.get('nb_silos.txt', function(data){
          if(data == "1") alert("Une prise de mesures est actuellement en cours sur "+data+" silo. La page qui suit affiche une vue du silo en cours de mesure. Tant que la mesure est en cours, aucune sélection ni envoi ne sont possibles.\n\nVous ne pourrez relancer de mesure que lorsque la mesure sera terminée (environ 10 minutes après le lancement).\n\nLa dernière mesure a été lancée le "+date+"\n\nSi le bouton d'envoi n'est pas réactive 10 minutes après l'heure indiquée ci-avant, il y a un problème. Dans ce cas, contactez le personnel de maintenance.");
          else if(data == "63") alert("Une prise de mesures est actuellement en cours sur tous les silos. La page qui suit affiche une vue des silos en cours de mesure. Tant que la esure est en cours, aucune sélection ni envoi ne sont possibles.\n\nVous ne pourrez relancer de mesure que lorsque la mesure sera terminée (environ 10 minutes après le lancement).\n\nLa dernière mesure a été lancée le "+date+"\n\nSi le bouton d'envoi n'est pas réactive 10 minutes après l'heure indiquée ci-avant, il y a un problème. Dans ce cas, contactez le personnel de maintenance.");
          else alert("Une prise de mesures est actuellement en cours sur "+data+" silos. La page qui suit affiche une vue des silos en cours de mesure. Tant que la mesure est en cours, aucune sélection ni envoi ne sont possibles.\n\nVous ne pourrez relancer de mesure que lorsque la mesure sera terminée (environ 10 minutes après le lancement).\n\nLa dernière mesure a été lancée le "+date+"\n\nSi le bouton d'envoi n'est pas réactive 10 minutes après l'heure indiquée ci-avant, il y a un problème. Dans ce cas, contactez le personnel de maintenance.");
      });
    }
    else{
        alert("!!! AVERTIR LA MAINTENANCE !!!\nUne prise de mesures est actuellement en cours sur un ou plusieurs silos. Néanmoins, des fichiers sont manquants sur le serveur.\n\nLa page qui suit affiche une vue du silo en cours de mesure. Tant que la mesure est en cours, aucune sélection ni envoi ne sont possibles.\n\nVous ne pourrez relancer de mesure que lorsque la mesure sera terminée (environ 10 minutes après le lancement).\n\nSi le bouton d'envoi n'est pas réactive 10 minutes après l'heure indiquée ci-avant, il y a un problème. Dans ce cas, contactez le personnel de maintenance.");
    }
  }
});
