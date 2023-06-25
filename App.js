let width, height, padding, xAxis, yAxis, xScale, heightScale, xAxisScale, yAxisScale, genAxis, svg, genScale, link, fetchData, newData, dates, genRect, genLegend, genToolTip, baseTemp, toolTip;
link = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
width = 1500;
height = 700;
padding = 60;
baseTemp = 8.66;

svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'white')

genScale = () => {
    //dates = newData.map(item => new date (item.))
    let min = d3.min(newData, d => d.year);
    let max = d3.max(newData, d => d.year);
    console.log(min, max)
    xScale = d3.scaleLinear()
                .domain([1753, 2015])
                .range([padding, width - padding])

    // heightScale =  d3.scaleLinear()
    //             .domain([1990, 2018])
    //             .range([padding, height - padding])

    let minMonth = d3.min(newData, d => new Date(0, d.month - 1, 0, 0, 0, 0, 0));
    let maxMonth = d3.max(newData, d => new Date(0, d.month, 0, 0, 0, 0, 0));

    yAxisScale = d3.scaleTime()
                    .domain([minMonth, maxMonth])
                    .range([padding, height - padding])

}

genAxis = () => {
    xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat('%B'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr("transform", "translate(0," + (height - padding) + ")")
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr("transform", "translate(" + padding + ",0)")
}

genRect = () => {
    svg.selectAll('rect')
        .data(newData)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('width', (d, i) => ((width - (2 * padding)) / newData.length) + 5)
        .attr('height', (d, i) => ((height - (2 * padding)) / 12) + 1)
        .attr('x', (d, i) => xScale(d.year))
        .attr('y', (d, i) => yAxisScale(new Date (0, d.month - 1, 0, 0, 0, 0, 0)))
        .style('fill', (d, i) => {
            if (d.variance < -2) {
                return 'blue'
            } else if (d.variance == 0) {
            return 'yellow' 
            } else if (d.variance > 0 && d.variance < 2) {
                return 'orange'
            } else {
                return 'red'
            }
        })
        .attr('data-month', d => d.month - 1)
        .attr('data-year', d => d.year)
        .attr('data-temp', d => baseTemp + d.variance)
        .on('mouseover', function(newData, d, i) {
            let val = d3.select(this);
            toolTip.transition().style('visibility', 'visible');
            toolTip.text(
                `year: ${val.attr('data-year')} / month: ${val.attr('data-month')} / Temp: ${val.attr('data-temp')}degCel
                `)
            toolTip.attr('data-year', val.attr('data-year'));
        })
        .on('mouseout', function() {
            toolTip.transition().style('visibility', 'hidden')
        })
    

}

genLegend = () => {
       
}

genToolTip = () => {
    toolTip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .attr('width', 200)
            .attr('height', 200)
            .style('visibility', 'hidden')
}


(async function() {
    data = await fetch(link)
            .then(res => res.json())
            .then(data => newData = data.monthlyVariance)
    console.log(newData);
    genScale();
    genAxis();
    genRect();
    genLegend();
    genToolTip();
    })();