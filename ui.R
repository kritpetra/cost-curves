
shinyUI(fluidPage(
  
  # Application title
  titlePanel("Production to Cost"),
  
  # Sidebar with a slider input for number of bins
  sidebarLayout(
    sidebarPanel(width = 4,
                 
                 tags$head(tags$script(HTML('
      Shiny.addCustomMessageHandler("jsCode",
        function(message) {
          console.log(message)
          eval(message.code);
        }
      );
    '))),
                 # CSS code
                 tags$head(
                   tags$link(rel = "stylesheet", type = "text/css", href = "style.css"),
                   tags$script(type = "text/javascript", src = "http://latex.codecogs.com/latexit.js")
                 ),
                 
                 #HTML("<div lang='latex' class='latex-equation'> TC = FC + VC </div>"),
                 ###############################################################
                 wellPanel(
                 h4("Fixed costs"),
                 HTML("<div lang='latex' class='latex-equation'> FC = r \\cdot K </div>"),
                 div(style="display:flex",
                     numericInput("fixed.rate", HTML("Cost per input <span lang='latex'>r</span>"),
                                  min = 0, value = 10),
                     numericInput("fixed.amount", HTML("Input amount <span lang='latex'>K</span>"),
                                  min = 0, value = 50)
                 )),
                 
                 ###############################################################
                 wellPanel(
                 h4("Variable costs"),
                 
                 HTML("<div lang='latex' class='latex-equation'> VC = w \\cdot L(Q) </div>"),
                 
                 div(style="display:flex",
                   numericInput("variable.cost", HTML("Cost per input <span lang='latex'>w</span>"),
                                  min = 0, value = 5),
                   textInput("variable_amount", HTML("Input amount <span lang='latex'>L</span>"),
                             value = "Determined by productivity!")
                 ),
                   div(style="margin:auto;width:75%",
                       hr(),
                       div(
                         radioButtons("productivity", HTML("Productivity"),
                                      choices = c("Constant productivity" = "const",
                                                  "Diminishing returns" = "dimreturns",
                                                  "Increasing then decreasing returns" = "incrdim"))
                         ),
                   
                   
                   conditionalPanel(condition = "input.productivity === 'const'",
                                    HTML("<div lang='latex' class='latex-equation'> Q = \\alpha \\cdot L </div>"),
                                    span(id="marginal_prod_input",
                                    numericInput("prod.coeff", HTML("Marginal product of labor <span lang='latex'>\\alpha</span>"),
                                                 min = 0, max = 20, value = 5))
                   ),
                   conditionalPanel(condition = "input.productivity === 'dimreturns'",
                                    HTML("<div lang='latex' class='latex-equation'>Q=L^{\\beta}</div>"),
                                    div(style="width:75%; margin:auto;",
                                    sliderInput("dimreturns.coeff", HTML("Output elasticity <span lang='latex'>\\beta</span>"),
                                                min = 0.3, max = 1, value = 0.7, step = 0.05)
                                    )
                   ),
                   
                   conditionalPanel(condition = "input.productivity === 'incrdim'",
                                    class = "equation",
                                    div(
                                    HTML("<span lang='latex'>L = </span>")
                                    ),
                                    div(
                                      HTML("<span class='avoidwrap'>"),
                                      numericInput("a", NULL,
                                                   value = 0.002, step = 0.001),
                                      HTML("<span lang='latex'>Q^{3}</span></span><span class='avoidwrap'><span lang='latex'> + </span>"),
                                      numericInput("b", NULL,  
                                                   value = -0.2, step = 0.1),
                                      HTML("<span lang='latex'>Q^{2}</span></span><span class='avoidwrap'><span lang='latex'> + </span>"),
                                      numericInput("c", NULL,
                                                   value = 10, step = 1),
                                      HTML("<span lang='latex'>Q</span></span><span class='avoidwrap'><span lang='latex'> + </span>"),
                                      numericInput("d", NULL, 
                                                   value = 0, step = 1),
                                      HTML("</span>")
                                    )
                 ))), #also would be cool if users can type in their own production function
                 
                 ###############################################################
                 
                 sliderInput("x_axis_range", "Output Range", min = 0, max = 100, 
                             value = c(0,100), step = 1)
    ),
    
    # Show cost curves
    mainPanel(width = 8,
              tabsetPanel(
                tabPanel(title = "Production Function",
                         div(class = "plot_container", style = "display:flex",
                             prodCurveOutput("production_plot", width = "50%", height = "500px"),
                             costCurveOutput("cost_plot", width = "50%", height = "500px")
                         )
                ),
                tabPanel(title = "Total vs. Average Cost Curves",
                         div(class = "plot_container",
                             totalCostOutput("totalcost_plot", width = "100%", height = "300px"),
                             avgCostOutput("averagecost_plot", width = "100%", height = "300px")
                         )
                ) 
                # Instead of having all the numbers appear in one box, what about we
                # make each number appear in separate textboxes, next to their
                # corresponding values on the axes??
                
              )
    )
  )
))
