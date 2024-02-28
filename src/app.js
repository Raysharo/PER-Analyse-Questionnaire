const openQuestions = [
    "Situation perso",
    "Appréciation enseignement",
    "Appréciation recherche",
    "Explications réponses"
];

// No data on other
// const genres = ["all", "un homme", "une femme", "autre"];
const genres = ["all", "homme", "femme"];


const POSITIVE_COLOR = "#2ca02c";
const NEGATIVE_COLOR = "#d62728";
const NEUTRAL_COLOR = "#1f77b4";

let cityCoordinates;
let structured_data;
let france;
let venn_data;

main();

async function main() {

    ({ cityCoordinates, structured_data, france, venn_data } = await fetchData());
    console.log("cityCoordinates :", cityCoordinates);
    console.log("structured_data :", structured_data);

    map();
    vennDiagram();
    circular_diagram();
    stacked_bar();

    createStackedExpression();



}

function vennDiagram() {
    console.log(venn_data); // Check if data is loaded correctly

    // rgb : red , green , blue, purple
    const color1 = "rgba(255, 0, 0)";
    const color2 = "rgba(0, 255, 0)";
    const color3 = "rgba(0, 0, 255)";
    const color4 = "rgba(255, 0, 255)";

    


    // Draw the Venn diagram
    var chart = venn.VennDiagram();

    var svg = d3.select("body")
        .append("div")
        .attr("class", "visualization-container")
        .attr("id", "venn-diagram-container")
        .datum(venn_data.sets)
        .call(chart);

    // Set colors for the sets after the chart is created
    d3.selectAll(".venn-circle path")
        // .style("fill", function (d, i) {
        //     if (i === 0) return color1;
        //     if (i === 1) return color2;
        //     if (i === 2) return color3;
        //     if (i === 3) return color4;
        //     // Add more conditions as needed for additional sets
        // })
        // .style("fill-opacity", 0.7);

    // Add a legend for the Venn diagram
    var legend = d3.select("#venn-diagram-container")
        .append("div")
        .attr("class", "legend");

    // Add a legend for the size of the sets
    var setSizeLegend = legend.append("div")
        .attr("class", "size-legend");

    // Add text indicating the legend title
    setSizeLegend.append("div")
        .attr("class", "legend-title")
        .text("Size Legend");

    // Add legend items for each set size
    setSizeLegend.selectAll(".legend-item")
        .data(venn_data.sets)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .html(function (d) {
            const setNames = d.sets.map(name => name.charAt(0)).join(" & ");
            return "<span class='legend-label'>" + setNames + "</span>" +
                "<span class='legend-size'> : " + d.size + " answers</span>";
        });
}







async function fetchData() {
    // const cityCoordinates = await d3.json("../data/cityCoordinates.json");
    // const structured_data = await d3.json("../data/structured_data.json");
    // const france = await d3.json("../data/regions.geojson");
    // const venn_data = await d3.json("../data/venn_data.json");

    // From localhost
    const cityCoordinates = await d3.json("/data/cityCoordinates.json");
    const structured_data = await d3.json("/data/structured_data.json");
    const france = await d3.json("/data/regions.geojson");
    const venn_data = await d3.json("/data/venn_data.json");




    return { cityCoordinates, structured_data, france, venn_data };
}

function stacked_bar() {
    openQuestions.forEach(question => {
        createStackedBarForQuestion(question, "all");
    });
    // createStackedBarForQuestion("Appréciation enseignement");
}


function createStackedExpression() {

    // Initialize an object to store theme-sentiment counts
    const ExprSentimentCounts = {};

    // Iterate over the filtered data to count theme-sentiment occurrences
    Object.values(structured_data).forEach(entry => {

        const expressions = entry["expression"];
        if (expressions) {
            const global_sentiment = entry["sentiment_global"];

            expressions.forEach(expr => {

                // Initialize count for the theme if not already present
                if (!ExprSentimentCounts.hasOwnProperty(expr)) {
                    ExprSentimentCounts[expr] = { "positive": 0, "negative": 0, "neutral": 0 };
                }
                // Increment count for the sentiment
                ExprSentimentCounts[expr][global_sentiment]++;
            });
        }

    });

    // Convert theme-sentiment counts to a format suitable for stacked bar chart
    const stackedData = Object.keys(ExprSentimentCounts).map(expr => {
        return {
            category: expr,
            positive: ExprSentimentCounts[expr]["positive"] || 0,
            negative: ExprSentimentCounts[expr]["negative"] || 0,
            neutral: ExprSentimentCounts[expr]["neutral"] || 0
        };
    });




    generateStackedBarChart(stackedData, "Sentiment by expression", 1200, 900, 250, 2);

}

