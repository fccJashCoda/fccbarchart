document.addEventListener('DOMContentLoaded', () => {
  const url =
    // 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    'http://localhost:5555/jsondata';
  const width = 850;
  const height = 450;
  const padding = 50;

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      const dataset = [];

      const getQuarter = (date) => {
        const month = parseInt(date);
        let quarter;
        switch (true) {
          case month > 9:
            quarter = 'Q4';
            break;
          case month > 6:
            quarter = 'Q3';
            break;
          case month > 3:
            quarter = 'Q2';
            break;
          default:
            quarter = 'Q1';
            break;
        }
        return quarter;
      };

      data.data.forEach((set) => {
        const dataobj = {
          // date: new Date(set[0]),
          date: set[0],
          year: set[0].slice(0, 4),
          quarter: getQuarter(set[0].slice(5)),
          gdp: set[1],
        };
        dataset.push(dataobj);
      });

      const testData = dataset.map((set) => new Date(set.date));

      const timeScale = d3
        .scaleTime()
        .domain([d3.min(testData), new Date('2016')])
        .range([padding, width]);

      const xScale = d3
        .scaleBand()
        .domain(dataset.map((d) => d.date))
        .range([padding, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.gdp)])
        .range([height - padding, 0]);

      const xAxis = d3.axisBottom(timeScale);
      const yAxis = d3.axisLeft(yScale);
      console.log('xAxis:', xAxis);

      const svg = d3
        .select('article')
        .append('svg')
        .attr('id', 'title')
        .attr('width', width)
        .attr('height', height);

      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => timeScale(testData[i]))
        .attr('y', (d) => yScale(d.gdp))
        .attr('width', width / dataset.length)
        .attr('height', (d) => yScale(0) - yScale(d.gdp))
        .attr('fill', 'steelblue')
        .attr('data-date', (d) => d.date)
        .attr('data-gdp', (d) => d.gdp)
        .append('title')
        .text((d) => `${d.year} ${d.quarter} \n$${d.gdp} Billion`);

      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${height - padding})`)
        .call(xAxis);

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);
    })
    .catch((err) => console.error(err));
});
