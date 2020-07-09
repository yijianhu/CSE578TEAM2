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







// // add the options to the button
// d3.select("#selectButton")
//     .selectAll('myOptions')
//     .data(allGroups)
//     .enter()
//     .append('option')
//     .text(function (d) { return d; }) // text showed in the menu
//     .attr("value", function (d) { return d; }); // corresponding value returned by the button



//Read the data
// data = [];
d3.csv("./data/checkin_example.csv",function(data) {
    // list of groups in the data

    let allGroups = d3.map(data, function(d){return(d.id)}).keys();
    console.log(allGroups);


    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroups)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }); // corresponding value returned by the button




    traffic(data, allGroups)
} );








function traffic(data, groups) {

    console.log("here");
    console.log(data);
    // for(var i=0; i<20; ++i){
    //     //   data.push({""})    // add data points for the last 20 parts maybe idk
    // }

    // initialize selected option
    let selectedOption = groups[0];


    // A color scale: one color for each group
    let myColor = d3.scaleOrdinal()
        .domain(groups)
        .range(d3.schemeSet2);






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
    var bisect = d3.bisector(function(d) {
        return d.x;
    }).left;

    // Add the line
    let line = svg
        .append("path")
        .datum(data.filter(function(d){return d.id===groups[0]}))
        .attr("fill", "none")
        .attr("stroke", function (d) {
            return myColor(groups[0])
        })
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
        );

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
        let i = bisect(data.filter(function(d){return d.id===selectedOption}), x0, 1);
        let selectedData = data.filter(function(d){return d.id===selectedOption})[i];
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
    function update(selectedGroup) {
        // Create new data with the selection?
        let dataFilter = data.filter(function(d){return d.id===selectedGroup});

        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return x(d.x) })
                .y(function(d) { return y(d.y) })
            )
            .attr("stroke", function (d) {
                return myColor(selectedGroup)
            })

    }
    d3.select("#selectButton").on("change", function (d) {
        // recover chosen option
        selectedOption = d3.select(this).property("value");
        //run update() using the selected option
        update(selectedOption);
    })

}



