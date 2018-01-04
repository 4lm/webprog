var fill = d3.scale.category20(); // color scheme 

function fetchJSONandDraw(words_value, keyword, capitalize) {
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
      if (capitalize == "true") {
        for (i = 0; i < words.length; i++) {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
      }

      // Define layout
      var layout = d3.layout.cloud()
        .size([1200, 900])
        .words(words.map(function (word) {
            counter++;
            return { text: word, size: score[counter] / divide };
          }))
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
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
          .style("font-family", "Impact")
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

    words = [];
    fetchJSONandDraw(words_value, keyword, capitalize);
    document.getElementById("words").value = "";
  }
});
