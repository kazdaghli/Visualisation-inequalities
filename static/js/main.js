// ----- GLOBAL PARAMS -----

// - MAP -
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span class='details'>" + d.properties.name + "</span>";
            })


var map_container_w = d3.select('.map_container').node().getBoundingClientRect().width;
var map_container_h = d3.select('.map_container').node().getBoundingClientRect().height;


var svg = d3.select('.map_container')
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("class",'map-svg')
            .append('g')
            .attr('class', 'map');

var selected_country = d3.select('.map_country_toolbox')
                        .append('div');

var list_selected_country = {};

// - MISC. - 

var map_attribute = 'Gini'

var graph_1_attribute = 'Gini'

var graph_2_attribute = 'Wealth'


// ----- WORLD MAP -----
function draw_map(country_dataset) {

    var projection = d3.geoMercator()
        .fitExtent([[0,10],[map_container_w, map_container_h-10]], country_dataset)

    var path = d3.geoPath(projection);

    svg.selectAll("path")
        .data(country_dataset.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class","country")
        .on('mouseover', function(d){tip.show(d)})
        .on('mouseout', function (d){tip.hide(d)})
        .on('click', function (d){
            if (d.clicked) {
                d.clicked = false
                delete list_selected_country[d.id]
                console.log(list_selected_country); // For control only, to be deleted in final version
                update_list_selected_coutry();
                d3.select(this).style('fill','#1E1E1E');
            }
            else {
                d.clicked=true;
                list_selected_country[ d.id ] = d.properties.name;
                console.log(list_selected_country); // For control only, to be deleted in final version
                update_list_selected_coutry();
                // Gini
                if (map_attribute === 'Gini') {d3.select(this).style('fill','darkblue');}
                // Income
                else if (map_attribute === 'Income') {d3.select(this).style('fill','darkgreen');}
                // PIB
                else if (map_attribute === 'PIB') {d3.select(this).style('fill','darkred');}
            }
        });
}

function update_list_selected_coutry(){
    selected_country.html(Object.values(list_selected_country));
    }

function draw_worldmap() {
      svg.call(tip);

      d3.json('/static/js/world-countries.json')
          .get((error,rows) => {
              draw_map(rows);

          });
}

// ----- HELPER FUNCTIONS -----


// ----- INTERACTIONS -----

// - Reset countries button -

function reset_countries(){
      list_selected_country = {};
      update_list_selected_coutry();
      svg.selectAll("path")
            .style('fill','#1E1E1E')
      svg.selectAll("path")
            .each(function (d) {
                  d.clicked = false;
            })
};

// - Map Attribute choice -

function set_map_attribute(attribute) {
      console.log(list_selected_country)
      map_attribute = attribute;
      svg.selectAll("path")
            .each(function (d) {
                  if (d.id in list_selected_country) {
                        d.clicked = true;
                        // Gini
                        if (map_attribute === 'Gini') {d3.select(this).style('fill','darkblue');}
                        // Income
                        else if (map_attribute === 'Income') {d3.select(this).style('fill','darkgreen');}
                        // PIB
                        else if (map_attribute === 'PIB') {d3.select(this).style('fill','darkred');}

                  }
         })
};

// - Graph 1 Attribute choice -

function set_graph_1_attribute(attribute) {
      graph_1_attribute = attribute;    
};

// - Graph 2 Attribute choice -

function set_graph_2_attribute(attribute) {
      graph_2_attribute = attribute;    
};

// ----- MAIN -----

function main(){
      document.getElementById("map_" + map_attribute).checked = true;
      document.getElementById("graph_1_" + graph_1_attribute).checked = true;
      document.getElementById("graph_2_" + graph_2_attribute).checked = true;
      draw_worldmap();
};

main();
