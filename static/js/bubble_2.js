var tipBubble2 = d3.tip()
    .attr('class', 'd3-tipBubble2')
    .offset([-10, 0])
    .html(function(d){
			return "<img src=" +  imFlagsBubble + d.data.flag + "/>" + "<strong>" + d.data.name +"</strong> <span class='details'> "+
			"<br> Value: " + d.data.value 
			"</span>"
				})
var diameter = 600;
var color2 = d3.scaleOrdinal(d3.schemeCategory20);
var fileBubble2 = "/static/Data/Preprocessed/inf.csv"
var svgBubble2 = d3.select('#bubble_2')
		.append("svg")
		.style('transform', 'translate(0%, -10%)')
		.attr("width", diameter)
		.attr("height", diameter)

svgBubble2.append("text")
    .attr("x", 50)   
    .attr("y", 500 )
    .attr("dy", "3.5em" )
    .attr("text-anchor", "start")  
    .style("font-size", "24px")  
  	.style("font-weight", "bold")
    .text("Inflation By Consumer Price")

//var selected_year = '2000'
function update_bubble_2()
{
	svgBubble2.selectAll('g').remove()
	draw_bubble_2()
}

function draw_bubble_2()
{
d3.csv(fileBubble2, function(dataBubble) {
	d3.csv(counFlags, function(dataFlagsBubble) {
 //	
	var dataBubbleInf = dataBubble.filter( function(k) {
		return k.Year == current_year}).map(function(d){
			var liste = dataFlagsBubble.filter(function(k){return k.code3 == d['Country Code'];})
			var test = liste.length > 0
			return {
				year: d.Year,
				country: d['Country Code'],
				name: d['Country'],
				value: d.Inflation,
				flag:  test? liste[0].im32 : ''
			}
		})

	var root2 = d3.hierarchy({children: dataBubbleInf})
		.sum(function(d) { return d.value; })
	var bubble2 = d3.pack(dataBubbleInf)
		.size([diameter, diameter])
		.padding(1.5);
		
	svgBubble2.call(tipBubble2)

	var node2 = svgBubble2.selectAll(".node")
    .data(bubble2(root2).leaves())
    .enter().append("g")
      .attr("class", "node2")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.on("mouseover", function(d) {	
				d3.select(".d3-tipBubble2")
							.transition()
					.delay(1000)	
					.duration(500)
				tipBubble2.show(d)
			})
			.on("mouseout", function(d) {	
					
				tipBubble2.hide(d)	
				})

	node2.append("circle")
	.attr("r", function(d) {
		return d.r;
	})
	.style("fill", function(d,i) {
		return color2(i);
	})

	node2.append("text")
	.attr("dy", ".2em")
	.style("text-anchor", "middle")
	.text(function(d) {
		return d.data.country.substring(0, d.r / 3);
	})
	.attr("font-family", "sans-serif")
	.attr("font-size", function(d){
		return d.r/5;
	})
})
})
}

draw_bubble_2()



