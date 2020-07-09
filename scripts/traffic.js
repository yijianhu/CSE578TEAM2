// set the dimensions and margins of the graph
var margin = {top: 40, right: 350, bottom: 60, left: 350},
    width = 1960 -margin.left -margin.right,
    height = 700 -margin.top -margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".content")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


//Read the data
data = [];
d3.csv("./data/checkin_example.csv",function(d) {traffic(d)} );








function traffic(data) {

    console.log("here");
    console.log(data);
    // for(var i=0; i<20; ++i){
    //     //   data.push({""})    // add data points for the last 20 parts maybe idk
    // }










    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain([1,120])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 13])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function(d) { return d.x; }).left;

    // Create the circle that travels along the curve of chart
    var focus = svg
        .append('g')
        .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0);

    // Create the text that travels along the curve of chart
    var focusText = svg
        .append('g')
        .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");

    // Add the line
    svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
        );

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);


    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
        focus.style("opacity", 1);
        focusText.style("opacity",1)
    }

    function mousemove() {
        // recover coordinate we need
        let x0 = x.invert(d3.mouse(this)[0]);
        let i = bisect(data, x0, 1);
        let selectedData = data[i];
        focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y));
        focusText
            .html("x:" + selectedData.x + "  -  " + "y:" + selectedData.y)
            .attr("x", x(selectedData.x)+15)
            .attr("y", y(selectedData.y))
    }
    function mouseout() {
        focus.style("opacity", 0);
        focusText.style("opacity", 0)
    }

}



