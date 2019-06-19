// append the svg object to the body of the page
var margin = {top: 10, right: 100, bottom: 30, left: 40},
    width = d3.select('.graph_container').node().getBoundingClientRect().width  - margin.left - margin.right, //
    height = d3.select('.graph_container').node().getBoundingClientRect().height - margin.top - margin.bottom;//  
console.log('width', width)
console.log('height', height)

// append the svg object to the body of the page
var svgGraph = d3.selectAll("#graph_1")//
    .append('svg')
    .attr("width", width + margin.left + margin.right )
    .attr("height", height + margin.top + margin.bottom )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var countries =  []
var attribute = 'Gini'
var parseDate = d3.timeParse("%Y")
var minYear = '2000',
    maxYear = '2015'

function draw_graph_lines(file, countries, x, y)
{
  //Read the data
  d3.csv(file, function(data) {
  
  var dataReady = countries.map( function(grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.filter(function(k){return k.year >= minYear && k.year <= maxYear;}).map(function(d) {
        return {time: d.year, value: +d[grpName]};
      })
    };
  });

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeSet2);//

  // Add the lines
  var line = d3.line()
    .x(function(d) { return x(+d.time) })
    .y(function(d) { return y(+d.value) })
    svgGraph.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.name })
      .attr("d", function(d){ return line(d.values) } )
      .attr("stroke", function(d){ return myColor(d.name) })
      .style("stroke-width", 4)
      .style("fill", "none")

  // Add the points
  svgGraph
    // First we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .enter()
      .append('g')
      .style("fill", function(d){ return myColor(d.name) })
      .attr("class", function(d){ return d.name })
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(function(d){ return d.values })
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.time) } )
      .attr("cy", function(d) { return y(d.value) } )
      .attr("r", 3)
      .attr("stroke", "black")


  // Add a legend (interactive)
  svgGraph
    .selectAll("myLegend")
    .data(dataReady)
    .enter()
      .append('g')
      .append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time sery
      //.attr("transform", function(d, i) { return "translate(" + x(d.value.time)  + "," + y(d.value.value ) + ")"; }) // Put the text at the position of the last point
      .attr("transform", function(d, i) { return "translate(" + i*40  + ",5)"; }) 
      .attr("x", 12) // shift the text a bit more right
        .text(function(d) { return d.name; })
        .style("fill", function(d){ return myColor(d.name) })
        .style("font-size", 10)
      .on("click", function(d){
        // is the element currently visible ?
        currentOpacity = d3.selectAll("." + d.name).style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

      })

svgGraph.append("line")
      .attr("x1", x("2001"))  //<<== change your code here
      .attr("y1", 0)
      .attr("x2", x("2001"))  //<<== and here
      .attr("y2", height )//- margin.top - margin.bottom
      .style("stroke-width", 2)
      .style("stroke", "red")
      .style("fill", "none");
  })
}
var counFlags = "https://gist.githubusercontent.com/espinielli/5107491/raw/world-country-flags.tsv",
var imFlags =  ""
function draw_graph(attribute, countries){
  if (attribute == 'Gini'){
    var file = 'https://raw.githubusercontent.com/kazdaghli/Visualisation-inequalities/master/Data/Preprocessed/Gini_afterFillNA.csv'
    var minValue = 25,
        maxValue = 65;  
  }
  else if (attribute == 'Wealth')
  {
    var minValue = 2500,
        maxValue = 5500; 
  }
  var xx = d3.scaleTime()
            .domain([minYear, maxYear])
            .range([ 0, width ])

  var x = d3.scaleTime()
            .domain([parseDate(minYear), parseDate(maxYear)])
            .range([ 0, width ])
  svgGraph.append('g')
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .style("dominant-baseline", "central")
          .call(d3.axisBottom(x));

  svgGraph.append("text")  
          .attr("class", "xText")           
          .attr("transform", "translate(" + (width/2) + " ," + 
                               (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("Year");

  var y = d3.scaleLinear()
            .domain( [minValue,maxValue])
            .range([ height, 0 ]);
  svgGraph.append('g')
          .attr("class", "yAxis")
          .call(d3.axisLeft(y));
  
  // text label for the y axis
  svgGraph.append("text")
          .attr("class", "yText") 
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(attribute + " Value"); 

  if (countries.length > 0){
     draw_graph_lines(file, countries, xx, y)
  }
}

function update_graph_by_country(){
  console.log(Object.keys(list_selected_country))
  countries = Object.keys(list_selected_country)
  svgGraph.selectAll("path").remove()
  svgGraph.selectAll("g").remove()
  draw_graph(attribute, countries)

}

/*function update_graph_by_attribute()
{

}*/

function set_graph_1_attribute(attribute)
{
  attribute = attribute
  svgGraph.selectAll("g").remove("yAxis")
  svgGraph.selectAll("text").remove(["yText", "xText"])
  svgGraph.selectAll("path").remove()
  draw_graph(attribute, countries)
}
draw_graph(attribute, countries)