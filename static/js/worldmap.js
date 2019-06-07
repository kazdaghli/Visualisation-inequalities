// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + d.population +"</span>";
            })

var margin = {top: 20, right: 20, bottom: 30, left: 30},
            width = 1200 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                    .scale(150)
                    .translate( [width / 2, height / 1.5]);

var path = d3.geoPath(projection)

queue()
    .defer(d3.json, "/static/js/world-countries.json")
    .await(ready);

function ready(error, countries){
    svg.selectAll("path")
      .data(countries.features)
      .enter().append("path")
      .attr("d", path);
}

//var projection = d3.geo.mercator()
//                   .scale(200)
//                   .translate( [width / 2, height / 1.5]);

//var path = d3.geo.path().projection(projection);

//svg.call(tip);

//queue()
//    .defer(d3.json, "world_countries.json")
//    .await(ready);
//
//function ready(error, data) {
//    var populationById = {};
//
//  population.forEach(function(d) { populationById[d.id] = +d.population; });
//
//
//  svg.append("g")
//      .attr("class", "countries")
//    .selectAll("path")
//      .data(data.features)
//    .enter().append("path")
//      .attr("d", path)
//      .style("fill", function(d) { return color(populationById[d.id]); })
//      .style('stroke', 'white')
//      .style('stroke-width', 1.5)
//      .style("opacity",0.8)
//      // tooltips
//        .style("stroke","white")
//        .style('stroke-width', 0.3)
//        .on('mouseover',function(d){
//          tip.show(d);
//
//          d3.select(this)
//            .style("opacity", 1)
//            .style("stroke","white")
//            .style("stroke-width",3);
//        })
//        .on('mouseout', function(d){
//          tip.hide(d);
//
//          d3.select(this)
//            .style("opacity", 0.8)
//            .style("stroke","white")
//            .style("stroke-width",0.3);
//        });
//
//  svg.append("path")
//      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
//       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
//      .attr("class", "names")
//      .attr("d", path);
//}