// append the svg object to the body of the page
var margin = {top: 10, right: 100, bottom: 30, left: 40},
    width = d3.select('.graph_container').node().getBoundingClientRect().width  - margin.left - margin.right, //
    height = d3.select('.graph_container').node().getBoundingClientRect().height - margin.top - margin.bottom;//  

// append the svg object to the body of the page
var svgGraph = d3.selectAll("#graph_1")//
    .append('svg')
    .attr("width", width + margin.left + margin.right )
    .attr("height", height + margin.top + margin.bottom )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var countries =  []
var attribute_1 = 'Gini'
var parseDate = d3.timeParse("%Y")
var minYear = '2000',
    maxYear = '2016'
var counFlags = "/static/Data/Flags/countries.csv",
    imFlags =  "/static/Data/Flags/flags/",
    events = "/static/Data/Preprocessed/event.csv"

var tipEvent = d3.tip()
    .attr('class', 'd3-tipEvent')
    .style("z-index","-1")
    .offset([-tip_height_offset-60, 0])
    .html(function(d){
      var string = ''; 
      d.forEach(function(k){
        string = string + "<img src=" +  imFlags + k.flag + "/>" + "<strong>" + k.event +"</strong><br />"        
      })
      return string;     
    })

var tipDot = d3.tip()
    .attr('class', 'd3-tipDot')
        .style("z-index","-1")
    .offset([-tip_height_offset-60, 0])
    .html(function(d){
      return  "<strong>" + d.value +"</strong>"
    })
    
//let dataFlags = []
function draw_graph_lines(file, countries, x, y)
{
  svgGraph.call(tipDot)
  //Read the data
  d3.csv(file, function(data) {
    d3.csv(counFlags, function(dataFlags) {
  var dataReady = countries.map( function(grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.filter(function(k){return k.year >= minYear && k.year <= maxYear;}).map(function(d) {
        return {time: d.year, value: +d[grpName]};
      }),
      flag : dataFlags.filter(function(k){return k.code3 == grpName;})[0].im32
    };
  })
  
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
      .on("mouseover",  function(d) { return tipDot.show(d)})					
      .on("mouseout", function(d) { return tipDot.hide(d)})


  // Add a legend (interactive)
    svgGraph.selectAll("myLegend")//
    .data(dataReady)
    .enter()
      .append("image")
      .attr('class', 'picture')
      .attr('xlink:href', function(d) { 
            return imFlags + d.flag; 
      })
      .attr("transform", function(d, i) { return "translate(" + i*40  + ",5)"; }) 
      .attr("x", 50) // shift the text a bit more right
      .on("click", function(d){
        // is the element currently visible ?
        currentOpacity = d3.selectAll("." + d.name ).style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
      })
      .attr('width', 32)
      .attr('height', 32)

      svgGraph.selectAll("myLegend")//
    .data(dataReady)
    .enter()
      .append('g')
      .append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .text(function(d) { return d.name; })
      .style("fill", function(d){ return myColor(d.name) })
      .style("font-size", 10)
      .attr("transform", function(d, i) { return "translate(" + i*40  + ",3)"; }) 
      .attr("x", 50) // shift the text a bit more right
  })
})
}


function draw_graph(attribute, countries, year){
  if (attribute == 'Gini'){
    var file = 'https://raw.githubusercontent.com/kazdaghli/Visualisation-inequalities/master/Data/Preprocessed/Gini_afterFillNA.csv'
    var minValue = 25,
        maxValue = 70;  
  }
  else if (attribute == 'PP')
  {
    var file = 'static/Data/Preprocessed/Purchasing_power.csv'
    var minValue = 0,
        maxValue = 2; 
  }
  else if (attribute == 'GDP')
  {
    var file = 'static/Data/Preprocessed/PIB_afterFillNA.csv'
    var minValue = 100,
        maxValue = 30000000000000; 
  }
  else if (attribute == 'Investment freedom')
  {
    var file = 'static/Data/Preprocessed/investment freedom.csv'
    var minValue = 0,
        maxValue = 100; 
  }
  else if (attribute == 'Trade freedom')
  {
    var file = 'static/Data/Preprocessed/trade freedom.csv'
    var minValue = 0,
        maxValue = 100; 
  }
  else if (attribute == 'Government integrity')
  {
    var file = 'static/Data/Preprocessed/government integrity.csv'
    var minValue = 0,
        maxValue = 100; 
  }
  else if (attribute == 'Property rights')
  {
    var file = 'static/Data/Preprocessed/property rights.csv'
    var minValue = 0,
        maxValue = 100; 
  }

  var xx = d3.scaleTime()
            .domain([minYear, maxYear])
            .range([ margin.left, width ])

  var x = d3.scaleTime()
            .domain([parseDate(minYear), parseDate(maxYear)])
            .range([ margin.left, width])
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
          .attr("transform", "translate(" + margin.left + ",0 )")
          .style("dominant-baseline", "central")
          .call(d3.axisLeft(y));
  
  // text label for the y axis
  svgGraph.append("text")
          .attr("class", "yText") 
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left - 50)// - 5
          .attr("x", - (height / 2)  )//
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(attribute + " Value"); 

  if (countries.length > 0){
     draw_graph_lines(file, countries, xx, y)
     update_events(year, countries, xx, y)
  }
}


