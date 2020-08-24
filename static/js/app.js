// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
function dropdown() {
    var sampleid = d3.select('#selDataset')
    d3.json("data/samples.json").then((importedData) => {
        var data = importedData.names;
        data.forEach(element => {
            sampleid.append('option').text(element).property('value', element)
        });
        var firstid = data[0]
        barchart(firstid)
        getDemoInfo(firstid)
    })

}
function barchart(sampleid) {
    d3.json("data/samples.json").then((importedData) => {
        var data = importedData.samples;
        var filterdata = data.filter(x => x.id == sampleid)
        console.log(filterdata);

        var ids = filterdata[0].otu_ids;
        var samplevalues = filterdata[0].sample_values;
        var labels = filterdata[0].otu_labels;

        // get only top 10
        var toptenIDs = ids.slice(0, 10).map(row => `OTU ${row}`).reverse();
        var toptenValues = samplevalues.slice(0, 10).reverse();
        var toptenLabels = (labels.slice(0, 10)).reverse();

        // Trace1 for the bar data
        var trace1 = {
            x: toptenValues,
            y: toptenIDs,
            text: toptenLabels,
            name: "Top Ten",
            type: "bar",
            orientation: "h"
        };

        // Trace2 for the bubble data
        var trace2 = {
            x: toptenIDs,
            y: toptenValues,
            mode: "markers",
            marker: {
                size: toptenValues,
                color: toptenIDs
            },
            text: toptenLabels
        };

        // // data
        var chartData = [trace1];
        var bubbleData = [trace2];

        var data = [{
            type: 'bar',
            x: [],
            y: [],
            orientation: 'h',
            text: toptenLabels
        }];

        // layout for the bubble plot
        var bubblelayout = {
            title: "Belly Button Data",
            height: 500,
            width: 900
        };

        Plotly.newPlot('bar', chartData, data);
        Plotly.newPlot('bubble', bubbleData, bubblelayout);
    })
}

function getDemoInfo(sampleid) {
    // read the json
    d3.json("data/samples.json").then((importedData) => {
        var metadata = importedData.metadata;

        var filterdata = metadata.filter(y => y.id == sampleid)
        console.log(filterdata);

        // select where to place the data
        var demographicInfo = d3.select("#sample-metadata");

        // reset window
        demographicInfo.html("")

        // demographic data for the id and append the info to the panel body
        result = filterdata[0]
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");
        });
    });
}


function optionChanged(newid) {
    barchart(newid)
    getDemoInfo(newid)
}
dropdown()
