
disableTextField <- function(session) {
  session$sendCustomMessage(type="jsCode",
                            list(code= "$('#variable_amount')[0].disabled = true;"))  
}

shinyServer(function(input, output, session) {
  
  ProductionFunction <- reactive({
    if(input$productivity == "const"){
      function(Q) Q/input$prod.coeff
    } else if (input$productivity == "dimreturns"){
      function(Q) Q^(1/input$dimreturns.coeff)
    } else {
      function(Q) input$d + input$c*Q + input$b*Q^2 + input$a*Q^3
    }
  })
  
  TotalCostFunction <- reactive({
    function(Q) (input$fixed.rate*input$fixed.amount) + input$variable.cost*eval(ProductionFunction())(Q)
  })
  
  AverageCostFunction <- reactive({
    function(Q) eval(TotalCostFunction())(Q)/Q
  })
  
  MarginalCostFunction <- reactive({ #derivative of TC
    if(input$productivity == "const"){
      function(Q) input$variable.cost/input$prod.coeff
    } else if (input$productivity == "dimreturns"){  
      function(Q) input$variable.cost/input$dimreturns.coeff*Q^(1/input$dimreturns.coeff-1)
    } else {
      function(Q) input$variable.cost*(3*input$a*Q^2+2*input$b*Q+input$c)
    }
  })


  
output$production_plot <- renderProdChart({
  data.frame(
    Index = input$x_axis_range[1]:input$x_axis_range[2],
    Output = round(eval(ProductionFunction())(input$x_axis_range[1]:input$x_axis_range[2]), 
                              digits = 2)
  )
})

output$cost_plot <- renderLineChart({
  data.frame(
    Index = input$x_axis_range[1]:input$x_axis_range[2],
    TC = eval(TotalCostFunction())(input$x_axis_range[1]:input$x_axis_range[2]),
    FC = rep((input$fixed.rate*input$fixed.amount), input$x_axis_range[2]-input$x_axis_range[1]+1),
    VC = eval(TotalCostFunction())(input$x_axis_range[1]:input$x_axis_range[2])-rep((input$fixed.rate*input$fixed.amount), input$x_axis_range[2]-input$x_axis_range[1]+1)
  )
  
})

output$totalcost_plot <- renderLineChart({
  data.frame(
    Index = input$x_axis_range[1]:input$x_axis_range[2],
    TC = eval(TotalCostFunction())(input$x_axis_range[1]:input$x_axis_range[2]),
    FC = rep((input$fixed.rate*input$fixed.amount), input$x_axis_range[2]-input$x_axis_range[1]+1),
    VC = eval(TotalCostFunction())(input$x_axis_range[1]:input$x_axis_range[2])-rep((input$fixed.rate*input$fixed.amount), input$x_axis_range[2]-input$x_axis_range[1]+1)
  )
  
})

output$averagecost_plot <- renderLineChart({ # needs cleaning up
  data.frame(
    Index = input$x_axis_range[1]:input$x_axis_range[2],
    ATC = eval(AverageCostFunction())(input$x_axis_range[1]:input$x_axis_range[2]),
    AFC = rep((input$fixed.rate*input$fixed.amount),input$x_axis_range[2]-input$x_axis_range[1]+1)/input$x_axis_range[1]:input$x_axis_range[2],
    AVC = (eval(TotalCostFunction())(input$x_axis_range[1]:input$x_axis_range[2])-rep((input$fixed.rate*input$fixed.amount), input$x_axis_range[2]-input$x_axis_range[1]+1))/input$x_axis_range[1]:input$x_axis_range[2],
    MC = eval(MarginalCostFunction())(input$x_axis_range[1]:input$x_axis_range[2])
  )
})

observe({
  disableTextField(session)
})

})
