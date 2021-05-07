/*document.querySelector('#worldMap').setAttribute("width",document.querySelector('#worldMap').parentElement.parentElement.parentNode.offsetWidth);
document.querySelector('#worldMap').setAttribute("height",document.querySelector('#worldMap').parentElement.parentElement.parentNode.offsetHeight);

// The svg
var svg = d3.select("#worldMap"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();

var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
  .await(ready);

function ready(error, topo) {

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 1)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
    }
*/


/* global d3, topojson */
/* eslint-disable max-len */

// eslint-disable-next-line no-unused-vars
// const projectName = 'choropleth';

// coded by @paycoguy & @ChristianPaul (github)
// const projectName = 'choropleth';
// Define body

console.log(d3);
console.log(topojson);

let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData
let educationData

let canvas = d3.select('#worldMap')

let drawMap = () => {

}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(error);
        }else{
            countyData = data;
            countyData = topojson.feature(countyData, countyData.objects.counties)
            console.log('County Data');
            console.log(countyData);

            d3.json(educationURL).then(
                (data,err) => {
                  if(err)
                    console.log(err);
                  else
                  {
                    educationData = data;
                    console.log("Education");
                    console.log(educationData);
                  }
              }
            )
        }
    }
)
