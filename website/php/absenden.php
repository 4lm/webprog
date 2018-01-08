<?php

$vorname = $_POST['vorname'];
$nachname = $_POST['nachname'];
$mail = $_POST['mail'];
$nachricht = $_POST['nachricht'];

$empfaenger = "caelus19@yahoo.de";
$absendername = "kontakt";
$absendermail = $mail;
$betreff = "Eine neue Nachticht vom Kontaktformular";
$text = "Eine neue Nachricht:

Name, Vorname: ".$nachname.", ".$vorname."
Mail: ".$mail."
Nachricht: ".$nachricht;

mail($empfaenger, $betreff, $text, "From: $absendername <$absendermail>");
echo('Danke für Ihre Nachricht!');
