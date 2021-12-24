<?php
include_once 'portail/session.php';
session_start();
if(is_admin()){
    echo '
    <!doctype html>
    <html lang="fr">
    <head>
    <meta charset = "utf-8">
    <title>Formulaire GMAO</title>
    <link rel="stylesheet" href="normalize.css">
    <link rel="stylesheet" href="gmao.css">
    <link rel="icon" type="image/png" href="iconERQZ.png">
    <script src="jquery.min.js"></script>
    </head>
    <body>
        <div class="bandeau"><h1>Formulaire GMAO</h1></div>
            <form action="gmao_form.php" id="gmao_form" method="post">
                <div class="form_container">
                    <div>
                        <input type="radio" id="repeat" name="regularity" value="1">
                            <label for="repeat">Prévoir cette mesure à échéances régulières.</label>
                    </div>
                    <div>
                        <input type="radio" id="norepeat" name="regularity" value="0" checked>
                            <label for="norepeat">Cette mesure sera exéctuée une seule fois à la date prévue.</label>
                    </div>
                    <div><input type="date" id="echeance" name="echeance"></div>
                    <div>Si l'. "'".'échéance régulière est prévue, la mesure sera exécutée 
                        <select id="every" name="every">
                            <option value="1" selected>tous les ans</option>
                            <option value="2">tous les 9 mois</option>
                            <option value="3">tous les 6 mois</option>
                            <option value="4">tous les 3 mois</option>
                            <option value="5">tous les mois</option>
                            <option value="6">toutes les semaines</option>
                        </select> à partir de la date renseignée.
                    </div>
                    <div>
                        Type de mesure à mettre en place :<br>
                        <div>
                            <input type="radio" id="ana_therm" name="toa" value="0">
                            <label for="ana_therm">Analyse à la caméra thermique.</label>
                        </div>
                        <div>
                            <input type="radio" id="ana_vib" name="toa" value="1">
                            <label for="ana_vib">Analyse vibratoire.</label>
                        </div>
                        <div>
                            <input type="radio" id="ana_alter" name="toa" value="99" checked>
                            <label for="ana_alter">Autre.</label>
                        </div>
                        <div>
                            <label for="alter_subj">Sujet de la mesure autre (30 caractères max) : </label>
                            <input type="text" id="alter_subj" name="alter_subj" size="30" maxlength="30">
                        </div>
                        <div>
                            <label for="alter_desc">Description de la mesure autre (255 caractères max) : </label><br>
                            <textarea id="alter_desc" name="alter_desc" rows="6" cols="50" maxlength="255"></textarea>
                        </div>
                    </div>
                    <div><input type="submit" value="Envoyer"></div>
                </div>
            </form>
            <div class="logo">
                <a href="https://www.euroquartz.be/?lang=fr" target="_blank"><img src="logo_euroquartz.png" alt="Euroquartz S.A."></a>
            </div>
    </body>
    </html>
    ';
    }
    else header("Location: /main_page.php");
?>