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

file = 'https://raw.githubusercontent.com/kazdaghli/Visualisation-inequalities/master/Data/Preprocessed/Gini_afterFillNA.csv'

//Read the data
d3.csv(file, function(data) {

    // List of groups (here I have one group per column)
    var countries = ["USA", "FRA", "ARG"]
    
    // Reformat the data: we need an array of arrays of {x, y} tuples
    var parseTime = d3.timeParse("%y");
    var dataReady = countries.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.filter(function(k){return k.year > 1999 && k.year < 2016;}).map(function(d) {
          return {time: d.year, value: +d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
    console.log(dataReady)

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(countries)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var mindate = new Date("2000"),
        maxdate = new Date("2015");

    var x = d3.scaleTime()
      .domain([2000, 2015])
      .range([ 0, width ]);
    svgGraph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("dominant-baseline", "central")
      .call(d3.axisBottom(x));//.tickFormat(d3.timeFormat("%Y")

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [25,55])
      .range([ height, 0 ]);
      svgGraph.append("g")
      .call(d3.axisLeft(y));

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
        .attr("r", 5)
        .attr("stroke", "black")


    // Add a legend (interactive)
    svgGraph
      .selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time sery
        .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)
        .on("click", function(d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })
})