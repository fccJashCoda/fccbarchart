document.addEventListener('DOMContentLoaded', () => {
  const url =
    // 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    'http://localhost:5555/jsondata';
  const width = 500;
  const height = 400;

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      d3.select('article')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    })
    .catch((err) => console.error(err));
});
