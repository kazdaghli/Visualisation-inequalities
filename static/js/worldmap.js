// Set tooltips
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

var selected_country = d3.select('.map_country_toolbox_container')
                        .append('div');

var list_selected_country = {};
svg.call(tip);

d3.json('/static/js/world-countries.json')
    .get((error,rows) => {
        draw_map(rows);

    });

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
                d3.select(this).style('fill','#1E1E1E');
                delete list_selected_country[d.id]
                console.log(list_selected_country); // For control only, to be deleted in final version
                update_list_selected_coutry();
            }
            else {
                d.clicked=true;
                d3.select(this).style('fill','darkblue');
                list_selected_country[ d.id ] = d.properties.name;
                console.log(list_selected_country); // For control only, to be deleted in final version
                update_list_selected_coutry();
            }

        });
}

function update_list_selected_coutry(){

    selected_country.html(Object.values(list_selected_country));
    }
