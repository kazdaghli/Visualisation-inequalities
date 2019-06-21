// ----- GLOBAL PARAMS -----

// - MAP -
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {return "<strong>" + d.properties.name +"</strong> <span class='details'> "+
                                      "<br> Year: " + d.year +
                                      "<br> Gini: " + d.gini +
                                      "<br> Pib : " + d.pib +
                                      "</span>";})

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
var gini_dataset = {};
var pib_dataset = {};
var income_dataset = {} ;
var current_year = 2000 ;
var current_attribute = "Gini"
var country_input = document.getElementById("countries-search");

function gini_gradient_color(t){return d3.interpolateOranges(t)};
function pib_gradient_color(t){return d3.interpolateReds(t)};
function income_gradient_color(t){return d3.interpolateGreens(t)};

function attr_gradient_color(t){
    if(map_attribute == 'Gini'){
        return gini_gradient_color(t);
    } else if(map_attribute =='PIB'){
        return pib_gradient_color(t);
    } else if (map_attribute =='Income'){
        return income_gradient_color(t);
    }
}

var change_year_event = new Event("change-year");
var color_na = 'black'

// - MISC. - 

var map_attribute = 'Gini'

var graph_1_attribute = 'Gini'

var graph_2_attribute = 'Wealth'

var country_color = '#1E1E1E'

var limit_selectable_country = 5;

// ML 19/06
function get_attr_color(date, country_code){
    let init_date = 1960;
    if (current_attribute == "Gini"){
        val = gini_dataset[date-init_date][country_code]
        if (val == undefined){
            return color_na;
        }else {
        t = gr_gini(val);
        return gini_gradient_color(t);
        }
    } else if (current_attribute == "PIB") {
        val = pib_dataset[date-init_date][country_code]
        if(val == undefined){
            return color_na
        }else {
        t = gr_pib(val);
        return pib_gradient_color(t);
        }
    } else if (current_attribute == "Income") {
        val = income_dataset[date-init_date][country_code]
        if(val == undefined){
            return color_na
        }else {
        t = gr_income(val);
        return income_gradient_color(t);
        }
     }
}

function get_gini_value(date, country_code){
        let init_date = 1960;
        return gini_dataset[date-init_date][country_code];
}
function get_pib_value(date, country_code){
        let init_date = 1960;
        return pib_dataset[date-init_date][country_code];
}




// ----- WORLD MAP -----
function draw_map_2d(country_dataset) {
    var projection = d3.geoMercator()
        .fitExtent([[0,10],[map_container_w, map_container_h-10]], country_dataset)

    var path = d3.geoPath(projection);

    // --- Gradient Color definition ------
    // GINI
     gr_gini = d3.scaleLinear()
		        .domain([21,63])
			    .range([0,1])

     gr_pib = d3.scaleLinear()
            .domain([8824448,1371564453640])
            .range([0,1])

    gr_income = d3.scaleLinear()
             .domain([0,1])
//            .domain([50,90500])
            .range([0,1])

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
        .attr("year", function(d){d.year = current_year;return current_year})
        .attr("gini", function(d){d.gini = get_gini_value(current_year,d.id); return get_gini_value(current_year,d.id)})
        .attr("pib", function(d){d.pib = get_pib_value(current_year,d.id); return get_pib_value(current_year,d.id)})
        .attr("fill", function(d){return get_attr_color(current_year,d.id)})
        .style("stroke-width", function(d){
            if(d.clicked){
                return "3"
            }else{
                return ''
            }
        })
        .on('mouseover', function(d){tip.show(d)})
        .on('mouseout', function (d){tip.hide(d)})
        .on('click', function (d){
            if (d.clicked) {remove_country_in_worldmap(d, this);}
            else {add_country_in_worldmap(d, this);}
            })
        .on('add-by-search', function (d){if (d.clicked == false || d.clicked == undefined){add_country_in_worldmap(d, this);}})
        .on("remove-by-tag", function(d){if(d.clicked){remove_country_in_worldmap(d, this);}})
        .on('change-year', function(d) {
            d.year = current_year;
            d.gini = get_gini_value(current_year,d.id);
            d.pib  = get_pib_value(current_year,d.id);
            d3.select(this)
              .attr("fill", function(d){return get_attr_color(current_year,d.id)});
           });
    set_map_attribute_legend();
}


