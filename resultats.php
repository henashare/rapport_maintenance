<?php
include('/portail/conn.php');
$liste_tables = ["ligne_0", "ligne_10", "ligne_20", "ligne_30", "ligne_40", "ligne_50", "ligne_100", "ligne_130"];
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

// On crée la connexion, ainsi que la variable de lecture de l'AJAX
$conn = new mysqli($servername, $username, $password, $database);
$ajax_post = file_get_contents('php://input');
//print_r($ajax_post);
$requetes = explode("&", $ajax_post);
$nb_req = count($requetes);
$ligne = 0;
$filtre = 11;
$a = 0;
$request;
$d_min = date("Y-m-d");
$d_max = date("Y-m-d");
if($nb_req == 2){
  $ligne = intval($requetes[0]);
  $filtre = intval($requetes[1]);
}
else if($nb_req == 4){
  $ligne = intval($requetes[0]);
  $filtre = intval($requetes[1]);
  $d_min = $requetes[2];
  $d_max = $requetes[3];
}

$tab_req = [
  "SELECT * FROM (SELECT * FROM {$liste_tables[$ligne]} ORDER BY date DESC LIMIT 30) t ORDER BY date ASC",
  "SELECT * FROM (SELECT id_silo, h_mm, MAX(date) FROM {$liste_tables[$ligne]} GROUP BY id_silo ORDER BY id_silo DESC) t ORDER BY id_silo ASC",
  "SELECT MIN(date) FROM {$liste_tables[$ligne]}",
  "SELECT * FROM (SELECT * FROM {$liste_tables[$ligne]} WHERE date BETWEEN '{$d_min} 00:00:00' AND '{$d_max} 23:59:59') t ORDER BY date ASC"
];

// On vérifie si la connexion s'est bien effectuée --> S'il y a une erreur, on l'affiche
if($conn->connect_error) die("ERREUR DE CONNEXION MYSQL : " . $conn->connect_error);

if($filtre == 12){
  $request = $tab_req[0];
}
else if($filtre == 11){
  $request = $tab_req[1];
}
else if($filtre == 13){
  $date_max = date("Y-m-d");
  $date_req = $tab_req[2];
  $date_min = $conn->query($date_req);
  $date_min = mysqli_fetch_array($date_min);
  $date_min = implode($date_min);
  $request = $tab_req[3];
  /*if($nb_req ==2)*/ echo "<form method='post'><label for='date_debut'>Date de début :</label><input type='date' id='date_debut' name='date_debut' max={$date_max} min={$date_min} selectMin=1 selectMax=2 value='{$date_max}'></input>";
  echo "<label for='date_fin'>Date de fin :</label><input type='date' id='date_fin' name='date_fin' max={$date_max} min={$date_min} value='{$date_max}'></input></form>";
  echo "<button id='date_select' onclick=trigger()>Valider sélection</button>";
  //else{}
}

if($result = $conn->query($request)){
  $ligne_x = str_replace("_", " ", $liste_tables[$ligne]);
  if($filtre==12){
    echo "<table id='table'><caption class='legende'>Liste des 30 dernières mesures sur la {$ligne_x}.</caption><thead><tr><td>N° silo :</td><td id='height_cell' onclick=change_height()>Hauteur :</td><td id='r_height_cell'>Hauteur relative :</td><td>Date de la mesure :</td></tr></thead><tbody>";
  }
  else if($filtre == 11){
    echo "<table id='table'><caption class='legende'>Dernière mesure pour chaque silo de la {$ligne_x}.</caption><thead><tr><td>N° silo :</td><td id='height_cell' onclick=change_height()>Hauteur :</td><td id='r_height_cell'>Hauteur relative :</td><td>Date de la mesure :</td></tr></thead><tbody>";
  }
  else if($filtre == 13){
    echo "<table id='table'><caption class='legende'>Mesures de la {$ligne_x} aux dates sélectionnées.</caption><thead><tr><td>N° silo :</td><td id='height_cell' onclick=change_height()>Hauteur :</td><td id='r_height_cell'>Hauteur relative :</td><td>Date de la mesure :</td></tr></thead><tbody>";
  }
  $json_tab = array();
  foreach($result as $entry){
    echo "<input hidden id='{$a}' value={$entry['h_mm']}></input>";
    if($ligne == 0){
      echo "<tr class='tab_line' id='_{$a}'><td id='S$a'>S0" . $entry["id_silo"] . "</td>";
    }
    else{
      echo "<tr class='tab_line' id='_{$a}')><td id='S{$a}'>S" . $entry["id_silo"] . "</td>";
    }
    echo "<td class='tab_line' id='h{$a}'>" . round(($entry["h_mm"]/1000), 2) . " m</td>";
    echo "<td class='tab_line' id='r{$a}'>" . round((($entry["h_mm"]/12000)*100), 2) . " %</td>";
    if($filtre==11){
      $str_date = substr($entry["MAX(date)"], 0, -3);
      $str_date = substr($str_date, 5);
      $str_date = str_replace("-", "/", $str_date);
      $str_month = substr($str_date, 0, 2);
      $str_day = substr($str_date, 3, 2);
      $str_date = str_replace($str_day, "*", $str_date);
      $str_date = str_replace($str_month, $str_day, $str_date);
      $str_date = str_replace("*", $str_month, $str_date);
      echo "<td class='tab_line' id='d{$a}'>" . $str_date . "</td></tr>";
    }
    else /*if($filtre==12)*/{
      $str_date = substr($entry["date"], 0, -3);
      $str_date = substr($str_date, 5);
      $str_date = str_replace("-", "/", $str_date);
      $str_month = substr($str_date, 0, 2);
      $str_day = substr($str_date, 3, 2);
      $str_date = str_replace($str_day, "*", $str_date);
      $str_date = str_replace($str_month, $str_day, $str_date);
      $str_date = str_replace("*", $str_month, $str_date);
      echo "<td class='tab_line' id='d{$a}'>" . $str_date . "</td></tr>";
    }
    $json_tab[] = $entry;
    $a += 1;
  }
  echo "</tbody></table>";
}

$json = json_encode($json_tab);
if(!file_put_contents('data.json', $json)){
  echo "Erreur de chargement des données. Problème au niveau de la création du fichier JSON.<br>";
}

$conn->close();
?>
