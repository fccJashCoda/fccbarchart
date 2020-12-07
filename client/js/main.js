// TODO
// [x] finsih html scaffolding
// [x] finsih styling
// [x] add a label to the chart
// [x] add fading effect to tooltip to diminish flicker
// [] make it responsive
// [] build it on codepen

(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const URL =
      // 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
      'http://localhost:5555/jsondata';
    const WIDTH = 860;
    const HEIGHT = 450;
    const PADDING = 60;

    // DOM queries
    const svgContainer = document.getElementById('svgContainer');
    const start = document.getElementById('start');
    const end = document.getElementById('end');
    const showDataBtn = document.getElementById('showData');

    // EventListeners
    showDataBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderData();
    });

    // Init
    const rawDataset = await buildRawData();
    renderData();

    // Function Declarations
    async function buildRawData() {
      // API call
      const _fetchData = async () => {
        try {
          const response = await fetch(URL);
          const { data } = await response.json();
          console.log(data);
          return data;
        } catch (err) {
          return {};
        }
      };

      const _getQuarter = (date) => {
        const month = parseInt(date);
        let quarter;

        if (month > 9) {
          quarter = 'Q4';
        } else if (month > 6) {
          quarter = 'Q3';
        } else if (month > 3) {
          quarter = 'Q2';
        } else {
          quarter = 'Q1';
        }
        return quarter;
      };

      const apiResponse = await _fetchData();
      if (!Object.keys(apiResponse).length) return [];

      const dataset = [];
      apiResponse.data.forEach((set) => {
        const dataobj = {
          date: set[0],
          year: set[0].slice(0, 4),
          quarter: _getQuarter(set[0].slice(5)),
          gdp: set[1],
        };
        dataset.push(dataobj);
      });

      return dataset;
    }

    function getDataRangeFromUserInput() {
      let startValue =
        start.value >= 1947 && start.value <= 2015 ? Number(start.value) : 1947;
      let endValue =
        end.value >= 1947 && end.value <= 2015 ? Number(end.value) : 2015;

      if (startValue > endValue) {
        startValue = 1947;
      }

      const dataset = rawDataset.filter(
        (data) => data.year >= startValue && data.year <= endValue
      );

      return dataset;
    }

    function renderData() {
      svgContainer.innerHTML = '';
      const dataset = getDataRangeFromUserInput();

      const timeData = dataset.map((set) => new Date(set.date));

      const maxDate = new Date(d3.max(timeData).getTime());
      maxDate.setMonth(maxDate.getMonth() + 3);

      const xScale = d3
        .scaleTime()
        .domain([d3.min(timeData), maxDate])
        .range([PADDING, WIDTH]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.gdp)])
        .range([HEIGHT - PADDING, 0]);

      const tooltip = d3
        .select('article')
        .append('div')
        .attr('id', 'tooltip')
        .attr('class', 'invisible');

      const svg = d3
        .select('article')
        .append('svg')
        .attr('id', 'title')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewBox', '0 0 860 450');

      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .style('position', 'relative')
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(timeData[i]))
        .attr('y', (d) => yScale(d.gdp))
        .attr('width', WIDTH / dataset.length)
        .attr('height', (d) => yScale(0) - yScale(d.gdp))
        .attr('data-date', (d) => d.date)
        .attr('data-gdp', (d) => d.gdp)
        .on('mouseover', (d, i) => {
          tooltip
            .html(`${d.year} ${d.quarter} <br> $${d.gdp} Billion`)
            .style('left', `${xScale(timeData[i]) + 20}px`)
            .attr('data-date', d.date)
            .attr('data-gdp', d.gdp)
            .attr('class', 'fade-in');
        })
        .on('mouseout', () => {
          tooltip.attr('class', 'invisible');
        });

      // add axis bars
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${HEIGHT - PADDING})`)
        .call(xAxis);

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${PADDING}, 0)`)
        .call(yAxis);

      svg
        .append('text')
        .attr('x', -HEIGHT / 2 - 30)
        .attr('y', 15)
        .attr('transform', `rotate(-90)`)
        .text('Units: Billions of Dollars');

      svg
        .append('text')
        .attr('x', WIDTH / 2 - 80)
        .attr('y', HEIGHT - 10)
        .text(
          `${
            start.value === end.value
              ? `Data from ${start.value}`
              : `Data from ${start.value} to ${end.value}`
          }`
        );
    }
  });
})();
