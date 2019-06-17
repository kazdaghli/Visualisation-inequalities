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


var worldmap_svg = d3.select('.map_container')
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("class",'map-svg')
            .append('g')
            .attr('class', 'map');

var selected_country = d3.select('.map_country_toolbox')
                        .append('div');

var list_selected_country = {};

var country_set = [];

var country_input = document.getElementById("countries-search");

// - MISC. - 

var map_attribute = 'Gini'

var graph_1_attribute = 'Gini'

var graph_2_attribute = 'Wealth'

var country_color = '#1E1E1E'


// ----- WORLD MAP -----
function draw_map(country_dataset) {

    var projection = d3.geoMercator()
        .fitExtent([[0,10],[map_container_w, map_container_h-10]], country_dataset)

    var path = d3.geoPath(projection);

    // ----  Country list of the search box ------
    d3.select('.datalist-countries')
        .selectAll("option")
        .data(country_dataset.features)
        .enter().append("option")
        .attr("value", function(d){return d.properties.name})
        ;

    // ---- Draw World map ----
    worldmap_svg.selectAll("path")
        .data(country_dataset.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class","country")
        .attr("id", function(d){return d.id})
        .on('mouseover', function(d){tip.show(d)})
        .on('mouseout', function (d){tip.hide(d)})
        .on('click', function (d){
            if (d.clicked) {
                d.clicked = false
                delete list_selected_country[d.id]
                console.log(list_selected_country); // For control only, to be deleted in final version
                update_list_selected_coutry();
                d3.select(this).style('fill',country_color);
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
        })
        .on('add-by-search', function (d){
            if (d.clicked == false || d.clicked == undefined){
                d.clicked=true;
                list_selected_country[ d.id ] = d.properties.name;
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
      worldmap_svg.call(tip);

      d3.json('/static/js/world-countries.json')
          .get((error,rows) => {
              country_set = rows
              draw_map(country_set);

          });
}

// ----- HELPER FUNCTIONS -----


// ----- INTERACTIONS -----

// - Reset countries button -

function reset_countries(){
      list_selected_country = {};
      update_list_selected_coutry();
      worldmap_svg.selectAll("path")
            .style('fill',country_color)
            .each(function (d) {
                  d.clicked = false;
            })
};

// - Map Attribute choice -

function set_map_attribute(attribute) {
      console.log(list_selected_country)
      map_attribute = attribute;
      worldmap_svg.selectAll("path")
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


// Event listener on country search box

country_input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("add-country").click();
  }
});

// Trigger function to add country
function add_country(){
    let obj = country_set.features.find(d=> d.properties.name == country_input.value);
    if (obj == undefined) {
        console.log('Wrong country'); // To ADD in the UI interface
    }
    else {
        document.getElementById(obj.id).dispatchEvent( new MouseEvent("add-by-search"));
    }
}


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
