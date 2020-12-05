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
      console.log(data);
      // const dataset = data.data;
      const years = [];

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

      // for (let i = 0; i < 20; i++) {
      //   const set = data.data[i];
      //   const dataobj = {
      //     date: set[0],
      //     year: set[0].slice(0, 4),
      //     quarter: getQuarter(set[0].slice(5)),
      //     gdp: set[1],
      //   };
      //   dataset.push(dataobj);
      // }
      data.data.forEach((set) => {
        const dataobj = {
          date: set[0],
          year: set[0].slice(0, 4),
          quarter: getQuarter(set[0].slice(5)),
          gdp: set[1],
        };
        dataset.push(dataobj);
      });

      const timeScale = d3
        .scaleTime()
        .domain([
          new Date(dataset[0].date),
          new Date(dataset[dataset.length - 1].date),
        ])
        .range([padding, width]);

      console.log(dataset[dataset.length - 1]);

      console.log('timescale test', timeScale(new Date('1947-01-01')));
      console.log('timescale test', timeScale(new Date('1957-01-01')));
      console.log('timescale test', timeScale(new Date('1997-01-01')));
      console.log('timescale test', timeScale(new Date('2000-01-01')));
      console.log('timescale test', timeScale(new Date('2015-07-01')));

      const xScale = d3
        .scaleBand()
        .domain(dataset.map((d) => d.date))
        .range([padding, width]);
      // .padding(0.1);
      console.log('xScale test: ', xScale('2014-10-01'));

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.gdp)])
        .range([height - padding, 0]);
      console.log('yscale: ', yScale);

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
        .attr('x', (d, i) => timeScale(new Date(d.date)))
        .attr('y', (d) => yScale(d.gdp))
        .attr('width', 3)
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
