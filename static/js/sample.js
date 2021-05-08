

/*
console.log(d3);
console.log(topojson);

let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData
let educationData

let canvas = d3.select('#worldMap');
let map = d3.select('#Chorolepth-map');

let drawTooltip = () => {
  var tooltip = map
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

  
}

let drawLegend = () => {

  var x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

  var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeReds[9]);

  var g = canvas
    .append('g')
    .attr('class', 'key')
    .attr('id', 'legend')
    .attr('transform', 'translate(0,40)');

    g
    .selectAll('rect')
    .data(
      color.range().map(function (d) {
        d = color.invertExtent(d);
        if (d[0] === null) {
          d[0] = x.domain()[0];
        }
        if (d[1] === null) {
          d[1] = x.domain()[1];
        }
        return d;
      })
    )
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', function (d) {
      return x(d[0]);
    })
    .attr('width', function (d) {
      return x(d[1]) - x(d[0]);
    })
    .attr('fill', function (d) {
      return color(d[0]);
    });

    g
    .append('text')
    .attr('class', 'caption')
    .attr('x', x.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold');

    g
    .call(
      d3
      .axisBottom(x)
      .tickSize(13)
      .tickFormat(function (x) {
        return Math.round(x) + '%';
      })
      .tickValues(color.domain())
    )
    .select('.domain')
    .remove();
}

let drawMap = () => {
  canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d',d3.geoPath())
    .attr('class','county')
    .attr('fill',(countyDataItem)=>{
      let id = countyDataItem['id'];
      let county = educationData.find((item)=>{
        return item['fips'] === id
      })

      let percentage = county['bachelorsOrHigher'];
      if(percentage<=15)
        return 'tomato';
      else if(percentage<=30)
        return 'orange';
      else if(percentage<=45)
        return 'lightgreen';
      else
        return 'limegreen';
    })
    .attr('data-fips',countyDataItem=>{return countyDataItem['id']})
    .attr('data-education',(countyDataItem)=>{
      let id = countyDataItem['id'];
      let county = educationData.find((item)=>{
        return item['fips'] === id;
      })
      let percentage = county['bachelorsOrHigher'];
      return percentage;
    })
    drawLegend();
}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
          console.log(error);
        }
        else
        {
          countyData = data;
          countyData = topojson.feature(countyData, countyData.objects.counties).features
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
                  drawMap();
                }
            }
          )
        }
    }
)
*/

/*

var first = d3.select('#Chorolepth-map');

var svg = d3.select('#worldMap');

// Define the div for the tooltip
var tooltip = first
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var path = d3.geoPath();

var x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeReds[9]);

var g = svg
  .append('g')
  .attr('class', 'key')
  .attr('id', 'legend')
  .attr('transform', 'translate(0,40)');

g.selectAll('rect')
  .data(
    color.range().map(function (d) {
      d = color.invertExtent(d);
      if (d[0] === null) {
        d[0] = x.domain()[0];
      }
      if (d[1] === null) {
        d[1] = x.domain()[1];
      }
      return d;
    })
  )
  .enter()
  .append('rect')
  .attr('height', 8)
  .attr('x', function (d) {
    return x(d[0]);
  })
  .attr('width', function (d) {
    return x(d[1]) - x(d[0]);
  })
  .attr('fill', function (d) {
    return color(d[0]);
  });

g.append('text')
  .attr('class', 'caption')
  .attr('x', x.range()[0])
  .attr('y', -6)
  .attr('fill', '#000')
  .attr('text-anchor', 'start')
  .attr('font-weight', 'bold');

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x) {
      return Math.round(x) + '%';
    })
    .tickValues(color.domain())
)
  .select('.domain')
  .remove();

const EDUCATION_FILE =
  'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const COUNTY_FILE =
  'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

d3.queue()
  .defer(d3.json, COUNTY_FILE)
  .defer(d3.json, EDUCATION_FILE)
  .await(ready);

function ready(error, us, education)
{
  if (error) {
    throw error;
  }

  svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('data-fips', function (d) {
      return d.id;
    })
    .attr('data-education', function (d) {
      var result = education.filter(function (obj) {
        return obj.fips === d.id;
      });
      if (result[0]) {
        return result[0].bachelorsOrHigher;
      }
      // could not find a matching fips id in the data
      console.log('could find data for: ', d.id);
      return 0;
    })
    .attr('fill', function (d) {
      var result = education.filter(function (obj) {
        return obj.fips === d.id;
      });
      if (result[0]) {
        return color(result[0].bachelorsOrHigher);
      }
      // could not find a matching fips id in the data
      return color(0);
    })
    .attr('d', path)
    .on('mouseover', function (d) {
      tooltip.style('opacity', 0.9);
      d3.select(this).style("stroke", "black");
      tooltip
        .html(function () {
          var result = education.filter(function (obj) {
            return obj.fips === d.id;
          });
          if (result[0]) {
            return (
              result[0]['area_name'] +
              ', ' +
              result[0]['state'] +
              ': ' +
              result[0].bachelorsOrHigher +
              '%'
            );
          }
          // could not find a matching fips id in the data
          return 0;
        })
        .attr('data-education', function () {
          var result = education.filter(function (obj) {
            return obj.fips === d.id;
          });
          if (result[0]) {
            return result[0].bachelorsOrHigher;
          }
          // could not find a matching fips id in the data
          return 0;
        })
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('opacity', 0);
      d3.select(this).style("stroke", "transparent");
    });

  svg
    .append('path')
    .datum(
      topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })
    )
    .attr('class', 'states')
    .attr('d', path);
}


*/

