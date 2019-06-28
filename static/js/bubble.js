var imFlagsBubble =  "/static/Data/Flags/flags/"
var tipBubble = d3.tip()
    .attr('class', 'd3-tipBubble')
	.offset([-tip_height_offset+10, 0])
    .html(function(d){
		return "<img src=" +  imFlagsBubble + d.data.flag + "/>" + "<strong>" + d.data.name +"</strong> <span class='details'> "+
		"<br> Value: " + d.data.value +
		"</span>"
	    })
var diameter = 600;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var fileBubble = "/static/Data/Preprocessed/unemp.csv"
var svgBubble = d3.select('#bubble_1')
		.append("svg")
		.style('transform', 'translate(0%, 10%)')
		.attr("width", diameter)
		.attr("height", diameter)

svgBubble.append("text")
    .attr("x", 50)   
    .attr("y", 500 )
    .attr("dy", "3.5em" )
    .attr("text-anchor", "start")  
    .style("font-size", "24px")  
  	.style("font-weight", "bold")

dataBubble_set = []
dataFlagsBubble_set = []

function update_bubble()
{
    var dataBubbleunEmp = dataBubble_set.filter( function(k) {
    return  (k.Year).toString() == current_year  }).map(function(d){
        var liste = dataFlagsBubble_set.filter(function(k){return k.code3 == d['Country Code'];})
        var test = liste.length > 0 //
        var sel = countries.includes(d['Country Code'] )
        return {
            year: d.Year,
            country: d['Country Code'],
            name: d['Country Name'],
            value: d['Unemp'],
            flag:  test? liste[0].im32 : '',
            selected : sel ? true : false
        };
    })

    var root = d3.hierarchy({children: dataBubbleunEmp})
                .sum(function(d) { return d.value; })

    var bubble = d3.pack(dataBubbleunEmp)
            .size([diameter, diameter])
            .padding(1.5);

    var node = svgBubble.selectAll(".node")
                .data(bubble(root).leaves());

    fontscale = d3.scaleLinear()
                    .domain(d3.extent(bubble(root).leaves(), function(d){return d.r}))
                    .range([0.2,0.9])

    node.transition()
        .duration(1500)
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .select('circle')
        .attr("r", function(d) {return d.r;})
        .style("fill", function(d,i) {
        if (countries.length > 0) {
		    if (d.data.selected == true) {
			    return '#DC143C';
		    }
		    else {
			    return color(i);
		    }
		}
		else{
		    return color(i);
		}
	})
	.attr("opacity", function(d) {
		if (countries.length > 0){
		    if (d.data.selected == true) {
			    return 1;
		    }
		    else {
			    return 0.2;
		    }
		} else {
		    return 1;
		}
	});

    node.select("text")
         .transition()
        .duration(1500)
        .attr("font-size", function(d){return fontscale(d.r) + "em"});

}
var countries = Object.keys(list_selected_country)
function draw_bubble()
{
d3.csv(fileBubble, function(dataBubble) {
	d3.csv(counFlags, function(dataFlagsBubble) {
	dataBubble_set = dataBubble;
	dataFlagsBubble_set = dataFlagsBubble;
	var dataBubbleunEmp = dataBubble.filter( function(k) {		

		return  (k.Year).toString() == current_year  }).map(function(d){
			var liste = dataFlagsBubble.filter(function(k){return k.code3 == d['Country Code'];})
			var test = liste.length > 0 //
			var sel = countries.includes(d['Country Code'] )	
			return {
				year: d.Year,
				country: d['Country Code'],
				name: d['Country Name'],
				value: d['Unemp'],
				flag:  test? liste[0].im32 : '',
				selected : sel ? true : false
			};
		})

	var root = d3.hierarchy({children: dataBubbleunEmp})
		.sum(function(d) { return d.value; })
	var bubble = d3.pack(dataBubbleunEmp)
		.size([diameter, diameter])
		.padding(1.5);
		
	svgBubble.call(tipBubble)

	var node = svgBubble.selectAll(".node")
    .data(bubble(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	  .on("mouseover", function(d) {	
		d3.select(".d3-tipBubble")
          .transition()
		  .delay(1000)	
		  .duration(500)
		tipBubble.show(d)
	})
	.on("mouseout", function(d) {	
			
		tipBubble.hide(d)	
	  })

    fontscale = d3.scaleLinear()
                .domain(d3.extent(bubble(root).leaves(), function(d){return d.r}))
                .range([0.2,0.9])

	node.append("circle")
	.attr("r", function(d) {
		return d.r;
	})
	.style("fill", function(d,i) {
		if (countries.length > 0)
		{
		if (d.data.selected == true)
		{
			return '#DC143C';
		}
		else
		{
			return color(i);
		}
		}
		else{
		return color(i);
		}
	})
	.attr("opacity", function(d) {
		if (countries.length > 0)
		{
		if (d.data.selected == true)
		{
			return 1;
		}
		else
		{
			return 0.2;
		}
		}
	})

	    svgBubble.selectAll("circle")
            .attr("opacity",1);

	node.append("text")
	.attr("dy", ".2em")
	.style("text-anchor", "middle")
	.text(function(d) {	return d.data.country.substring(0, d.r / 3);
	})
	.attr("font-family", "sans-serif")
	.attr("font-size", function(d){
		return fontscale(d.r) + "em";
	})
})
})
}

draw_bubble()



