var words = [];
var score = [];
var max = 0;
var divide = 1;
var counter;
var fill = d3.scale.category20();

function fetchJSON(words_value) {
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var targetUrl = 'https://api.datamuse.com/words?ml=' + words_value;
  words = [];
  score = [];
  max = 0;
  divide = 1;
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
      console.log(max);
      words.unshift(words_value);
      score.unshift(100000);
      counter = 0;
      var layout = d3.layout.cloud()
        .size([1200, 900])
        .words(words.map(function (d) {
            counter++;
            return { text: d, size: score[counter - 1] / divide };
          }))
        .padding(5)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", draw);
      layout.start();
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
          .style("font-size", function (d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function (d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) { return d.text; });
      }
      return data;
    })
    .catch(e => {
      console.log(e);
      return e;
    });
}

document.getElementById("button").addEventListener("click", function (event) {
  event.preventDefault();
  var bool_words = document.getElementById("words").checkValidity();
  if (bool_words) {
    document.getElementById("words").style.backgroundColor = "#ffffff";
  } else {
    document.getElementById("words").style.backgroundColor = "#fa8072";
  }
  if (bool_words) {
    document.getElementById("cloud").innerHTML = "";
    document.getElementById("cloud").innerHTML = "<img src=\"../images/ajax-loader.gif\">";
    var words_value = document.getElementById("words").value;
    words = [];
    fetchJSON(words_value);
    document.getElementById("words").value = "";
  }
  return false;
});
