document.addEventListener('DOMContentLoaded', () => {
  const url =
    // 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    'http://localhost:5555/jsondata';
  const width = 850;
  const height = 550;
  const padding = 50;
  // const width = 800;
  // const height = 500;
  // const padding = 20;

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(data);
      const dataset = data.data;

      const xScale = d3
        .scaleBand()
        .domain(d3.range(dataset.length))
        .range([padding, width])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([height - padding, 0]);

      const svg = d3
        .select('article')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(i))
        .attr('y', (d) => yScale(d[1]))
        .attr('width', 3)
        .attr('height', (d) => yScale(0) - yScale(d[1]))
        .attr('fill', 'skyblue')
        .attr('class', 'bar');
    })
    .catch((err) => console.error(err));
});
