// Global var for remembering if word cloud has been drawn
var isWordCloudDrawn = false;

// Function fetches JSON from datamuse-API, gets all user arguments and draws SVG element
function fetchJsonAndDraw(words_value, keyword, capitalize, max_words, orientations, padding, font, color_scheme, canvas_format, bg_color) {

    // Use of proxy server to add CORS to original API response
    words_value = words_value.toLowerCase(); // Lowercase keywords
    var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    var targetUrl = "https://api.datamuse.com/words?ml=" + words_value;
    var words = []; // Array of words list
    var score = []; // Array of score of word list
    var max = 0; // Variable for holding the max score value
    var divide = 1; // Divide factor, initiated with the value 1
    var counter = -1;
    var layout;
    var fill;

    // Choose color scheme
    switch (parseInt(color_scheme)) {
        case 1:
            fill = d3.scale.category10();
            break;
        case 2:
            fill = d3.scale.category20();
            break;
        case 3:
            fill = d3.scale.category20b();
            break;
        case 4:
            fill = d3.scale.category20c();
            break;
        default:
            fill = d3.scale.category10();
    }

    // Fetch from API witch Fetch-API
    fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                words[i] = data[i].word;
                score[i] = data[i].score;
                if (data[i].score > max) {
                    max = data[i].score;
                }
            }
            // Normalize word weighting
            divide = max / 100;
            if (keyword == "true") {
                words.unshift(words_value);
                score.unshift(100000);
            }

            // Capitalize words if true
            if (capitalize == "true") {
                for (i = 0; i < words.length; i++) {
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
            }

            // Define max words
            words = words.slice(0, parseInt(max_words));
            score = score.slice(0, parseInt(max_words));

            // Define layout
            if (orientations == 5) {
                layout = d3.layout.cloud()
                    .size(canvas_format)
                    .words(words.map(function (word) {
                        counter++;
                        return { text: word, size: score[counter] / divide };
                    }))
                    .font(font)
                    .fontSize(d => d.size)
                    .padding(parseInt(padding))
                    .on("end", draw);
            } else {
                layout = d3.layout.cloud()
                    .size(canvas_format)
                    .words(words.map(function (word) {
                        counter++;
                        return { text: word, size: score[counter] / divide };
                    }))
                    .font(font)
                    .fontSize(d => d.size)
                    .padding(parseInt(padding))
                    .rotate(() => {
                        var angle = 0;
                        switch (parseInt(orientations)) {
                            case 1:
                                // angle is 0
                                break;
                            case 2:
                                angle = ~~(Math.random() * 2) * 90;
                                break;
                            case 3:
                                angle = (~~(Math.random() * 2) + ~~(Math.random() * 2)) * 45;
                                break;
                            case 4:
                                angle = (~~(Math.random() * 2) + ~~(Math.random() * 2) + ~~(Math.random() * 2)) * 45;
                                break;
                            default:
                            // angle is 0
                        }
                        return angle;
                    })
                    .on("end", draw);
            }

            layout.start();

            // d3 draw function, which is called at the end of d3-cloud layout declaration
            function draw(words) {
                document.getElementById("cloud").innerHTML = "";

                d3.select("#cloud")
                    .append("svg")
                    .attr("viewBox", "0, 0, " + layout.size()[0] + ", " + layout.size()[1]);

                d3.select("svg")
                    .append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", bg_color);

                d3.select("svg")
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-family", font)
                    .style("fill", (d, i) => fill(i))
                    .attr("text-anchor", "middle")
                    .style("font-size", d => (d.size) + "px")
                    .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                    .text(d => d.text);
            }
            return data;
        })
        .catch(e => {
            console.log(e);
            return e;
        });

    // State that word cloud is/will be drawn
    isWordCloudDrawn = true;

    // Display download buttons
    document.getElementById("download-svg").style.display = "inline";
    document.getElementById("download-png").style.display = "inline";
}

// Download SVG function
function downloadSVG() {
    var words_value = document.getElementById("words").value;
    var svg = document.getElementsByTagName("svg")[0];
    function svgDataURL(svg) {
        var svgAsXML = (new XMLSerializer).serializeToString(svg);
        return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
    }
    var dataURL = svgDataURL(svg);
    var dl = document.createElement("a");
    document.body.appendChild(dl);
    dl.setAttribute("href", dataURL);
    dl.setAttribute("download", words_value + ".svg");
    dl.click();
}

// Download SVG function, calls saveSvgAsPng-js-lib
function downloadPNG() {
    var words_value = document.getElementById("words").value;
    saveSvgAsPng(document.getElementsByTagName("svg")[0], words_value + ".png");
}