function update_graph_by_country(){
  countries = Object.keys(list_selected_country)
  svgGraph.selectAll("path").remove()
  svgGraph.selectAll("text").remove()
  svgGraph.selectAll("g").remove()
  svgGraph.selectAll("image").remove()
  svgGraph.selectAll("line").remove()
  svgGraph.selectAll("polygon").remove()
  draw_graph(attribute_1, countries, current_year)
}

function update_graph_by_year(){
  svgGraph.selectAll("path").remove()
  svgGraph.selectAll("text").remove()
  svgGraph.selectAll("g").remove()
  svgGraph.selectAll("image").remove()
  svgGraph.selectAll("line").remove()
  svgGraph.selectAll("polygon").remove()
  draw_graph(attribute_1, countries, current_year)
}

function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius)
{
   var results = "";

   var angle = Math.PI / arms;

   for (var i = 0; i < 2 * arms; i++)
   {
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? outerRadius : innerRadius;
      
      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0)
      {
         results = currX + "," + currY;
      }
      else
      {
         results += ", " + currX + "," + currY;
      }
   }
   return results;
}
function update_events(year, countries, x, y)
{
  d3.csv(events, function(data) {
    d3.csv(counFlags, function(dataFlags) {
  var dataEvents = data.filter( function(k) { // .map allows to do something for each element of the list
    return k.year == year &&  (countries.includes(k.country) || k.country == 'WRD')}).map(function(d) { //  d.country != 'WRD' &&
        return {
          year: d.year,
          event: d.event,
          flag:  dataFlags.filter(function(k){return  k.code3 == d.country;})[0].im32};//
    }) 
  svgGraph.call(tipEvent)
  svgGraph.append("line")
    .attr("x1", x(year))  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", x(year))  //<<== and here
    .attr("y2", height )//- margin.top - margin.bottom
    .style("stroke-width", 2)
    .style("stroke-dasharray", ("3, 3")) 
    .style("stroke", "red")
    .style("fill", "none");
    
  svgGraph.selectAll("star")
      .data(dataEvents)
      .enter()
      .append("svg:polygon")
      .attr("id", "star_1")
      .attr("visibility", "visible")
      .attr("points", CalculateStarPoints(x(year), 50, 5, 10, 5))
      .style("fill", "#FFFF00")
      .style("stroke", "black")
      .on("mouseover",  function(d) { return tipEvent.show(dataEvents)})					
    .on("mouseout", function(d) { return tipEvent.hide(dataEvents)})
  })
  }) 

 
}

function set_graph_1_attribute(new_attribute)
{
  attribute_1 = new_attribute
  svgGraph.selectAll("g").remove()//"yAxis"
  svgGraph.selectAll("text").remove()//["yText", "xText"]
  svgGraph.selectAll("path").remove()
  svgGraph.selectAll("image").remove()
  svgGraph.selectAll("line").remove()
  svgGraph.selectAll("polygon").remove()
  draw_graph(attribute_1, countries, current_year)
}
d3.csv(counFlags)
  .row(function(d) {
    return {
          code: d.code3,
          flag: d.im32
      }; 
  })
  .get((error, rows) => {
    // Handle error or set up visualisation here
    if (rows.length > 0){
        //The dataset
        dataFlags = rows
    }
  })


draw_graph(attribute_1, countries)