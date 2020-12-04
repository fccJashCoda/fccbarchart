document.addEventListener('DOMContentLoaded', () => {
  const url =
    // 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    'http://localhost:5555/jsondata';
  const width = 850;
  // const height = 550;
  const height = 450;
  const padding = 50;

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(data);
      // const dataset = data.data;
      const years = [];

      const dataset = [];

      data.data.forEach((set) => {
        const dataobj = {
          date: set[0],
          year: set[0].slice(0, 4),
          q: set[0].slice(5),
          gdp: set[1],
        };
        dataset.push(dataobj);
      });

      console.log(dataset);

      // dataset.forEach((set) => {
      //   const year = set[0].slice(0, 4);
      //   if (!years.includes(year)) {
      //     years.push(year);
      //   }
      // });
      // console.log(years);

      const xScale = d3
        .scaleBand()
        .domain(d3.range(dataset.length))
        .range([padding, width])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.gdp)])
        // .domain([0, d3.max(dataset, (d) => d[1])])
        .range([height - padding, 0]);
      console.log('yscale: ', yScale);

      const xAxis = d3.axisBottom(xScale).tickFormat((i) => dataset[i].date);
      // const xAxis = d3.axisBottom(xScale).ticks(2);
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
        .attr('x', (d, i) => xScale(i))
        .attr('y', (d) => yScale(d.gdp))
        // .attr('y', (d) => yScale(d[1]))
        .attr('width', 3)
        .attr('height', (d) => yScale(0) - yScale(d.gdp))
        // .attr('height', (d) => yScale(0) - yScale(d[1]))
        .attr('fill', 'steelblue')
        .attr('class', 'bar')
        .attr('data-date', (d) => d.date)
        // .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d.gdp)
        // .attr('data-gdp', (d) => d[1])
        .append('title')
        // .attr('class', 'tooltip')
        .text((d) => d.year);

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
