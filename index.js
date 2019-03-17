let svg= d3.select('svg');
const width=+svg.attr('width');
const height=+svg.attr('height');
const tooltip = d3.select('body')
	.append('div')
	.attr('id', 'tooltip');
svg
	.attr('width', width)
	.attr('height', height);
	
Promise
	.all([d3.json('https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json')])
  	.then(([data]) => {
		console.log(data);
		colorScale = d3.scaleOrdinal()
			.domain([-1,1])
			.range(["RGB(0,60 100)", "RGB(255,255,200)", "RGB(0,120,90)", "RGB(0,120,240)", "RGB(120,80,10)", "RGB(240,0,80)", "RGB(100,60,120)", "RGB(100,120,120)", "RGB(100,180,180)", "RGB(240,180,180)", "RGB(240,0,240)", "RGB(80,80,80)", "RGB(170,100,0)", "RGB(40,90,180)", "RGB(240,250,10)", "RGB(170,12,210)", "RGB(40,80,250)", "RGB(250,130,120)", "RGB(250,100,100)", "RGB(20,60,100)", "RGB(70,100,140)", "RGB(60,180,200)"]);
			
			let root = d3.hierarchy(data)
				.sum((d) => (d.value));
				
			let treemapLayout = d3.treemap()	
				.size([width, height])
				.paddingInner(1);
				
			treemapLayout(root);

			let cell = svg
    				.selectAll("g")
				.data(root.leaves())
    				.enter()
				.append("g")
				.on("mouseover", (d) => {
					tooltip
						.attr('data-value', d.value)
						.html("Name: "+d.data.name+"<br/>Category: "+d.data.category+"<br/>Value: "+d.value)
						.style('pointer-events', 'none')
						.style('left', d3.event.pageX +"px")
          					.style('top', d3.event.pageY+ "px")
						.style('opacity', 0.9)
						.attr('width', 250);
				})
     				.on("mouseout", (d) => {
					tooltip
						.style('opacity', 0);
				});
			
			cell.append('rect')
				.attr("transform", function(d) {  return "translate(" + d.x0 + "," + d.y0 + ")"; })
      				.attr("class", "tile")
				.attr("width", function(d) { return d.x1 - d.x0; })
      				.attr("height", function(d) { return d.y1 - d.y0; })
				.attr("data-name", (d)=>d.data.name)
				.attr("data-category", (d)=>d.data.category)
				.attr("data-value", function(d) { return d.value; })
				.style("fill", function(d) { return colorScale(d.data.category); });

			cell.append('text')
				.attr("transform", function(d) {  return "translate(" + d.x0 + "," + d.y0 + ")"; })
				.selectAll('tspan')
          			.data(d => {console.log(d.data.name.split(/\s(?!-)/g)); return d.data.name.split(" ");})	//
          			.enter()
          			.append('tspan')
				.attr('x', 4)
          			.attr('y', (d, i) => 15 + 12*i)
          			.text(d => d)

			let legendValues = ["Product Design", "Tabletop Games", "Video Games", "Technology", "Hardware", "Sound", "Gaming Hardware", "Narrative Film", "3D Printing", "Television", "Web", "Wearables", "Food", "Games", "Sculpture", "Apparel", "Art", "Gadgets", "Drinks"];
			
 			// create a colorLegend (a colour key for the categories above)
			let svg2 = d3.select("#legend-div")
    				.append("svg")
    				.attr("width", width)
    				.attr("height", height);

			let legendInterval=150;	// horizontal space between key items
			let legendYOffset=0;	// start at zero and add 1 every row moved down
			let legend = svg2.selectAll('#legend')
				.data(legendValues)
				.enter().append('g')
        			.attr("id", "legend")
        			.attr("transform", function (d, i) {
					if (i%3==0) legendYOffset+=1;
					return "translate("+(i%3)*legendInterval+", "+legendYOffset*50+")"
       				});    
				
			legend.append('rect')
					.attr("class", "legend-item")
        				.attr('x', 0)
					.attr('y', 0)
        				.attr('width', 20)
        				.attr('height', 20)
					.attr("fill", (d, i) => colorScale(d));
			legend.append('text')
					.attr('x', 24)
					.attr('y', 14)
					.style("font-size", "12")
					.text((d, i) => legendValues[i]);
	});













	
