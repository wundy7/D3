// @TODO: YOUR CODE HERE!


var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper and append an SVG group that holds the chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(healthData) {

// Parse Data as numbers
    
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
    });

// Create scale functions
    
    var xLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.poverty)+2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(healthData, d => d.age)+2])
      .range([height, 0]);

// Create axis functions
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Append Axes to the chart
    
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// Create Circles
    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // svg.selectAll("text")
    // .data(data)
    // .enter()
    // .append("text")
    // .attr("x", d => xScale( d[xView] + 2 ) )
    // .attr("y", d => yScale( d[yView] ) )
    // .attr("font-size", 10)
    // .attr("text-anchor", "middle")
    // .style("fill", "white")
    // .text( d => d.abbr );


// Initialize tool tip
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([40, -60])
      .html(function(d) {
        return (`${d.state}<br>Age: ${d.age}<br>Poverty: ${d.poverty}`);
      });

// Create tooltip in the chart
    
    chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });



// Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Median Age");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% of Population Below Poverty");




  });

