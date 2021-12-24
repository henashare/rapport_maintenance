<?php
    include_once('portail/session.php');
    include_once('portail/conn.php');
    session_start();
    if(is_logged()){
        $conn = new mysqli($servername, $username, $password, $database);
        if($conn->connect_error) die("ERREUR DE CONNEXION MYSQL : " . $conn->connect_error);
        $req = "SELECT * FROM gmao WHERE echeance >= DATE(NOW()) ORDER BY echeance ASC";
        $results = $conn->query($req);
        $req = "DELETE FROM gmao WHERE echeance < DATE(NOW())";
        $conn->query($req);
        echo '
        <!doctype html>
        <html lang="fr">
        <head>
            <meta charset = "utf-8">
            <title>Liste des tâches</title>
            <link rel="stylesheet" href="normalize.css">
            <link rel="stylesheet" href="tasks.css">
            <link rel="icon" type="image/png" href="iconERQZ.png">
            <script src="jquery.min.js"></script>
        </head>
        <body>
            <div class="bandeau"><h1>Liste des tâches à faire sur les silos :</h1></div>
            <div class="flex_container">
            <table id="tasks_table">
                <thead>
                    <tr>
                        <th id="type">Type de tâche :</th>
                        <th id="date">Date :</th>
                        <th id="repeat">Répétitivité :</th>
                        <th id="name">Intitulé :</th>
                        <th id="desc">Description :</th>
                    </tr>
                </thead>
                <tbody>';
            foreach($results as $task){
                //print_r($task);
                echo '<tr id=' . $task["index_"] . '>';
                if($task["regularity"] == "1") echo '<td>Tâche chronique</td>';
                else if($task["regularity"] == "0") echo '<td>Tâche unique</td>';
                else echo '<td>'. $task["regularity"] . '</td>';
                echo '<td>' . $task["echeance"] . '</td>';
                if($task["regularity"] == "0") echo '<td> / </td>';
                else if($task["every"] == "1") echo '<td>Chaque année</td>';
                else if($task["every"] == "2") echo '<td>Tous les 9 mois</td>';
                else if($task["every"] == "3") echo '<td>Tous les 6 mois</td>';
                else if($task["every"] == "4") echo '<td>Tous les 3 mois</td>';
                else if($task["every"] == "5") echo '<td>Chaque mois</td>';
                else if($task["every"] == "6") echo '<td>Chaque semaine</td>';
                else echo '<td>' . $task["every"] . '</td>';
                if($task["toa"] == "0") echo '<td>Analyse caméra thermique</td>';
                else if($task["toa"] == "1") echo '<td>Analyse vibratoire</td>';
                else if($task["toa"] == "99") echo '<td>' . $task["alter_subj"] . '</td>';
                else echo '<td>' . $task["toa"] . '</td>';
                if($task["toa"] == "0") echo '<td>On vérifie l\'état des connexions (si un fil est desserré, il va chauffer), on vérifie les composants (surchauffe éventuelle), etc.</td>';
                else if($task["toa"] == "1") echo '<td>On regarde les vibrations au niveau des moteurs qui sont aux tamiseurs et au niveau juste en-dessous.</td>';
                else echo '<td>' . $task["alter_desc"] . '</td>';
                echo '</tr>';
            }
            echo '
                </tbody>
            </table>
            </div>
            <div class="logo">
                <a href="https://www.euroquartz.be/?lang=fr" target="_blank"><img src="logo_euroquartz.png" alt="Euroquartz S.A."></a>
            </div>
        </body>
        <script src="tasks.js"></script>
        </html>';
    }
    //else if(is_logged()){}
    else header("Location: /err.php");
?>