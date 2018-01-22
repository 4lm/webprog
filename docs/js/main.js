function pruefung() {
    var form = document.forms[0];

    var fehler = "";

    if (form.elements.name.value == "") {
    	fehler = fehler + "Name\n";
    }
    if (form.elements.email.value == "") {
    	fehler = fehler + "E-Mail Adresse\n";
    }
    if (form.elements.mitteilung.value == "") {
    	fehler = fehler + "Nachricht\n";
    }

    if(fehler != "") {
        var fehlerText = "Sie haben folgende Felder nicht ausgefüllt: \n";
        fehlerText = fehlerText + fehler;
        window.alert(fehlerText);
        return false;
    }


 	var neuerEintrag = document.createElement("div");
 	neuerEintrag.className = "eintrag";
 	neuerEintrag.innerHTML = '<div class="leftCollumn2">'
        + '<p>Name: ' + form.elements.name.value + '</br>'
        + 'Homepage: ' + form.elements.homepage.value + '</br>'
        + '<button class="btn btn-error" onclick="eintragLoeschen(this)">Löschen</button></p>'
        + '</div>'
        + '<div class="rightCollumn2">'
        + '<p>' + form.elements.mitteilung.value.replace(/\n/g, '</br>\n') + '</p>'
        + '</div>'
        + '<div style="clear:both"></div>';

    document.getElementsByClassName("eintraege")[0].insertBefore(neuerEintrag,document.getElementsByClassName("eintraege")[0].firstChild);

    return false;
}

function eintragLoeschen(e) {
    e.parentElement.parentElement.parentElement.remove();
}