function draw_map_3d(country_dataset) {

    var projection = d3.geoOrthographic()
            .scale(map_container_w/3)
            .translate([map_container_w / 2, map_container_h / 2])
            .clipAngle(90) // without this options countries on the other side are visible
            .precision(.1)
            .rotate([0,0,0]);

    var path = d3.geoPath()
            .projection(projection);

    world_svg = d3.select('.map')

    const graticule = d3.geoGraticule();

    world_svg.append("circle")
		.attr("class", "water")
		.attr("cx", map_container_w/2)
		.attr("cy", map_container_h/2)
		.attr("r", map_container_w/3)
		.style('fill','#809ebc');

    world_svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path)
    .attr("fill","#809ebc");


    // --- Gradient Color definition ------
    // GINI
     gr_gini = d3.scaleLinear()
		        .domain([21,63])
			    .range([0,1])

     gr_pib = d3.scaleLinear()
            .domain([8824448,1371564453640])
            .range([0,1])

     gr_income = d3.scaleLinear()
            .domain([50,90500])
            .range([0,1])

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
        .attr("year", function(d){d.year = current_year;return current_year})
        .attr("gini", function(d){d.gini = get_gini_value(current_year,d.id); return get_gini_value(current_year,d.id)})
        .attr("pib", function(d){d.pib = get_pib_value(current_year,d.id); return get_pib_value(current_year,d.id)})
        .attr("fill", function(d){return get_attr_color(current_year,d.id)})
        .style("stroke-width", function(d){
            if(d.clicked){
                return "3"
            }else{
                return ''
            }
        })
        .on('mouseover', function(d){tip.show(d)})
        .on('mouseout', function (d){tip.hide(d)})
        .on('click', function (d){
            if (d.clicked) {remove_country_in_worldmap(d, this);}
            else {add_country_in_worldmap(d, this);}
            })
        .on('add-by-search', function (d){if (d.clicked == false || d.clicked == undefined){add_country_in_worldmap(d, this);}})
        .on("remove-by-tag", function(d){if(d.clicked){remove_country_in_worldmap(d, this);}})
        .on('change-year', function(d) {
            d.year = current_year;
            d.gini = get_gini_value(current_year,d.id);
            d.pib  = get_pib_value(current_year,d.id);
            d3.select(this)
              .attr("fill", function(d){return get_attr_color(current_year,d.id)});
           });

     const λ = d3.scaleLinear()
    .domain([0, map_container_w])
    .range([-180, 180]);

    const φ = d3.scaleLinear()
    .domain([0, map_container_h])
    .range([90, -90]);

    var drag = d3.drag().subject(function() {
    var r = projection.rotate();
    return {
        x: λ.invert(r[0]),
        y: φ.invert(r[1])
    };
    }).on("drag", function() {
        projection.rotate([λ(d3.event.x), φ(d3.event.y)]);

        worldmap_svg.selectAll(".graticule")
            .datum(graticule)
            .attr("d", path);

        worldmap_svg.selectAll(".country")
            .attr("d", path);

        worldmap_svg.style("fill", "#809ebc")
    });

worldmap_svg.call(drag);
set_map_attribute_legend();
}

function draw_worldmap() {
      worldmap_svg.call(tip);

      d3.queue()
            .defer(d3.json, "/static/js/world-countries.json" )
            .defer(d3.csv, '/static/Data/Preprocessed/Gini_afterFillNA.csv' )
            .defer(d3.csv, '/static/Data/Preprocessed/PIB_afterFillNA.csv')
//            .defer(d3.csv, '/static/Data/Preprocessed/Income_converted_AfterFillNA.csv')
            .defer(d3.csv, '/static/Data/Preprocessed/Purchasing_power.csv')
            .await(function(error, map_data,gini_data, pib_data,income_data){
                if (error){
                    console.error("Issue while loading the data")
                }else{
                    country_set = map_data;
                    gini_dataset = gini_data;
                    pib_dataset = pib_data;
                    income_dataset = income_data;
                    draw_map_2d(country_set);
                }
            })
}

