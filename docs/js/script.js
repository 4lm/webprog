function fetchJSONandDraw(words_value, keyword, capitalize, max_words, orientations, padding, font, color_scheme, canvas_format) {

  switch (parseInt(color_scheme)) {
    case 1:
      var fill = d3.scale.category10();
      break;
    case 2:
      var fill = d3.scale.category20();
      break;
    case 3:
      var fill = d3.scale.category20b();
      break;
    case 4:
      var fill = d3.scale.category20c();
      break;
    default:
      var fill = d3.scale.category10();
  }

  switch (parseInt(canvas_format)) {
    case 1:
      var canvas = [1200, 900];
      break;
    case 2:
      var canvas = [1200, 675];
      break;
    case 3:
      var canvas = [1200, 1200];
      break;
    case 4:
      var canvas = [1200, 600];
      break;
    default:
      var canvas = [1200, 900];
  }

  words_value = words_value.toLowerCase();
  // Use of proxy server to add CORS to original API response
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var targetUrl = 'https://api.datamuse.com/words?ml=' + words_value;
  var words = []; // Array of words list
  var score = []; // Array of score of word list
  var max = 0; // Variable for holding the max score value
  var divide = 1; // Divide factor, initiated with the value 1
  var counter = -1;
  // Fetch from API
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
      divide = max / 100;
      if (keyword == "true") {
        words.unshift(words_value);
        score.unshift(100000);
      }
      console.log("Keyword: " + words[0]);
      console.log("Max score: " + max);
      console.log("Include keyword: " + keyword);
      console.log("Max words: " + max_words);
      console.log("Font: " + font);

      if (capitalize == "true") {
        for (i = 0; i < words.length; i++) {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
      }
      
      words = words.slice(0, parseInt(max_words));
      score = score.slice(0, parseInt(max_words));
      // Define layout
      var layout = d3.layout.cloud()
        .size(canvas)
        .words(words.map(function (word) {
          counter++;
          return { text: word, size: score[counter] / divide };
        }))
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
        .font(font)
        .fontSize(d => d.size)
        .on("end", draw);

      layout.start();
      // Draw
      function draw(words) {
        document.getElementById("cloud").innerHTML = "";
        d3.select("#cloud").append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", d => d.size + "px")
          .style("font-family", font)
          .style("font-weight", "bold")
          .style("fill", (d, i) => fill(i))
          .attr("text-anchor", "middle")
          .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
          .text(d => d.text);
      }
      return data;
    })
    .catch(e => {
      console.log(e);
      return e;
    });
}

document.getElementById("button").addEventListener("click", function () {
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
    var keyword = document.querySelector('input[name="keyword"]:checked').value;
    var capitalize = document.querySelector('input[name="capitalize"]:checked').value;
    var max_words = document.getElementById("max_words").value;
    var orientations = document.querySelector('input[name="orientations"]:checked').value;
    var padding = document.getElementById("padding").value;
    var font = document.getElementById("font").value;
    var color_scheme = document.getElementById("color_scheme").value;
    var canvas_format = document.getElementById("canvas_format").value;
    words = [];
    fetchJSONandDraw(words_value, keyword, capitalize, max_words, orientations, padding, font, color_scheme, canvas_format);
  }
});
