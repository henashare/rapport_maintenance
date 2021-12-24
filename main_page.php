<?php 
    include_once 'portail/session.php';
    session_start();
    if(is_logged()){
        echo "
        <!doctype html>
        <html lang='fr'>
        <head>
          <meta charset = 'utf-8'>
          <title>Menu principal</title>
          <link rel='stylesheet' href='normalize.css'>
          <link rel='stylesheet' href='main_page.css'>
          <link rel='icon' type='image/png' href='iconERQZ.png'>
          <script src='jquery.min.js'></script>
        </head>
        <body>
        ";
        echo "
        <div class='bandeau'><h1>Menu principal</h1></div>
        <div class='logo'>
            <a href='https://www.euroquartz.be/?lang=fr' target='_blank'><img src='logo_euroquartz.png' alt='Euroquartz S.A.'></a>
        </div>
        <div class='flex_container'>
            <div><a href='/accueil_sg.html'><button>SiloGestion</button></a></div>
            <div><a href='/gmao.php'><button";
            if(!is_admin()) echo " hidden";
            echo ">Maintenance<br>des systèmes</button></a></div>
            <div><a href='/tasks.php'><button>Liste des<br>tâches</button></a></div>
        </div>
        ";
        echo "</body>
        </html>";
    }
    else header("Location: index.html");
?>