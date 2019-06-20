
var slider_container_w = d3.select('.map_year_slider_container').node().getBoundingClientRect().width;
var slider_container_h = d3.select('.map_year_slider_container').node().getBoundingClientRect().height;

var dataTime = d3.range(0, 15).map(function(d) {
    return new Date(2000 + d, 10, 3);
  });

console.log("h: " + slider_container_h)
console.log("w: " + slider_container_w)
var slider = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(slider_container_w - 50)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(2000, 10, 3))
    .displayValue(false)
    // .fill('black')
    .on('onchange', val => {
      current_year = val.getFullYear();
      update_graph_by_year();
      Array.from(document.getElementsByClassName("country")).forEach(function(d){d.dispatchEvent(change_year_event)});
    });

d3.select('#slider')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .append('g')
    .attr('transform', 'translate(10,5)')
    .call(slider);