// function that checks requirements & calls the fetchJsonAndDraw function with paramater attributes
function callFetchJsonAndDraw() {
    var bool_words = document.getElementById("words").checkValidity();
    if (bool_words) {
        document.getElementById("words").style.backgroundColor = "#ffffff";
    } else {
        document.getElementById("words").style.backgroundColor = "#fa8072";
    }
    if (bool_words) {
        document.getElementById("cloud").innerHTML = "";
        document.getElementById("cloud").innerHTML = "<img src=\"images/ajax-loader.gif\">";

        var words_value = document.getElementById("words").value;
        var keyword = document.querySelector("input[name=\"keyword\"]:checked").value;
        var capitalize = document.querySelector("input[name=\"capitalize\"]:checked").value;
        var max_words = document.getElementById("max_words").value;
        var orientations = document.querySelector("input[name=\"orientations\"]:checked").value;
        var padding = document.getElementById("padding").value;
        var font = document.querySelector("input[name=\"fonts\"]:checked").value;
        var color_scheme = document.getElementById("color_scheme").value;
        var canvas_format = [document.getElementById("w").value, document.getElementById("h").value];
        var bg_color = $("#bg-color").spectrum("get").toHexString();
        fetchJsonAndDraw(words_value, keyword, capitalize, max_words, orientations, padding, font, color_scheme, canvas_format, bg_color);
    }
}

// Eventlistener for submit button
document.getElementById("submitButton").addEventListener("click", function (e) {
    e.preventDefault();
    callFetchJsonAndDraw();
    return false;
});

// Eventlistener for value change in controll panel
document.getElementById("create_word_cloud").addEventListener("change", function () {
    if (isWordCloudDrawn == true)
        callFetchJsonAndDraw();
});

// On change listener of keyword include
$("input[name=keyword]").change(function () {
    callFetchJsonAndDraw();
});

// On change listener of orientations
$("input[name=orientations]").change(function () {
    callFetchJsonAndDraw();
});

// On change listener of font choice
$("input[name=fonts]").change(function () {
    callFetchJsonAndDraw();
});

// On change listener of first letter capitalization choice
$("input[name=capitalize]").change(function () {
    callFetchJsonAndDraw();
});

// On change listener of color picker
$("#bg-color").change(function () {
    callFetchJsonAndDraw();
});

// Eventlistener for download SVG button
document.getElementById("download-svg").addEventListener("click", function (e) {
    e.preventDefault();
    var bool_words = document.getElementById("words").checkValidity();
    if (bool_words) {
        document.getElementById("words").style.backgroundColor = "#ffffff";
    } else {
        document.getElementById("words").style.backgroundColor = "#fa8072";
    }
    if (bool_words) {
        downloadSVG();
    }
    return false;
});

// Eventlistener for download PNG button
document.getElementById("download-png").addEventListener("click", function (e) {
    e.preventDefault();
    var bool_words = document.getElementById("words").checkValidity();
    if (bool_words) {
        document.getElementById("words").style.backgroundColor = "#ffffff";
    } else {
        document.getElementById("words").style.backgroundColor = "#fa8072";
    }
    if (bool_words) {
        downloadPNG();
    }
    return false;
});

// Function for page scrolling to anchor
$(function () {
    $(".page-scroll a").click(function (event) {
        var anchor = $(this);
        $("html, body").stop().animate({
            scrollTop: $(anchor.attr("href")).offset().top - 50
        },
            1500,
            "linear"
        );
        event.preventDefault();
    });
});

// Submit form function
$("#frmContact").submit(function () {
    var formControl = true;

    var frmGrpVorname = $("#vorname");
    var frmGrpNachname = $("#nachname");
    var frmGrpMail = $("#mail");
    var frmGrpNachricht = $("#nachricht");

    frmGrpVorname.removeClass("is-invalid");
    frmGrpNachname.removeClass("is-invalid");
    frmGrpMail.removeClass("is-invalid");
    frmGrpNachricht.removeClass("is-invalid");

    var vorname = $("#vorname").val();
    var nachname = $("#nachname").val();
    var mail = $("#mail").val();
    var nachricht = $("#nachricht").val();

    if (vorname == "") {
        formControl = false;
        frmGrpVorname.addClass("is-invalid");
    }

    if (nachname == "") {
        formControl = false;
        frmGrpNachname.addClass("is-invalid");
    }

    if (mail == "") {
        formControl = false;
        frmGrpMail.addClass("is-invalid");
    }

    if (nachricht == "") {
        formControl = false;
        frmGrpNachricht.addClass("is-invalid");
    }

    if (formControl) {
        $.ajax({
            type: "POST",
            url: "https://formspree.io/7262de68-ae33-4758-b3a3-1283c824f2a6@michaltsis.net",
            data: { vorname: vorname, nachname: nachname, mail: mail, nachricht: nachricht }
        }).done(function (message) {
            var erfolgsmeldung = $("#erfolgsmeldung");
            erfolgsmeldung.html(message);
            erfolgsmeldung.addClass("alert");
            erfolgsmeldung.addClass("alert-success");
        });

    }

    return false;
});

// Init spectrum color picker
$("#bg-color").spectrum({
    preferredFormat: "rgb",
    showInput: true,
    showPalette: true,
    color: "white",
    palette: [
        ["black", "white", "grey", "red", "orange"],
        ["yellow", "green", "cyan", "blue", "violet"]
    ]
});