/**
 * Try add gender filter
 */
function createStackedExpression(genderFilter = "all") {

    console.log("Call createStackedExpression with genderFilter", genderFilter)

    // Initialize an object to store theme-sentiment counts
    const ExprSentimentCounts = {};

    Object.values(structured_data).forEach(entry => {
        const expressions = entry["expression"];

        // Log the genre value to see its exact value and any whitespace
        // console.log("Genre:", entry["genre"]);

        if ((genderFilter !== "all" && entry["genre"].trim() !== genderFilter.trim())) return;



        if (expressions) {
            const global_sentiment = entry["sentiment_global"];

            expressions.forEach(expr => {

                // Initialize count for the theme if not already present
                if (!ExprSentimentCounts.hasOwnProperty(expr)) {

                    ExprSentimentCounts[expr] = { "positive": 0, "negative": 0, "neutral": 0 };
                }
                // Increment count for the sentiment
                ExprSentimentCounts[expr][global_sentiment]++;
            });
        }

    });

    // Convert theme-sentiment counts to a format suitable for stacked bar chart
    const stackedData = Object.keys(ExprSentimentCounts).map(expr => {
        return {
            category: expr,
            positive: ExprSentimentCounts[expr]["positive"] || 0,
            negative: ExprSentimentCounts[expr]["negative"] || 0,
            neutral: ExprSentimentCounts[expr]["neutral"] || 0
        };
    });


    let the_container = generateStackedBarChart(stackedData, "Sentiment by expression", 1200, 900, 250, 2);

    // Add a div for selecting the genre filter
    let genreFilterContainer = the_container.select(".title-legend").append("div");

    // Add a label for the genre filter
    genreFilterContainer.append("label")
        .attr("for", "genre-filter")
        .text("Genre Filter:");

    // Add a select input for the genre filter
    let genreFilter = genreFilterContainer.append("select")
        .attr("id", "genre-filter");

    genreFilter.append("option")
        .attr("value", "all")
        .text("all");

    // Add options for the genre filter
    genreFilter.selectAll("option")
        .data(genres)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d)
        .property("selected", d => d === genderFilter); // Set the selected property based on the genderFilter value



    // Add an event listener to the genre filter
    genreFilter.on("change", function () {
        // Delete the previous chart
        console.log("genre filter changed", this.value);
        let value = this.value;
        deleteContainer(the_container);
        the_container = createStackedExpression(value);
    });
    function deleteContainer(container) {
        container.selectAll("*").remove();
        container.remove();
    }

}

