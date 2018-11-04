function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
  }
}

function plotBarGraph(domElement, graphWidth, graphHeight, marginObj, dataArray) {
  var svg = d3.select(domElement).append("svg:svg")
            .attr("width", graphWidth + marginObj.left + marginObj.right)
            .attr("height", graphHeight + marginObj.top + marginObj.bottom)
            .call(responsivefy)
            .append("g")
            .attr("transform", "translate(" + marginObj.left + "," + marginObj.top + ")");

            //x.domain(d3.extent(dataArray, function(d) { return d.x; }));
            //y.domain([0, d3.max(dataArray, function(d) { return d.y; })]);

            var x = d3.scaleBand().range([0, graphWidth])
              .domain(dataArray.map((d) => d.x))

            var y = d3.scaleLinear().range([graphHeight, 0])
              .domain([0, d3.max(dataArray, function(d) { return d.y; })])

            svg.append("g")
                .selectAll("rect").data(dataArray).enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d, i) {
                    delta = (graphWidth / dataArray.length);
                    return i * delta + delta/2 - 30;
                })
                .attr("width", "60")
                .attr("y", d => y(d.y))
                .attr("height", d => graphHeight - y(d.y));

            svg.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + graphHeight + ")")
              .call(d3.axisBottom(x));

            svg.append("g")
              .attr("class", "axis")
              .call(d3.axisLeft(y));
}

function plotLineGraph(domElement, graphWidth, graphHeight, marginObj, dataArray) {

    // parse the date / time
  var parseTime = d3.timeParse("%d-%b-%y");

  // set the ranges
  var x = d3.scaleTime().range([ 0, graphWidth ])
  var y = d3.scaleLinear().range([ graphHeight, 0 ]);


  var svg = d3.select(domElement).append("svg:svg")
    .attr("width", graphWidth + marginObj.left + marginObj.right)
    .attr("height", graphHeight + marginObj.top + marginObj.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + marginObj.left + "," + marginObj.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(dataArray, function(d) { return d.x; }));
  y.domain([0, d3.max(dataArray, function(d) { return d.y; })]);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  // define the area
  var area = d3.area()
    .x(function(d) { return x(d.x); })
    .y0(graphHeight)
    .y1(function(d) { return y(d.y); });

  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(dataArray));

  // add the area
  svg.append("path")
    .attr("class", "area")
    .attr("d", area(dataArray));

  // Add the X Axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));
}
