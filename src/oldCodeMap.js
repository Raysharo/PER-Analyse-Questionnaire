function map0() {
    d3.json("../data/cityCoordinates.json").then(function (cityCoordinates) {

        console.log("cityCoordinates :", cityCoordinates);

        d3.json("../data/regions.geojson").then(function (france) {

            // If container is not defined, create a new one
            let container = d3.select("#chart-container");
            if (container.empty()) {
                container = d3.select("body").append("div")
                    .attr("id", "chart-container");
            }

            // Create an SVG element
            const svg = container.append("svg");
            svg.attr("id", "data-visualization");

            // Function to update the projection
            function updateProjection() {
                // Get the width and height of the container
                const width = container.node().getBoundingClientRect().width;
                const height = container.node().getBoundingClientRect().height;

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
                    const circle = svg.append("circle")
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
            }

            function showThemes(city) {
                console.log("city :", city);

                const themes = city_to_themes[city];

                let width = 400;
                let height = 400;

                var layout = d3.layout.cloud()
                    .size([width, height])
                    .words(Object.entries(themes).map(function ([theme, sentimentCounts]) {
                        // Calculate the total count for sentiment types
                        const totalCount = sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral;
                        // Return an object with sentiment counts scaled for font size
                        return {
                            text: theme,
                            size: 10 + (totalCount * 5),
                            sentiment: sentimentCounts
                        };
                    }))
                    .padding(5)
                    .rotate(function () { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .fontSize(function (d) { return d.size; })
                    .on("end", draw);

                // Remove existing word cloud if exists
                d3.select("#cloud").remove();

                // append the svg object to the body of the page
                var cloud_svg = d3.select("body").append("svg")
                    .attr("id", "cloud")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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

            d3.json("../data/structured_data.json").then(function (data) {
                // For each city, get the themes and their sentiments
                city_to_themes = {};
                Object.entries(data).forEach(([SID, data_user]) => {
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

                // Log the updated city_to_themes object
                console.log("city_to_themes:", city_to_themes);
            });

            // Initial call to updateProjection
            updateProjection();

            // Listen for window resize events to update the projection
            window.addEventListener("resize", updateProjection);
        });
    }).catch(function (error) {
        console.log(error);
    });

}
