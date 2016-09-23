# Obtained from github.com/rstudio/shiny-examples/blob/master/054-nvd3-line-chart-output/linechart.R on Mar 7 2016

# To be called from ui.R

prodCurveOutput <- function(inputId, width="100%", height="400px") {
  style <- sprintf("width: %s; height: %s;",
                   validateCssUnit(width), validateCssUnit(height))
  # Include CSS/JS dependencies. Use "singleton" to make sure that even
  # if multiple lineChartOutputs are used in the same page, we'll still
  # only include these chunks once.
  tagList(
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$script(src="nvd3/nv.d3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="nvd3/nv.d3.min.css"),
      tags$script(src="linechart-binding.js")
    )),
    div(id=inputId, class="nvd3-prodcurve svg-container-tab1", style=style,
        tag("svg", list(id = "prodcurve-svg"
#                         class = "svg-content-responsive",
#                         preserveAspectRatio = "xMinYMin meet",
#                         viewBox = "0 0 1000 800"
                        ))
    )
  )
}

costCurveOutput <- function(inputId, width="100%", height="400px") {
  style <- sprintf("width: %s; height: %s;",
                   validateCssUnit(width), validateCssUnit(height))
  
  tagList(

    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$script(src="nvd3/nv.d3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="nvd3/nv.d3.min.css"),
      tags$script(src="linechart-binding.js")
    )),
    div(id=inputId, class="nvd3-costcurve svg-container-tab1", style=style,
        tag("svg", list(id = "costcurve-svg"
#                         class = "svg-content-responsive",
#                         preserveAspectRatio = "xMinYMin meet",
#                         viewBox = "0 0 1000 800"
                        ))
    )
  )
}


totalCostOutput <- function(inputId, width="100%", height="400") {
  style <- sprintf("width: %s; height: %s;",
                   validateCssUnit(width), validateCssUnit(height))
  
  tagList(
    # Include CSS/JS dependencies. Use "singleton" to make sure that even
    # if multiple lineChartOutputs are used in the same page, we'll still
    # only include these chunks once.
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$script(src="nvd3/nv.d3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="nvd3/nv.d3.min.css"),
      tags$script(src="linechart-binding.js")
    )),
    div(id=inputId, class="nvd3-totalcurve svg-container-tab2", style=style,
        tag("svg", list(id = "totalcurve-svg"
#                         class = "svg-content-responsive",
#                         preserveAspectRatio = "xMinYMin meet",
#                         viewBox = "0 0 600 400"
                        ))
    )
  )
}

avgCostOutput <- function(inputId, width="100%", height="400") {
  style <- sprintf("width: %s; height: %s;",
                   validateCssUnit(width), validateCssUnit(height))
  
  tagList(
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$script(src="nvd3/nv.d3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="nvd3/nv.d3.min.css"),
      tags$script(src="linechart-binding.js")
    )),
    div(id=inputId, class="nvd3-avgcurve svg-container-tab2", style=style,
            tag("svg", list(id = "avgcurve-svg"
#                             class = "svg-content-responsive",
#                             preserveAspectRatio = "xMinYMin meet",
#                             viewBox = "0 0 600 400"
                            ))
    )
  )
}


################################################################################

# To be called from server.R
renderLineChart <- function(expr, env=parent.frame(), quoted=FALSE) {
  # This piece of boilerplate converts the expression `expr` into a
  # function called `func`. It's needed for the RStudio IDE's built-in
  # debugger to work properly on the expression.
  installExprFunction(expr, "func", env, quoted)
  
  function() {
    dataframe <- func()
    
    mapply(function(col, name) {
      
      values <- mapply(function(val, i) {
        list(x = i, y = val)
      }, col, dataframe$Index, SIMPLIFY=FALSE, USE.NAMES=FALSE)
      
      list(key = name, values = values)
      
    }, dataframe[-1], names(dataframe)[-1], SIMPLIFY=FALSE, USE.NAMES=FALSE)
  }
}

renderProdChart <- function(expr, env=parent.frame(), quoted=FALSE) {
  installExprFunction(expr, "func", env, quoted)
  
  function() {
    dataframe <- func()
    
    mapply(function(col, name) {
      
      values <- mapply(function(val, i) {
        list(x = val, y = i)
      }, col, dataframe$Index, SIMPLIFY=FALSE, USE.NAMES=FALSE)
      
      list(key = name, values = values)
      
    }, dataframe[-1], names(dataframe)[-1], SIMPLIFY=FALSE, USE.NAMES=FALSE)
  }
}