function createStackedBarForQuestion(question, genderFilter = "all") {

    // Filter structured_data for the specific question
    const questionData = Object.values(structured_data).filter(entry => {
        // Filter by gender if the filter is not set to "all"
        if (genderFilter !== "all" && entry["genre"].trim() !== genderFilter.trim()) {
            return false;
        }
        // Check if the entry contains the specified question
        return entry.hasOwnProperty(question);
    });

    // Initialize an object to store theme-sentiment counts
    const themeSentimentCounts = {};

    // Iterate over the filtered data to count theme-sentiment occurrences
    questionData.forEach(entry => {
        const chunks = entry[question].chunks;
        chunks.forEach(chunk => {
            const theme = chunk.theme;
            const sentiment = chunk.Sentiment;
            // Initialize count for the theme if not already present
            if (!themeSentimentCounts.hasOwnProperty(theme)) {
                themeSentimentCounts[theme] = { "positive": 0, "negative": 0, "neutral": 0 };
            }
            // Increment count for the sentiment
            themeSentimentCounts[theme][sentiment]++;
        });
    });

    // Convert theme-sentiment counts to a format suitable for stacked bar chart
    const stackedData = Object.keys(themeSentimentCounts).map(theme => {
        return {
            category: theme,
            positive: themeSentimentCounts[theme]["positive"] || 0,
            negative: themeSentimentCounts[theme]["negative"] || 0,
            neutral: themeSentimentCounts[theme]["neutral"] || 0
        };
    });






    let the_container = generateStackedBarChart(stackedData, "Sentiments by theme : " + question, 1200, 650, 100, 2);









    // Add a div for selecting the genre filter
    let genreFilterContainer = the_container.select(".title-legend").append("div");

    // Add a label for the genre filter
    genreFilterContainer.append("label")
        .attr("for", "genre-filter")
        .text("Genre Filter:");

    // Add a select input for the genre filter
    let genreFilter = genreFilterContainer.append("select")
        .attr("id", "genre-filter");

    genreFilter.append("option")
        .attr("value", "all")
        .text("all");

    // Add options for the genre filter
    genreFilter.selectAll("option")
        .data(genres)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d)
        .property("selected", d => d === genderFilter); // Set the selected property based on the genderFilter value



    // Add an event listener to the genre filter
    genreFilter.on("change", function () {
        // Delete the previous chart
        console.log("genre filter changed", this.value);
        let value = this.value;
        deleteContainer(the_container);
        the_container = createStackedBarForQuestion(question, value);
    });

}

function deleteContainer(container) {
    container.selectAll("*").remove();
    container.remove();
}

