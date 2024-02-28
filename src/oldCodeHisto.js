function histogram() {// Define your data dictionary
    // Define your data dictionary
    var data = {
        "Category A": 20,
        "Category B": 35,
        "Category C": 15,
        "Category D": 50,
        "Category E": 45
    };

    // Set up the dimensions for the SVG container and histogram
    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


    // If container is not defined, create a new one
    const container = d3.select("#chart-container");
    if (container.empty()) {
        container = d3.select("body").append("div")
            .attr("id", "chart-container");
    }

    // Create SVG element
    var svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define x scale
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(Object.keys(data));

    // Define y scale
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(Object.values(data))]);

    // Draw bars function
    function drawBars(data) {
        svg.selectAll(".bar")
            .data(Object.entries(data))
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d[0]); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return height - y(d[1]); });
    }

    // Initial drawing of bars
    drawBars(data);

    // Add x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Sort button event listener
    d3.select("#sortButton").on("click", function () {
        var sortOrder = d3.select("#sortButton").node().value;

        if (sortOrder === "increase") {
            // Sort data by increasing order of values
            var sortedData = Object.fromEntries(
                Object.entries(data).sort((a, b) => a[1] - b[1])
            );
        } else {
            // Sort data by decreasing order of values
            var sortedData = Object.fromEntries(
                Object.entries(data).sort((a, b) => b[1] - a[1])
            );
        }

        // Update x domain
        x.domain(Object.keys(sortedData));

        // Update bars
        svg.selectAll(".bar").remove();
        drawBars(sortedData);

        // Update x axis
        svg.select(".x-axis").remove();
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    });
}