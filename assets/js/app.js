// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
var svg = d3.select(".scatter").append("svg").attr("width",svgWidth).attr("height",svgHeight);
var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

d3.csv("../data/data.csv").then(data => {
    data.forEach(d =>{
        console.log(d);
    })
});