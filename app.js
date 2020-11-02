// Set up the width and height of the chart.
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 40,
    right: 60,
    bottom: 100,
    left: 80
};
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
var svg = d3.select("#scatter").append("svg").attr("width",svgWidth).attr("height",svgHeight);
var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

// Create a function to return xLinearScale.
function xLinearScale(data, xLabel) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[xLabel])-1,d3.max(data, d => d[xLabel])+1])
        .range([0,chartWidth]);
    return xLinearScale;
}

// Create a function to return yLinearScale.
function yLinearScale(data, yLabel) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[yLabel])-2,d3.max(data, d => d[yLabel])+2])
        .range([chartHeight,0]);
    return yLinearScale;
}

// Create a function to update bottom axis (x-axis).
function updateBottomAxis(xLinearScale, xAxis) {
    var bottomAxis = d3.axisBottom(xLinearScale);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
}

// Create a function to update left axis (y-axis).
function updateLeftAxis(yLinearScale, yAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;
}

d3.csv("data.csv").then(data => {
    data.forEach(d =>{
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;        
        d.healthcare = +d.healthcare;
        d.smokes = +d.smokes;
        d.obesity = +d.obesity;
    });

    // Set up the default chart.
    var xScale = d3.scaleLinear().domain([d3.min(data, d => d.poverty)-1,d3.max(data, d => d.poverty)+1]).range([0,chartWidth]);
    var yScale = d3.scaleLinear().domain([d3.min(data, d => d.healthcare)-2,d3.max(data, d => d.healthcare)+2]).range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    var yAxis = chartGroup.append("g").classed("axis",true).call(leftAxis);
    var xAxis = chartGroup.append("g").classed("axis",true).attr("transform",`translate (0,${chartHeight})`).call(bottomAxis);

    var circleGroup = chartGroup.selectAll("circle").data(data).enter().append("circle").attr("cx",(d,i) => xScale(d.poverty)).attr("cy",(d,i) => yScale(d.healthcare)).attr("r",10).attr("stroke","none").attr("opacity",1).attr("fill","lightblue");
    var abbrGroup = chartGroup.selectAll("dot").data(data).enter().append("text").text(d => d.abbr).attr("x",d => xScale(d.poverty)).attr("y",d => yScale(d.healthcare)).attr("font-size","10px").attr("fill","white").style("text-anchor","middle");

    // Set up the tooltip for the default chart.
    var toolTip = d3.tip().attr("class","d3-tip").offset([80,-60]).html(d => {
        return(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
    });
    circleGroup.call(toolTip);

    // Show up the information required with mouse moving to the circles, while hide after moving away.
    circleGroup.on("mouseover", function(data) {toolTip.show(data, this);}).on("mouseout", function(data, index) {toolTip.hide(data);});
    
    // List the optional labels of x-axis and y-axis.
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (chartHeight / 2)-30)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obese (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
      .attr("class", "axisText")
      .text("Age (median)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2 - 40}, ${chartHeight + margin.top + 40})`)
      .attr("class", "axisText")
      .text("Household Income (median)");    
        
    // Print the default information on the console.
    var xValue = "In Poverty (%)";
    var yValue = "Lacks Healthcare (%)";
    var xLabel = "poverty";
    var yLabel = "healthcare";
    var chartContent = d3.select("svg").selectAll("g");
    console.log(`The x-axis value: ${xValue}`);
    console.log(`The y-axis value: ${yValue}`);
    console.log(`x: ${xLabel}`);
    console.log(`y: ${yLabel}`);

    // Mouse click event.
    chartGroup.selectAll("text").on("click",function() {
        var value = d3.select(this).text();
        console.log(`You have clicked: ${value}`);        

        // Set conditions to avoid misclicking to other text. Keep the labels only, and remove the rest of the chart contents.
        if (value == "In Poverty (%)" || value == "Age (median)" || value == "Household Income (median)") {
            xValue = value;            
            chartContent.selectAll(".axis").remove();
            chartContent.selectAll("circle").remove();
            abbrGroup.remove();
        }
        else if (value == "Lacks Healthcare (%)" || value == "Smokers (%)" || value == "Obese (%)") {
            yValue = value;
            chartContent.selectAll(".axis").remove();
            chartContent.selectAll("circle").remove();
            abbrGroup.remove();                                    
        }
        console.log(`The x-axis value: ${xValue}`);
        console.log(`The y-axis value: ${yValue}`);

        if (xValue == "In Poverty (%)") {            
            xLabel="poverty";
        }
        else if (xValue == "Age (median)") {            
            xLabel="age";
        }
        else if (xValue == "Household Income (median)") {            
            xLabel="income";
        }
        
        if (yValue == "Lacks Healthcare (%)") {            
            yLabel="healthcare";
        }
        else if (yValue == "Smokers (%)") {            
            yLabel="smokes";
        }
        else {            
            yLabel="obesity";
        }
        console.log(`x: ${xLabel}`);
        console.log(`y: ${yLabel}`);

        // Update x-axis and y-axis.
        xScale = xLinearScale(data,xLabel);
        yScale = yLinearScale(data,yLabel);
        xAxis = chartGroup.append("g").classed("axis",true)
                    .attr("transform",`translate (0,${chartHeight})`)
                    .call(bottomAxis);
        yAxis = chartGroup.append("g").classed("axis",true).call(leftAxis);
        xAxis = updateBottomAxis(xScale,xAxis);
        yAxis = updateLeftAxis(yScale,yAxis);

        // Update circles with different xvalues and yvalues.
        circleGroup = chartGroup.selectAll("circle").data(data).enter().append("circle")
                    .attr("cx",(d,i) => xScale(d[xLabel]))
                    .attr("cy",(d,i) => yScale(d[yLabel]))
                    .attr("r",10).attr("stroke","none")
                    .attr("opacity",1).attr("fill","lightblue");
        
        // Update the abbr of states.
        abbrGroup = chartGroup.selectAll("dot").data(data).enter().append("text")
                    .text(d => d.abbr).attr("x",d => xScale(d[xLabel]))
                    .attr("y",d => yScale(d[yLabel])).attr("font-size","10px")
                    .attr("fill","white").style("text-anchor","middle");        
        
        // Update tooltip.
        toolTip = d3.tip().attr("class","d3-tip").offset([80,-60]).html(d => {
            return(`${d.state}<br>${xLabel}: ${d[xLabel]}<br>${yLabel}: ${d[yLabel]}%`);
        });
        circleGroup.call(toolTip);                
        circleGroup.on("mouseover", function(data) {toolTip.show(data, this);}).on("mouseout", function(data, index) {toolTip.hide(data);});    
    });    
});