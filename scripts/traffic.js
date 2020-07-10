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


let dataset = 0;
let x = 0;
let y = 0;
let line = 0;
let myColor = 0;
let selectedOption = 0;
let yAxis = 0;

//Read the data
// data = [];
d3.csv("./data/checkin_combined.csv",function(data) {
    // list of groups in the data

    let allGroups = d3.map(data.filter(function(d){return d.State===currentState}), function(d){return(d.BusinessName)}).keys();

    console.log(allGroups);
    dataset = data;


    updateBusinessSelector(data);




    traffic(data, allGroups);
} );


function updateBusinessSelector() {

    let stateGroups = d3.map(dataset.filter(function(d){return d.State===currentState}), function(d){return(d.BusinessName)}).keys();

    // console.log("asdfasdf")
    // console.log(d3.select("#selectButton")
    //     .selectAll('option'));

    d3.select("#selectButton")
        .selectAll('option')
        .remove();

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(stateGroups)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }); // corresponding value returned by the button
}



function update(selectedGroup) {
    // console.log(currentState);
    // Create new data with the selection?
    let dataFilter = dataset.filter(function(d){return d.BusinessName===selectedGroup});

    y.domain([0, Math.max(d3.max(dataFilter, function(d) { return +d.Count;  }), 10) ]);
    yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
            .x(function(d) { return x(d.TimeStamp) })
            .y(function(d) { return y(d.Count) })
        )
        .attr("stroke", function (d) {
            return myColor(selectedGroup)
        });

    // console.log("max", Math.max(d3.max(dataFilter, function(d) { return +d.Count;  }), 10));
    // console.log(dataFilter);


}



function traffic(data, groups) {

    console.log("here");
    console.log(data);
    // for(var i=0; i<20; ++i){
    //     //   data.push({""})    // add data points for the last 20 parts maybe idk
    // }

    // initialize selected option
    selectedOption = d3.select(this).property("value");


    // A color scale: one color for each group
    myColor = d3.scaleOrdinal()
        .domain(groups)
        .range(d3.schemeSet2);






    let tickNames = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                     "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
    // Add X axis
    x = d3.scaleLinear()
        .domain([0,23])
        // .ticks(d3.timeHour.every(3), "%I %p")
        .range([ 0, width ]);


    // axis(d3.scaleTime())
    //     .ticks(d3.timeHour.every(1), "%I %p")
    //     .render();
        // .ticks(24);
        // .tickFormat(function (d) {
        //     return tickNames[d];
        // });
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(24)
            .tickFormat(function (d) {
                return tickNames[d];
            })
        );

    // Add Y axis
    y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0 ]);
    yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function(d) {
        return d.TimeStamp;
    }).left;

    // Add the line
    line = svg
        .append("path")
        .datum(data.filter(function(d){return d.BusinessName===groups[0]}))
        .attr("fill", "none")
        .attr("stroke", function (d) {
            return myColor(groups[0])
        })
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(function(d) { return x(d.TimeStamp) })
            .y(function(d) { return y(d.Count) })
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
        if(selectedOption) {
            console.log("mouseover", selectedOption);
            focus.style("opacity", 1);
            focusText.style("opacity", 1)
        }
    }

    function mousemove() {
        // recover coordinate we need
        // selectedOption = d3.select(this).options[0].text;
        let x0 = x.invert(d3.mouse(this)[0]);
        let i = bisect(data.filter(function(d){return d.BusinessName===selectedOption}), x0, 1);
        let selectedData = data.filter(function(d){return d.BusinessName===selectedOption})[i];
        // console.log("error?", selectedOption);
        if(selectedData) {
            focus
                .attr("cx", x(selectedData.TimeStamp))
                .attr("cy", y(selectedData.Count));
            focusText
                .html(tickNames[selectedData.TimeStamp] + "  -  " + "Count:" + selectedData.Count)
                .attr("x", x(selectedData.TimeStamp) + 15)
                .attr("y", y(selectedData.Count))
        }
    }
    function mouseout() {
        focus.style("opacity", 0);
        focusText.style("opacity", 0)
    }

    d3.select("#selectButton").on("change", function (d) {
        // recover chosen option
        selectedOption = d3.select(this).property("value");
        //run update() using the selected option
        update(selectedOption);
    });

}



