var geoUrl = "./data/usStates.geojson";
var dataUrl ="./data/restaurant.csv";

var margin = 50,
    boundingBox = d3.select("#map").node().getBoundingClientRect(),
    width = boundingBox.width- margin,
    height = boundingBox.height- margin;

var t = 100

var q = d3_queue.queue(1)
.defer(d3.json, geoUrl)
.defer(d3.csv, dataUrl)
.awaitAll(draw);

function draw(error, data) {
    "use strict";
  
    // important: First argument it expects is error
    if (error) throw error;
  
    // console.log(data[0])
    // for(var each in data[0].features.properties)
    // {
    //   console.log(each)
    // }
    var color = d3.scaleThreshold()
      .domain([0, 100, 150, 200, 250, 300, 350, 400, 450])
      .range(["#FFFFFF", "#DDEBFF", "#98C2FF", "#73ACFF", "#5097FF", "#2A80FF", "#0C6EFF", "#005FEC","#004EC1"]);
  
    // create a projection properly scaled for SF
    var projection = d3.geoMercator()
      .center([-105.475101, 38.565383])
      .scale(170*5)
      .translate([width/2, height/2]);

    // var projection = d3.geo.albersUsa()
    // .translate([width/2, height/2])    // translate to center of screen
    // .scale([1000]);
  
    // create a path to draw the neighborhoods
    var path = d3.geoPath()
      .projection(projection);
  
    // create and append the map of SF neighborhoods
    var map = d3.select('#map').selectAll('path')
      .data(data[0].features)
      .enter()
      .append('path')
      .attr('d', path);
      //.style('stroke', 'black')
      //.style('stroke-width', 0.75);
  
  
    // // normalize neighborhood names
    
    map.datum(function(d) {
      data[1].filter(function(x){
          if(x.State==d.properties.NAME)
          {
              d.properties.Count =  x.Count;
          }
      });
      return d;
    });
  
    // // add the name as its class
    map
      .attr('class', function(d) {
        console.log(d.properties.NAME)
        return d.properties.NAME;
      })
      .attr("fill", function(d) {
          return color(d.properties.Count);})
  
  
  
    var newRange = d3.scaleLinear()
        .domain([0, 450])
        .range([0, width/2]);
  
    var xAxis = d3.axisBottom(newRange)
        .tickSize(13)
        .tickValues(color.domain())
  
  
    var legendCanvas = d3.select("#map").append("g").attr("transform", "translate("+(width/2-width/4) + ", "+(height) + ")").call(xAxis);
  
    legendCanvas.select(".domain")
        .remove();
    
    legendCanvas.selectAll("rect")
      .data(color.range().map(function(color1) {
        var d = color.invertExtent(color1);
        if (d[0] == null) d[0] = newRange.domain()[0];
        if (d[1] == null) d[1] = newRange.domain()[1];
        return d;
      }))
      .enter().insert("rect", ".tick")
        .attr("height", 8)
        .attr("x", function(d) { return newRange(d[0]); })
        .attr("width", function(d) { return newRange(d[1]) - newRange(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });
  
    legendCanvas.selectAll(".tick").selectAll("text").text(function(d){if(d==45)return "40+";else return d;})
    
    legendCanvas.append("text")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("y", -6)
        .text("Count of restaurants in States");
  
  
    var tooltip = d3.select("body")
      .append("div")
      .attr("class","tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");
  
    map
      .on("mouseover", function(d) 
      {   
        div.transition()
              .duration(200)    
              .style("opacity", .9);    
        div.html(d.properties.name + "<br/>")  
              .style("left", (d3.event.pageX) + "px")   
              .style("top", (d3.event.pageY - 28) + "px")})     
      .on("mouseover", function(){return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .on("mouseover", function(d) {
        return tooltip.style("visibility", "visible")
        .html(d.properties.NAME + "<br/>" + "Number of Restaurants:  " + "<br/>" + d.properties.Count );});
  
  
    function animation()
    {
      map
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>0)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>10)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>15)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>20)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>25)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>30)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>35)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          if(d.properties.Count>40)
            return "#FFFFFF";
          return color(d.properties.Count);
        })
        .transition().delay(t/2)
        .transition().duration(t)
        .attr("fill",function(d){
          return color(d.properties.Count);
        })
    }
  
    d3.select("body").on("keydown",function(){
      if(d3.event.key == 'c' || d3.event.key=='C')
      {
          animation();
      }
    })
  }