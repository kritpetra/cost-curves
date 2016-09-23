// Based on code obtained from github.com/rstudio/shiny-examples/blob/master/
// 054-nvd3-line-chart-output/www/linechart-binding.js on Mar 7 2016.

(function() {
  
// First create a generic output binding instance, then overwrite
// specific methods whose behavior we want to change.
var costBinding = new Shiny.OutputBinding();
var prodBinding = new Shiny.OutputBinding();
var totalBinding = new Shiny.OutputBinding();
var avgBinding = new Shiny.OutputBinding();

/* COST CURVE GRAPH */
costBinding.find = function(scope) {
  // For the given scope, return the set of elements that belong to
  // this binding.
  return $(scope).find(".nvd3-costcurve");
};

costBinding.renderValue = function(el, data) {
  // This function will be called every time we receive new output
  // values for a line chart from Shiny. The "el" argument is the
  // div for this particular chart.
  
  var $el = $(el);
    
  // The first time we render a value for a particular element, we
  // need to initialize the nvd3 line chart and d3 selection. We'll
  // store these on $el as a data value called "state".
  if (!$el.data("state")) {
    var chart = nv.models.lineChart()
      .margin({left: 100})
      .useInteractiveGuideline(true)
      .transitionDuration(350)
      .showLegend(true)
      .showYAxis(true)
      .showXAxis(true);
      //.color(['red','blue','green'])
      
    chart.xAxis     //Chart x-axis settings
      .axisLabel("Output")
      .tickFormat(d3.format(',r'));
 
    chart.yAxis     //Chart y-axis settings
      .axisLabel('Cost')
      .tickFormat(d3.format('.02f'));
      

      // data is a dictionary with structure as follows --
      //
      //    value: x-axis value (Str)
      //    series: array of data series, each with --
      //       color: color of series in hexadecimal (Str)
      //       key: series name (Str)
      //       value: value of series (Num)


    nv.utils.windowResize(chart.update);
    
    var selection = d3.select(el).select("svg");
    
    // Store the chart object on el so we can get it next time
    $el.data("state", {
      chart: chart,
      selection: selection
    });
  }
  
  // Now, the code that'll run every time a value is rendered...
  
  // Retrieve the chart and selection we created earlier
  var state = $el.data("state");
  
  // Schedule some work with nvd3
  nv.addGraph(function() {
    // Update the chart
    state.selection
      .datum(data)
      .transition(500)
      .call(state.chart);
      
    // Removes extra zeroes from y-axis
    d3.select("#cost_plot g.nv-y g.nv-axisMaxMin text").text("0");
    maxValue = d3.selectAll("#cost_plot g.nv-y g.nv-axisMaxMin + g.nv-axisMaxMin text")
                  .text()
                  .slice(0,-3);
    d3.selectAll("#cost_plot g.nv-y g.nv-axisMaxMin + g.nv-axisMaxMin text")
      .text(maxValue);
    
    d3.selectAll("#cost_plot g.nv-y g.tick text").text(
      function (d) { return d;}
      );
      
        // Adds horizontal line indicating the output
    $el.on("mousemove", function(event){
      
      // Get coordinates for hover point, so we know where to draw our line
      var point_array = $el.find("g.nv-linesWrap g.nv-scatterWrap g.nv-group")
                        .find("circle.hover");
      if( point_array.length > 0 ) {
        var x_coord = point_array.attr("cx");
        var y_coords = point_array
                        .map(function(){
                              return $(this).attr("cy");
                            }).get();
                            
        // Select the guideline layer and add the new horizontal lines
      var lineLayer = d3.select("#cost_plot g.nv-interactiveGuideLine");
      
      for(var i = 0; i < y_coords.length; i++) {
        lineLayer
          .append("line")
          .attr("class", "nv-guideline")
          .attr("x1", 0)
          .attr("x2", x_coord)
          .attr("y1", y_coords[i])
          .attr("y2", y_coords[i]);
      }
        
        
      };
      
      
      
    })
      
    return state.chart;
  });

  
};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(costBinding, "costexercise.nvd3-costcurve");

/* PRODUCTION FUNCTION PLOT */
prodBinding.find = function(scope) {
  return $(scope).find(".nvd3-prodcurve");
};
prodBinding.renderValue = function(el, data) {
  var $el = $(el);
    
  if (!$el.data("state")) {
    var chart = nv.models.lineChart()
      .margin({left: 100})
      .useInteractiveGuideline(true)
      .transitionDuration(350)
      .showLegend(false)
      .showYAxis(true)
      .showXAxis(true);
      
    chart.xAxis     //Chart x-axis settings
      .axisLabel("Input Labor")
      .tickFormat(d3.format(',r.02f'));
 
    chart.yAxis     //Chart y-axis settings
      .axisLabel('Output')
      .tickFormat(d3.format(',r'));

    chart.interactiveLayer.tooltip
      .contentGenerator(function(data){
        
      // data is a dictionary with structure as follows --
      //
      //    value: x-axis value (Str)
      //    series: array of data series, each with --
      //       color: color of series in hexadecimal (Str)
      //       key: series name (Str)
      //       value: value of series (Num)
      
        var text = "<div class='nvtooltip xy-tooltip nv-pointer-events-none'>";
            text += "<table class='nv-pointer-events-none'><tr class='nv-pointer-events-none'>";
            text += "<td class='nv-pointer-events-none'>Input Labor</td><td><strong class='x-value'>";
            text += data.value;
            text += "</strong></td></tr><tr><td>Output</td><td><strong class='x-value'>";
            text += data.series[0].value;
            text += "</strong></td></tr></table></div>";
        return text;
      
      });

    nv.utils.windowResize(chart.update);
    
    var selection = d3.select(el).select("svg");
    
    $el.data("state", {
      chart: chart,
      selection: selection
    });
  }

  var state = $el.data("state");
  
  nv.addGraph(function() {
    state.selection
      .datum(data)
      .transition(500)
      .call(state.chart);
      
    // Adds div that will be updated with values
    /*
    d3.select("div#production_plot")
      .append("div")
          .classed("nvtooltip", false)
          .classed("number-label", true)
          .style("font-weight", "bold");
          */
          

      
      
    // Adds horizontal line indicating the output
    $el.on("mousemove", function(event){
      
      // Get coordinates for hover point, so we know where to draw our line
      var point_array = $el.find("g.nv-linesWrap g.nv-scatterWrap g.nv-group")
                        .find("circle.hover");
                        
      if( point_array.length > 0 ) {
        var x_coord = point_array.attr("cx");
        var y_coord = point_array.attr("cy");
      };
            
      // Select the guideline layer and add a new horizontal line
      d3.select("g.nv-interactiveGuideLine")
        .append("line")
        .attr("class", "nv-guideline")
        .attr("x1", 0)
        .attr("x2", x_coord)
        .attr("y1", y_coord)
        .attr("y2", y_coord);

// I CAN'T RIGHT NOW. I WILL REVISIT THIS LATER
      //var label = d3.select("div#production_plot div.number-label");
      //label
          //.style("top", "500px")
          //.style("left", x_coord+"px")
          //.text(data[0].values[2].x);
    
    // Removes line when mouse is off the plot
    //$el.on("mouseout", function(event){
    //  d3.select("g.nv-interactiveGuideLine line")
    //    .remove();
    //  
    //})  
    })
    
    return state.chart;
  });
};
Shiny.outputBindings.register(prodBinding, "costexercise.nvd3-prodcurve");

/* AVERAGE COST PLOT */
avgBinding.find = function(scope) {
  return $(scope).find(".nvd3-avgcurve");
};
avgBinding.renderValue = function(el, data) {
  var $el = $(el);
    
  if (!$el.data("state")) {
    var chart = nv.models.lineChart()
      .margin({left: 100})
      .useInteractiveGuideline(true)
      .transitionDuration(350)
      .showLegend(true)
      .showYAxis(true)
      .showXAxis(true);
      
    chart.xAxis     //Chart x-axis settings
      .axisLabel("Output")
      .tickFormat(d3.format(',r'));
 
    chart.yAxis     //Chart y-axis settings
      .axisLabel('Cost')
      .tickFormat(d3.format('.02f'));
    
    nv.utils.windowResize(chart.update);
    
    var selection = d3.select(el).select("svg");
    
    $el.data("state", {
      chart: chart,
      selection: selection
    });
  }

  var state = $el.data("state");
  
  nv.addGraph(function() {
    state.selection
      .datum(data)
      .transition(500)
      .call(state.chart);
      
    // Removes extra zeroes from y-axis
    d3.select("#averagecost_plot g.nv-y g.nv-axisMaxMin text").text("0");
    maxValue = d3.selectAll("#averagecost_plot g.nv-y g.nv-axisMaxMin + g.nv-axisMaxMin text")
                  .text()
                  .slice(0,-3);
    d3.selectAll("#averagecost_plot g.nv-y g.nv-axisMaxMin + g.nv-axisMaxMin text")
      .text(maxValue);
    
    d3.selectAll("#averagecost_plot g.nv-y g.tick text").text(
      function (d) { return d;}
      );
    
    // Adds line element when mouse is over the plot
    $el.on("mouseover", function(event){
      d3.select("div#totalcost_plot g.nv-interactiveGuideLine")
        .append("line")
        .attr("class", "nv-guideline");
    })
    
    // Removes line when mouse is off the plot
    $el.on("mouseout", function(event){
      d3.select("div#totalcost_plot g.nv-interactiveGuideLine line")
        .remove();
      d3.select("div#totalcost_plot g.nv-linesWrap g.nv-scatterWrap")
        .selectAll("circle.hover")
        .classed("hover", false);
      
    })
    
    // Watches for mouse movement and updates line of top chart based on bottom
    $el.on("mousemove", function(event){
      
      // Get coordinates for guideline
      var x_coord = $el
        .find("g.nv-interactiveGuideLine")
        .find("line")
        .attr("x1");
      var y_coord = $el
        .find("g.nv-interactiveGuideLine")
        .find("line")
        .attr("y1");
      
      // Add second guideline into the other graph
      d3.select("div#totalcost_plot g.nv-interactiveGuideLine line")
        .attr("x1", x_coord)
        .attr("x2", x_coord)
        .attr("y1", y_coord)
        .attr("y2", 0);


    })
      
    // Highlights the points corresponding to the guideline
    $el.on("mousemove", function(event){
      
      // Get class name for point
      var point_array = $el.find("g.nv-linesWrap g.nv-scatterWrap g.nv-group")
                        .find("circle.hover");
                        
      if( point_array.length > 0 ) {
        var point_class = point_array.attr("class").split(" ")[1];
      };
                        
      // Selects set of points in the other graph
      var other_selection = d3.selectAll("div#totalcost_plot g.nv-linesWrap g.nv-scatterWrap g.nv-group");
      
      // Toggles any existing hover class off
      other_selection
        .selectAll("circle.hover")
        .classed("hover", false);
      
      // Adds a hover class to the relevant points
      other_selection
        .selectAll("circle." + point_class)
        .classed("hover", true);
        
    })
    
    return state.chart;
    
  });
};
Shiny.outputBindings.register(avgBinding, "costexercise.nvd3-avgcurve");

/* TOTAL COST PLOT */
totalBinding.find = function(scope) {
  return $(scope).find(".nvd3-totalcurve");
};
totalBinding.renderValue = function(el, data) {
  var $el = $(el);

  if (!$el.data("state")) {
    var chart = nv.models.lineChart()
      .margin({left: 100})
      .useInteractiveGuideline(true)
      .transitionDuration(350)
      .showLegend(true)
      .showYAxis(true)
      .showXAxis(true);
      
    chart.xAxis     
      .axisLabel("Output")
      .tickFormat(d3.format(',r'));
    chart.yAxis 
      .axisLabel('Cost')
      .tickFormat(d3.format('.02f'));
    
    nv.utils.windowResize(chart.update);
    
    var selection = d3.select(el).select("svg");

    $el.data("state", {
      chart: chart,
      selection: selection
    });
  }
  
 
  var state = $el.data("state");
  
  nv.addGraph(function() {
    state.selection
      .datum(data)
      .transition(500)
      .call(state.chart);
      
    // Removes extra zeroes from y-axis
    d3.select("#totalcost_plot g.nv-y g.nv-axisMaxMin text").text("0");
    maxValue = d3.selectAll("#totalcost_plot g.nv-y g.nv-axisMaxMin + g.nv-axisMaxMin text")
                  .text()
                  .slice(0,-3);
    d3.selectAll("#totalcost_plot g.nv-y g.nv-axisMaxMin + g.nv-axisMaxMin text")
      .text(maxValue);
    
    d3.selectAll("#totalcost_plot g.nv-y g.tick text").text(
      function (d) { return d;}
      );
      
    // Adds line element when mouse is over the plot
    $el.on("mouseover", function(event){
      d3.select("div#averagecost_plot g.nv-interactiveGuideLine")
        .append("line")
        .attr("class", "nv-guideline");
    })
    
    // Removes line and clears points when mouse is off the plot
    $el.on("mouseout", function(event){
      d3.select("div#averagecost_plot g.nv-interactiveGuideLine line")
        .remove();
      d3.select("div#averagecost_plot g.nv-linesWrap g.nv-scatterWrap")
        .selectAll("circle.hover")
        .classed("hover", false);
    })
    
    // Watches for mouse movement and updates line of top chart based on bottom
    $el.on("mousemove", function(event){
      
      var x_coord = $el
        .find("g.nv-interactiveGuideLine")
        .find("line")
        .attr("x1");
      var y_coord = $el
        .find("g.nv-interactiveGuideLine")
        .find("line")
        .attr("y1");
        
      d3.select("div#averagecost_plot g.nv-interactiveGuideLine line")
        .attr("x1", x_coord)
        .attr("x2", x_coord)
        .attr("y1", y_coord)
        .attr("y2", 0);
    })
    
        // Highlights the points corresponding to the guideline
    $el.on("mousemove", function(event){
      
      // Get class name for point
      var point_array = $el.find("g.nv-linesWrap g.nv-scatterWrap g.nv-group")
                        .find("circle.hover");
                        
      if( point_array.length > 0 ) {
        var point_class = point_array.attr("class").split(" ")[1];
      };
                        
      // Selects set of points in the other graph
      var other_selection = d3.selectAll("div#averagecost_plot g.nv-linesWrap g.nv-scatterWrap g.nv-group");
      
      // Toggles any existing hover class off
      other_selection
        .selectAll("circle.hover")
        .classed("hover", false);
      
      // Adds a hover class to the relevant points
      other_selection
        .selectAll("circle." + point_class)
        .classed("hover", true);
        
    })
        
      
    return state.chart;
  });

  
};
Shiny.outputBindings.register(totalBinding, "costexercise.nvd3-totalcurve");

})();
