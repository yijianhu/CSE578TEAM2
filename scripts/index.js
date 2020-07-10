var geoUrl = "./data/usStates.geojson";
var dataUrl ="./data/restaurant.csv";
var azgeo = "./data/AZcounties.geojson";
var usa_cities = "./data/usa-cities.geojson";
var azzip = "./data/AZzip.geojson";
//geoUrl=azzip;


var t = 100;

var q = d3_queue.queue(1)
.defer(d3.json, geoUrl)
.defer(d3.csv, dataUrl)
.awaitAll(draw);

// for use in the traffic chart, we must get the state that the user clicks on
let currentState = "";
function abbrState(input, to){

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to === 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(let i = 0; i < states.length; i++){
            if(states[i][0] === input){
                return(states[i][1]);
            }
        }
    } else if (to === 'name'){
        input = input.toUpperCase();
        for(let i = 0; i < states.length; i++){
            if(states[i][1] === input){
                return(states[i][0]);
            }
        }
    }
}


function draw(error, data) {
    "use strict";
  
    if (error) throw error;
  
    var margin = 50,
    boundingBox = d3.select("#map").node().getBoundingClientRect(),
    width = boundingBox.width- margin,
    height = boundingBox.height- margin;
    
    //console.log(data);

    var minCount, maxCount, detCount;
    minCount = d3.min(data[1],d=>parseInt(d.Count));
    maxCount = d3.max(data[1],d=>parseInt(d.Count));
    detCount = maxCount - minCount;
    // console.log(minCount);
    // console.log(detCount);
    // console.log(maxCount);


    var color = d3.scaleThreshold()
      .domain([0, minCount,minCount+detCount*1/13, minCount+detCount*1/13, minCount+detCount*2/13, minCount+detCount*3/13, minCount+detCount*5/13, minCount+detCount*8/13, maxCount])
      .range(["#FFFFFF", "#DDEBFF", "#98C2FF", "#73ACFF", "#5097FF", "#2A80FF", "#0C6EFF", "#005FEC","#004EC1"]);
  
    var projection = d3.geoMercator()
      .center([-105.475101, 38.565383])
      .scale(500)
      .translate([width/2, height/2]);

    // var projection = d3.geoMercator()
    //   .center([-112.475101, 34.565383])
    //   .scale(4500)
    //   .translate([width/2, height/2]);

    var path = d3.geoPath()
      .projection(projection);
  
    var map = d3.select('#map').selectAll('path')
      .data(data[0].features)
      .enter()
      .append('path')
      .attr('d', path);


    
    map.datum(function(d) {
      data[1].filter(function(x){
          if(x.State==d.properties.NAME)
          {
              d.properties.Count =  x.Count;
          }
      });
      return d;
    });
  
    map
      .attr('class', function(d) {
        return d.properties.NAME;
      })
      .attr("stroke","white")
      .attr("stroke-width","1px")
      .attr("fill", function(d) {
          return color(d.properties.Count);})

      // map.data(data[2].features)
      // .enter()
      // .append('path')
      // .attr('d', path);
  
  
  
    var newRange = d3.scaleLinear()
        .domain([0, maxCount])
        .range([0, width/1.5]);
  
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
  
    legendCanvas.selectAll(".tick").selectAll("text").text(function(d){return parseInt(d/1000)+'k';})
    
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

    var wordcloud = new WordCloud(data[1]);
    wordcloud.updateWords("Maine");
  
    var selectedState = "";

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
        if(selectedState==""){
          wordcloud.updateWords(d.properties.NAME);
        }
        return tooltip.style("visibility", "visible")
        .html(d.properties.NAME + "<br/>" + "Number of Restaurants:  " + "<br/>" + d.properties.Count );})
        //.html(d.properties.NAME + "<br/>" + "Number of Restaurants:  " + "<br/>" + d.properties.Count );});
      .on("click", function (d) {
          if(d.properties.NAME==selectedState)
          {
            selectedState="";
            d3.select("#map").selectAll("path").style("opacity",1).attr("stroke","white").attr("stroke-width","1px");
          }
          else{
            if(selectedState!=""){
              wordcloud.updateWords(d.properties.NAME);
            }
            selectedState=d.properties.NAME;
            d3.select("#map").selectAll("path").style("opacity",0.2).attr("stroke","white").attr("stroke-width","1px");
            d3.select(this).style("opacity",1).attr("stroke","orange").attr("stroke-width","2px");
          }
          currentState = abbrState(d.properties.NAME, "abbr");
          // console.log(abbrState(d.properties.NAME, "abbr"));
          updateBusinessSelector();
          update(d3.select("#selectButton").property("value"));
          // console.log("720pm");
          // console.log(d3.select("#selectButton").property("value"));
    })
  }