function change_view(view_type){
    worldmap_svg.selectAll('*').remove();
    d3.select('.map').on('mousedown.drag', null);
    if(view_type == '2D'){
        console.log("Triggered 2d");
        console.log(country_set);
        draw_map_2d(country_set);
    }else{
    console.log("Triggered 3d");
    console.log(country_set);
        draw_map_3d(country_set);
    }
}


// ----- HELPER FUNCTIONS -----


// ----- INTERACTIONS -----

// - Add / Remove country in worldmap

function add_country_in_worldmap(d, dom){
    if(Object.keys(list_selected_country).length < limit_selectable_country){
    d.clicked=true;
    list_selected_country[d.id] = d.properties.name
    update_selected_country_box();
    update_graph_by_country();
    d3.select(dom)
        .style("stroke-width","3")
//        .style("stroke","black")
//        .style("filter", "drop-shadow(3px 3px 4px black)")
    }else{console.log("Limit  country reached");}  // Add to the UI
}

function remove_country_in_worldmap(d, dom){
    d.clicked = false
    console.log("remove by tag process started")
    delete list_selected_country[d.id]
    update_selected_country_box();
    update_graph_by_country();
    d3.select(dom)
        .style("stroke-width","0.5")
//        .style("filter", "")
        .attr('fill',function(d){return get_attr_color(current_year,d.id)});
}


// - update countries from the tag country
function update_selected_country_box(){

    box = d3.select('.selected_country_box')
                .selectAll("a");

    //  Remove the tag of country  that have been deleted from the list_selected_country
    box.each(function(){
        if(Object.values(list_selected_country).includes(this.textContent) == false){
            console.log(list_selected_country)
            console.log('remove tag ' + this.textContent);
            d3.select(this)
            .transition().duration(700)
            .style("font-size","0pt")
            .remove();
        }

    });

    box.data(Object.values(list_selected_country)).enter()
    .append('a')
        .attr('href','#')
        .attr('class','badge badge-primary')
    .style("font-size", '0pt')
    .on('click', function(d){
        let obj = country_set.features.find(r=> r.properties.name == d);
        if (obj == undefined) {
            console.log('Wrong country'); // To ADD in the UI interface
        }
        else {
            document.getElementById(obj.id).dispatchEvent( new MouseEvent("remove-by-tag"));
            d3.select(this)
                .transition().duration(200)
                .style("font-size","0pt")
                .remove();
        }
    })
    .transition().duration(500)
    .style("font-size", '10pt')
    .text(function(d){return d});

}

// - Reset countries button -

function reset_countries(){
      list_selected_country = {};
      update_selected_country_box();
      update_graph_by_country();
      worldmap_svg.selectAll("path")
                   .style("stroke-width","0.5")
//                .style("filter", "")
                 .each(function (d) {
                  d.clicked = false;
                  })
};

// - Map Attribute choice -

function set_map_attribute(attribute) {
      map_attribute = attribute;
      current_attribute = map_attribute;
      set_map_attribute_legend();
      Array.from(document.getElementsByClassName("country")).forEach(function(d){d.dispatchEvent(change_year_event)});
};



function set_map_attribute_legend(){


    d3.select('.legend_attribute')
        .selectAll('*')
        .remove();

    leg = d3.select('.legend_attribute')
        .append("svg");

    var leg_defs = leg.append("defs")
          .append("svg:linearGradient")
          .attr("id", "gr_attr")
          .attr("x1", "100%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "100%");

    leg_defs.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", attr_gradient_color(0))
      .attr("stop-opacity", 1);

    leg_defs.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", attr_gradient_color(1))
      .attr("stop-opacity", 1);

    leg.append("rect")
      .attr("width", '70%')
      .attr("height", '100%')
      .style("fill", "url(#gr_attr)")
      // .attr("transform", "translate(0,10)")
       .attr('stroke','black')
        // .attr('stroke-width',1);

}


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
