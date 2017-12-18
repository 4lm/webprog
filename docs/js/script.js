var words = [];
var fill = d3.scale.category20();

function fetchJSON(words_value) {
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = 'https://api.datamuse.com/words?ml=' + words_value;
  fetch(proxyUrl + targetUrl)
    .then(blob => blob.json())
    .then(data => {
      for (i = 0; i < data.length; i++) {
        words[i] = data[i].word;
      }
      var layout = d3.layout.cloud()
        .size([600, 400])
        .words(words.map(function (d) {
            return { text: d, size: 10 + Math.random() * 25, test: "haha" };
          }))
        .padding(5)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", draw);
      layout.start();
      function draw(words) {
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

document.getElementById("button").addEventListener("click", function () {
  var bool_words = document.getElementById("words").checkValidity();
  if (bool_words) {
    document.getElementById("words").style.backgroundColor = "#ffffff";
  } else {
    document.getElementById("words").style.backgroundColor = "#fa8072";
  }
  if (bool_words) {
    var words_value = document.getElementById("words").value;
    document.getElementById("cloud").innerHTML = "";
    words = [];
    fetchJSON(words_value);
    document.getElementById("words").value = "";
  }
});