function generateStackedBarChart(data = [], question, chartWidth = 600, chartHeight = 400, bottom_margin = 50, min_bar_value = 1) {

    let containerId = `${question}-chart-container`
    let id_cleaned = containerId.replace(/[^a-zA-Z0-9-_]/g, '');

    buildStackedBarChartContainer(id_cleaned, question);

    // Set up margins
    let margin = { top: 20, right: 20, bottom: bottom_margin, left: 40 }, // Increased bottom margin for theme labels
        width = chartWidth - margin.left - margin.right,
        height = chartHeight - margin.top - margin.bottom;

    let svg = d3.select('#' + id_cleaned)
        .append("svg")
        .classed("stacked-bar-chart", true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .classed("stacked-bar-chart-group", true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Function to update the graph
    function updateGraph(minValue, sortByGroup = null, sortByRatio = false) {



        // Filter data points based on the minimum bar value
        let filteredData = data.filter(function (d) {
            return Object.values(d).slice(1).reduce((acc, val) => acc + val, 0) >= minValue;
        });

        // Calculate total count for each category
        let categoryCounts = {};
        filteredData.forEach(function (d) {
            let total = 0;
            Object.keys(d).forEach(function (key) {
                if (key !== "category") {
                    total += d[key];
                }
            });
            categoryCounts[d.category] = total;
        });

        // Calculate the maximum value reached by a bar
        let maxBarValue = d3.max(Object.values(categoryCounts));

        // Set max value of input range to the max bar value
        inputRange.attr("max", maxBarValue);

        // Sort categories based on total counts or group size if specified
        let categories = filteredData.map(function (d) { return d.category; });
        if (sortByGroup) {
            if (sortByRatio) {
                categories.sort(function (a, b) {
                    let propA = filteredData.find(x => x.category === a)[sortByGroup] / categoryCounts[a];
                    let propB = filteredData.find(x => x.category === b)[sortByGroup] / categoryCounts[b];

                    // If the proportions are equal, sort by decreasing global size
                    if (propA === propB) {
                        let globalSizeA = categoryCounts[a];
                        let globalSizeB = categoryCounts[b];
                        return globalSizeB - globalSizeA;
                    }

                    // Otherwise, sort by the proportions
                    return propB - propA;
                });

            }
            else {
                categories.sort(function (a, b) {
                    return filteredData.find(x => x.category === b)[sortByGroup] - filteredData.find(x => x.category === a)[sortByGroup];
                });
            }

        } else {
            categories.sort(function (a, b) {
                return categoryCounts[b] - categoryCounts[a];
            });
        }

        // Set up scales
        let x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(categories);

        let y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(filteredData, function (d) {
                return d3.sum(Object.values(d).slice(1));
            })]).nice();

        // Set up color scale
        let color = d3.scaleOrdinal()
            .domain(Object.keys(filteredData[0]).slice(1))
            .range([POSITIVE_COLOR, NEGATIVE_COLOR, NEUTRAL_COLOR]);

        // Set up stack
        let stack = d3.stack()
            .keys(Object.keys(filteredData[0]).slice(1))
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        let series = stack(filteredData);

        // Clear existing bars
        svg.selectAll(".serie").remove();

        // Draw bars
        svg.selectAll(".serie")
            .data(series)
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function (d) { return color(d.key); })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.category); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());

        // Remove existing x and y axes
        svg.selectAll(".x-axis").remove();
        svg.selectAll(".y-axis").remove();

        // Draw x axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-7,0) ,rotate(-90)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .transition() // Add transition to trigger end event

            ;


        // Draw y axis
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));
    }


    // Add input range for dynamically changing min_bar_value
    let inputRangeContainer = d3.select('#' + id_cleaned + " > .title-legend");

    inputRangeContainer.append("label")
        .attr("for", "min-bar-value")
        .text("Minimum Bar Value:");

    let inputRange = inputRangeContainer.append("input")
        .attr("type", "range")
        .attr("id", "min-bar-value")
        .attr("min", 1)
        .attr("max", 10)
        .attr("value", min_bar_value);

    inputRange.on("input", function () {
        let value = +this.value;
        updateGraph(value);

    });


    let sortButtonContainer = inputRangeContainer
        .append("div")
        ;


    let global_sort_div = sortButtonContainer.append("div").classed("sort-button-container", true);

    // Sort button Global
    let sortButtonGlobal = global_sort_div.append("button")
        .text("Sort by Global")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value);
        });

    // Sort button positive
    let sortButton = global_sort_div.append("button")
        .text("Sort by Positive")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value, "positive");
        });

    // Sort button negative
    let sortButton2 = global_sort_div.append("button")
        .text("Sort by Negative")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value, "negative");
        });

    // Sort button neutral
    let sortButton3 = global_sort_div.append("button")
        .text("Sort by Neutral")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value, "neutral");
        });

    let ratio_sort_div = sortButtonContainer.append("div").classed("sort-button-container", true);

    // Sort button positive
    let sortButtonRatio = ratio_sort_div.append("button")
        .text("Sort by Positive Ratio")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value, "positive", true);
        });

    // Sort button negative
    let sortButtonRatio2 = ratio_sort_div.append("button")
        .text("Sort by Negative Ratio")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value, "negative", true);
        });

    // Sort button neutral
    let sortButtonRatio3 = ratio_sort_div.append("button")
        .text("Sort by Neutral Ratio")
        .classed("sort-button", true)
        .on("click", function () {
            updateGraph(+inputRange.node().value, "neutral", true);
        });


    // Initialize the graph
    updateGraph(min_bar_value);

    console.log('id cleaned :', id_cleaned);
    let ret = d3.select('#' + id_cleaned);
    if (ret.empty()) console.error("ret is empty");
    return ret;

}

function buildStackedBarChartContainer(id, title) {

    let anchor = d3.select("a[anchor=" + id + "]");
    if (anchor.empty()) {
        anchor = d3.select("body").append("a").attr("anchor", id);
    }

    let container = d3.select("#" + id);

    if (container.empty()) {
        container = anchor.append("div")
            .attr("id", id)
            .attr("class", "visualization-container");

    }



    // Add a div for the title and the legend
    const title_legend_div = container.append("div")
        .attr("class", "title-legend");

    // Add a title h2
    title_legend_div.append("h2")
        .attr("class", "title")
        .text(title);

    // Add a legend
    const legend = title_legend_div.append("div")
        .attr("id", "circular-diagram-legend-container")
        .attr("class", "legend");

    // Add legend items
    const legendItems = [
        { text: "Positive", color: POSITIVE_COLOR },
        { text: "Negative", color: NEGATIVE_COLOR },
        { text: "Neutral", color: NEUTRAL_COLOR }
    ];

    legend.selectAll(".legend-item")
        .data(legendItems)
        .enter().append("div")
        .attr("class", "legend-item")
        .each(function (d) {
            const legendItem = d3.select(this);
            legendItem.append("div")
                .attr("class", "legend-color")
                .style("background-color", d.color)
                // width and height are set in CSS
                ;
            legendItem.append("span")
                .attr("class", "legend-text")
                .text(d.text);
        });



    return container;
}


