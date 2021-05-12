var first = d3.select('#Chorolepth-map');

var svg = d3.select('#worldMap');

// Define the div for the tooltip
var tooltip = first
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var projection = d3.geoMercator()
.scale(100)
.center([0,20])


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
  'https://raw.githubusercontent.com/manishjha5410/covid/main/static/json/countries.json';
const COUNTY_FILE =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json';

let countries,Area,newData;

loadStats = async () =>{

  let summaryData = await covidApi.getSummary();
  newData = summaryData.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);

  Area = await fetchRequest(COUNTY_FILE);
  countries =  await fetchRequest(EDUCATION_FILE);

  for(var i =0;i<newData.length;i++)
  {

    summaryData = newData.filter((ele)=>{
      return countries[i].code === ele.CountryCode;
    })[0];

    try
    {
      countries[i].Confirmed = summaryData.TotalConfirmed;
    }
    catch(e)
    {}
  }

  ready(Area,countries);
}

loadStats();


function ready(Area, Countries)
{

  svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(Area, Area.objects.countries).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('data-name', function (d) {
      return d.properties['name'].toLowerCase();
    })
    .attr('data-Countries', function (d) {
      var result = Countries.filter(function (obj) {
        console.log(obj.name,d.properties['name'].toLowerCase());
        return obj.name.replace(' ','') === d.properties['name'].toLowerCase().replace(' ','');
      });
      console.log(result);
      if (result[0]) {
        return result[0].bachelorsOrHigher;
      }
      // could not find a matching fips id in the data
      console.log('could find data for: ', d.id);
      return 0;
    })
    .attr('fill', function (d) {
      var result = Countries.filter(function (obj) {
        return obj.fips === d.id;
      });
      if (result[0]) {
        return color(result[0].bachelorsOrHigher);
      }
      // could not find a matching fips id in the data
      return color(0);
    })
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .on('mouseover', function (d) {
      tooltip.style('opacity', 0.9);
      d3.select(this).style("stroke", "black");
      tooltip
        .html(function () {
          var result = Countries.filter(function (obj) {
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
        .attr('data-Countries', function () {
          var result = Countries.filter(function (obj) {
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
      topojson.mesh(Area, Area.objects.states, function (a, b) {
        return a !== b;
      })
    )
    .attr('class', 'states')
    .attr('d', path);
}
