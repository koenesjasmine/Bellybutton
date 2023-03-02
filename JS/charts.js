function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("Resources/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  console.log(newSample);
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("Resources/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("Resources/samples.json").then((data) => {
    console.log(data);
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    // Create a variable that holds the first sample in the array.
    var result  = filteredSamples[0]; 
    var array = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    // Create a variable that holds the washing frequency.
    var wfreq = array.wfreq

    // Create the yticks for the bar chart.
    var yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // Create the trace for the bar chart. 
    var barData = {
      y: yticks,
      x: values.slice(0,10).reverse(),
      text: labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    // Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     titlefont: {family: "Arial Black"},
     paper_bgcolor: "#2B919C"
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    //Create the Bubble Chart 

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      mode: "markers",
      text: labels,
      marker:{
        color: ids,
        size: values,
        colorscale: "Picnic"},
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      titlefont: {family: "Arial Black"},
      xaxis: {
      title:'OTU ID'
      },
      height: 480,
      width: 1100,
      hovermode: 'closest',
      paper_bgcolor: "#B9AEC3"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: 'Belly Button Washing Frequency<br> Scrubs per Week'},
        titlefont: {family: "Arial Black"},
        type: "indicator",
        mode: "gauge+number",
        gauge: { 
          axis: { visible: true, range: [0, 10], tickwidth: 2 },
          bar: {color: "black"},
          steps: [
            {range:[0, 2], color: "red"},
            {range:[2, 4], color: "darkorange"},
            {range:[4, 6], color: "yellow"},
            {range:[6, 8], color: "limegreen"},
            {range:[8, 10], color: "green"}
          ]
          },
      }  
    ];
        
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 480,
      height: 450,
      margin: { t: 100, r: 100, l: 100, b: 100 },
      line: {
      color: '600000'
      },
      font: { color: "black", family: "Arial"},
      paper_bgcolor: "#fff"
    };
    
    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}