function circular_diagram() {
    // Initialize an object to store sentiment counts for each type of establishment
    const establishmentSentiments = {};

    // Count sentiment occurrences for each type of establishment
    Object.entries(structured_data).forEach(([_, data_user]) => {
        if (data_user.type_etablissement) {
            if (establishmentSentiments[data_user.type_etablissement] == undefined) {
                establishmentSentiments[data_user.type_etablissement] = { positive: 0, negative: 0, neutral: 0 };
            }

            // Count sentiments for each open question
            openQuestions.forEach(question => {
                if (data_user[question]) {
                    data_user[question].chunks.forEach(chunk => {
                        establishmentSentiments[data_user.type_etablissement][chunk.Sentiment] += 1;
                    });
                }
            });
        }
    });

    // Create a circular diagram for each type of establishment
    Object.entries(establishmentSentiments).forEach(([type, sentiments]) => {
        createCircularDiagram(type, sentiments);
    });
}



function buildCircularDiagramContainer() {
    let container = d3.select("#circular-diagram-visualization-container");

    if (container.empty()) {
        container = d3.select("body").append("div")
            .attr("id", "circular-diagram-visualization-container")
            .attr("class", "visualization-container");

        // Add a div for the title and the legend
        const title_legend_div = container.append("div")
            .attr("class", "title-legend");

        container.append("div")
            .attr("class", "diagrams-container");

        // Add a title h2
        title_legend_div.append("h2")
            .attr("class", "title")
            .text("Sentiments by type of establishment");

        // Add a legend
        const legend = title_legend_div.append("div")
            .attr("id", "circular-diagram-legend-container")
            .attr("class", "legend");

        // Add legend items
        const legendItems = [
            { text: "Positive", color: POSITIVE_COLOR },
            { text: "Negative", color: NEGATIVE_COLOR },
            { text: "Neutral", color: NEUTRAL_COLOR }
        ];

        legend.selectAll(".legend-item")
            .data(legendItems)
            .enter().append("div")
            .attr("class", "legend-item")
            .each(function (d) {
                const legendItem = d3.select(this);
                legendItem.append("div")
                    .attr("class", "legend-color")
                    .style("background-color", d.color)
                    // width and height are set in CSS
                    ;
                legendItem.append("span")
                    .attr("class", "legend-text")
                    .text(d.text);
            });


        // Add a div for checkboxes to enable/disable diagrams
        const checkbox_div = title_legend_div.append("div")
            .attr("class", "checkbox-container")
            .attr("id", "circular-diagram-checkbox-container");
    }

    return container;
}


function createCircularDiagram(type, sentiments, radius = 100) {
    // Sanitize type variable
    const sanitizedType = type.replace(/[^a-zA-Z0-9-_]/g, '');

    buildCircularDiagramContainer();

    const checkbox_div = d3.select("#circular-diagram-checkbox-container");
    // Add a checkbox for the current type of establishment to toggle the visibility of the diagram
    const checkbox = checkbox_div.append("label")
        .attr("class", "checkbox-label")
        .text(type)
        .append("input")
        .attr("type", "checkbox")
        .attr("class", "checkbox-input")
        .attr("checked", true)
        .on("change", function () {
            const checked = this.checked;
            const display = checked ? "flex" : "none";
            d3.select(`#circular-diagram-container-${sanitizedType}`).style("display", display);
        });

    const global_circular_diagram_container = d3.select(".diagrams-container");
    const circular_diagram_container = global_circular_diagram_container.append("div")
        .attr("class", "circular-diagram-container")
        .attr("id", `circular-diagram-container-${sanitizedType}`);

    // Define a color scale
    const color = d3.scaleOrdinal()
        .domain(["positive", "negative", "neutral"])
        .range([POSITIVE_COLOR, NEGATIVE_COLOR, NEUTRAL_COLOR]);

    // Create a pie generator
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // Convert sentiments object to an array of key-value pairs
    const sentimentsArray = Object.entries(sentiments).map(([key, value]) => ({ key, value }));

    // Add a title h2
    circular_diagram_container.append("h3")
        .text(type);

    // Create SVG element
    const svg = circular_diagram_container.append("svg")
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .append("g")
        .classed("circular-diagram", true)
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Generate arcs data
    const arcsData = pie(sentimentsArray);

    // Create an arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Draw arcs
    const arcs = svg.selectAll("arc")
        .data(arcsData)
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function (d) {
            // Show value on mouseover
            d3.select(this).select("text").style("display", "block");
        })
        .on("mouseout", function (d) {
            // Hide value on mouseout
            d3.select(this).select("text").style("display", "none");
        });

    // Draw paths
    arcs.append("path")
        .attr("fill", d => color(d.data.key))
        .attr("d", arc);

    // Add emojis
    const emojis = {
        "positive": "\u{1F603}", // Smiling face emoji
        "negative": "\u{1F614}", // Pensive face emoji
        "neutral": "\u{1F610}"   // Neutral face emoji
    };

    arcs.filter(d => d.data.key in emojis)
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .style("display", "none") // Initially hide value
        .html(function (d) {
            return ` <tspan>n : ${d.data.value} </tspan><tspan x="0" dy="1.2em" >(${emojis[d.data.key]})</tspan>`;
        });


}



