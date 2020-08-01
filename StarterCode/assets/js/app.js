// Code to analyze heath care data and poverty.
// Build variables for SVG wrapper

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper.  Append it and add width and height margins.

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append chartGroup as general, transform/translate margins and chart presentation
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


//  Retrieve CSV file and data and begin parsing process
d3.csv("assets/data/data.csv").then(function(snagData){
    snagData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
    });

    // ***Create scale functions***
    // var xLinearScale = xScale(snagData, chosenXAxis);
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(snagData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(snagData, d => d.healthcare)])
        .range([height, 0]);
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
        chartGroup.append("g")
        .call(leftAxis);

    // Create circles for chart

    var circlesGroup = chartGroup.selectAll("circle")
        .data(snagData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "20")
        .attr("fill", "green")
        .attr("opacity", ".6")
        ;

    chartGroup.selectAll("circleLabel")
        .data(snagData)
        .enter()
        .append("text")
        .attr("x", function(d) { return xLinearScale(d.poverty)-10})
        .attr("y", d => yLinearScale(d.healthcare)+5)
        .text(d => d.abbr)
        .attr("class", "circleLabel")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "purple");
        

    //  Tool tip time!  Not part of assignment but wanted to include it.

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(d) {
            return (`${d.abbr}<br>Poverty Rate: ${d.poverty}%<br>Income: $ ${d.income}`);
        });

    chartGroup.call(toolTip);

    // Listerners for displaying/hiding tooltip using click and mouseout
    circlesGroup.on("click", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Poverty Rate (%)");
    });


