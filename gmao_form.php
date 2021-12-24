<?php
include_once 'portail/conn.php';
include_once 'portail/session.php';
session_start();
if(is_admin()){
    $conn = new mysqli($servername, $username, $password, $database);
    if($conn->connect_error) die("ERREUR DE CONNEXION MYSQL : " . $conn->connect_error);
    $regularity = $conn->real_escape_string(htmlspecialchars($_POST["regularity"]));
    $echeance = $conn->real_escape_string(htmlspecialchars($_POST["echeance"]));
    $every = $conn->real_escape_string(htmlspecialchars($_POST["every"]));
    $toa = $conn->real_escape_string(htmlspecialchars($_POST["toa"]));
    $alter_subj = $conn->real_escape_string(htmlspecialchars($_POST["alter_subj"]));
    $alter_desc = $conn->real_escape_string(htmlspecialchars($_POST["alter_desc"]));
    $random = rand(-32760, 32760);
    if(empty($echeance)) $echeance = date("y-m-d");
    if(intval($toa) < 99){
        $req = "INSERT INTO gmao(regularity, echeance, every, toa, random) VALUES($regularity, '$echeance', $every, $toa, $random)";
    }
    else if(intval($toa) == 99 && !empty($alter_subj) && !empty($alter_desc)){
        $req = "INSERT INTO gmao(regularity, echeance, every, toa, alter_subj, alter_desc, random) VALUES($regularity, '$echeance', $every, $toa, '$alter_subj', '$alter_desc', $random)";
    }
    else if(empty($regularity) || empty($every) || empty($toa)) header("Location: /err.html");
    else header("Location: /err.html");
    $conn->query($req);
    header("Location: /main_page.php");
}
else header("Location: /main_page.php");
?>