function map() {

    if (cityCoordinates == undefined) {
        console.error("cityCoordinates is undefined");
    }
    if (france == undefined) {
        console.error("france is undefined");
    }

    let map_container = d3.select("#map-visualization-container");

    if (map_container.empty()) {
        map_container = d3.select("body").append("div")
            .attr("id", "map-visualization-container")
            .attr("class", "visualization-container")
            .attr("style", "height: 100%")
            .style("width", "100%")
            ;

    }

    // Create an SVG element
    const svg = map_container.append("svg");
    svg.attr("id", "map");

    // Function to update the projection
    function updateProjection() {

        // Get the size of the svg
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        // Create a projection
        var projection = d3.geoMercator()
            .fitSize([width, height], france);

        // Define a path generator
        var path = d3.geoPath().projection(projection);

        // Remove existing map elements
        svg.selectAll("path").remove();
        svg.selectAll("circle").remove();
        svg.selectAll("text").remove(); // Remove existing text elements

        // Append new map elements
        svg.selectAll("path")
            .data(france.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", "black");

        // Add red circles using fetched coordinates and city names
        Object.keys(cityCoordinates).forEach(city => {
            // Access the coordinates for the current city
            const coordinates = cityCoordinates[city];
            // Add a red circle for each city using its coordinates
            svg.append("circle")
                .attr("cx", projection([coordinates.lon, coordinates.lat])[0])
                .attr("cy", projection([coordinates.lon, coordinates.lat])[1])
                .attr("r", 5)
                .attr("fill", "red")
                .on("click", function () {
                    showThemes(city);
                });

            // Add text label for the city centered on the circle
            svg.append("text")
                .attr("x", projection([coordinates.lon, coordinates.lat])[0])
                .attr("y", projection([coordinates.lon, coordinates.lat])[1])
                .text(city)
                .attr("text-anchor", "middle") // Center align the text
                .attr("alignment-baseline", "middle") // Center align vertically
                .attr("font-size", "10px")
                .attr("fill", "black")
                .on("click", function () {
                    showThemes(city);
                });
        });

        function showThemes(city) {
            console.log("city :", city);
            title.text("Themes by city : " + city);

            const themes = city_to_themes[city];

            let width = document.getElementById("map-visualization-container").getBoundingClientRect().width / 2;
            let height = document.getElementById("map-visualization-container").getBoundingClientRect().height;

            // Convert the themes object into an array of objects
            let themeArray = Object.entries(themes).map(function ([theme, sentimentCounts]) {
                // Calculate the total count for sentiment types
                const totalCount = sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral;
                // Return an object with sentiment counts scaled for font size
                return {
                    text: theme,
                    size: 10 + (totalCount * 5),
                    sentiment: sentimentCounts
                };
            });

            // Sort the themeArray by size in descending order
            themeArray.sort((a, b) => b.size - a.size);

            // Select the top 50 themes
            themeArray = themeArray.slice(0, 50);

            var layout = d3.layout.cloud()
                .size([width, height])
                .words(themeArray)
                .padding(5)
                .rotate(function () { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function (d) { return d.size; })
                .on("end", draw);

            // Remove existing word cloud if exists
            d3.select("#cloud").remove();

            // append the svg object to the body of the page
            var cloud_svg = cloud_container.append("svg")
                .attr("id", "cloud")
                // .attr("width", width)
                // .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 * 0.9 + "," + height / 2 * 0.9 + ")");

            function draw(words) {
                console.log("Drawing words:", words);

                cloud_svg.selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill", function (d) {
                        // Calculate proportions
                        const totalCount = d.sentiment.positive + d.sentiment.negative + d.sentiment.neutral;
                        const red = d.sentiment.negative / totalCount;
                        const green = d.sentiment.positive / totalCount;
                        const blue = d.sentiment.neutral / totalCount;

                        // Convert proportions to RGB values
                        const color = `rgb(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)})`;

                        return color;
                    })

                    .attr("text-anchor", "middle")
                    .text(function (d) {
                        // Display theme name and sentiment counts
                        // return `${d.text} (Pos: ${d.sentiment.positive}, Neg: ${d.sentiment.negative}, Neu: ${d.sentiment.neutral})`;
                        return `${d.text}`;
                    });
            }

            layout.start(); // Start the layout calculation
        }

        // For each city, get the themes and their sentiments
        city_to_themes = {};
        Object.entries(structured_data).forEach(([_, data_user]) => {
            if (data_user.city != null) {
                if (city_to_themes[data_user.city] == undefined) {
                    city_to_themes[data_user.city] = {}
                }
                Object.entries(data_user).forEach(([question, answer]) => {
                    if (openQuestions.includes(question)) {
                        answer.chunks.forEach(chunk => {
                            if (city_to_themes[data_user.city][chunk.theme] == undefined) {
                                city_to_themes[data_user.city][chunk.theme] = { positive: 0, negative: 0, neutral: 0 };
                            }
                            // Increment sentiment count based on sentiment value
                            city_to_themes[data_user.city][chunk.theme][chunk.Sentiment] += 1;
                        });
                    }
                });
            }
        });

        // Sort the themes within each city by the occurrence of each theme
        Object.keys(city_to_themes).forEach(city => {
            const themes = city_to_themes[city];
            const sortedThemes = Object.entries(themes).sort((a, b) => {
                const totalCountA = Object.values(a[1]).reduce((acc, cur) => acc + cur, 0);
                const totalCountB = Object.values(b[1]).reduce((acc, cur) => acc + cur, 0);
                return totalCountB - totalCountA;
            });
            city_to_themes[city] = Object.fromEntries(sortedThemes);
        });

        // // Log the updated city_to_themes object
        // console.log("city_to_themes:", city_to_themes);
    }


    // Add a div for the title and the legend
    let cloud_container = map_container.append("div")
        .attr("id", "cloud-container");
    const title_legend_div = cloud_container.append("div")
        .attr("class", "title-legend");

    let title = title_legend_div.select("h2");
    if (title.empty()) {
        title = title_legend_div.append("h2")
            .attr("class", "title")

    }
    title.text("Themes by city : ");


    // Add a legend
    const legend = title_legend_div.append("div")
        .attr("class", "legend");

    // Add legend items
    const legendItems = [
        { text: "Positive", color: POSITIVE_COLOR },
        { text: "Negative", color: NEGATIVE_COLOR },
        { text: "Neutral", color: NEUTRAL_COLOR }
    ];

    legend.selectAll(".legend-item")
        .data(legendItems)
        .enter().append("div")
        .attr("class", "legend-item")
        .each(function (d) {
            const legendItem = d3.select(this);
            legendItem.append("div")
                .attr("class", "legend-color")
                .style("background-color", d.color)
                // width and height are set in CSS
                ;
            legendItem.append("span")
                .attr("class", "legend-text")
                .text(d.text);
        });

    // Initial call to updateProjection
    updateProjection();

    // Listen for window resize events to update the projection
    window.addEventListener("resize", updateProjection);

}


