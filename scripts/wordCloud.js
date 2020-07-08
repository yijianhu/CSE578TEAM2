function WordCloud(data, state)
{
    
    // List of words
    var myWords = [];
    //var myWords =[];
    

    // set the dimensions and margins of the graph
    var margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };
    var boundingBox = d3.select("#map").node().getBoundingClientRect(),
        width = boundingBox.width- margin.left,
        height = boundingBox.height- margin.top;

    // append the svg object to the body of the page
    var svg = d3.select("#wordcloud")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
    layout.start();


    this.updateWords = function(state)
    {
        //console.log(data);
        myWords=[]
        data.filter(function(d){
            if(d.State == state)
            {
                //console.log(d);
                for (var i=1;i<Object.keys(d).length/2;i++)
                {
                    if(d["Word"+i]!="")
                        myWords.push({word:d["Word"+i], size:parseInt(d["Occurrence"+i])});
                }
            }
        })
        var scale = d3.scaleLinear()
                      .domain([d3.min(myWords,d=>d.size),d3.max(myWords,d=>d.size)])
                      .range([20,78]);
        layout.words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
            .padding(5)        //space between words
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .fontSize(function(d) { return scale(d.size); })      // font size of words
            .on("end", draw)
            .start();
        //console.log(myWords);
    }

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
    //console.log(words);
    svg
        .selectAll("g").remove();
    svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
            .data(words)
        .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}