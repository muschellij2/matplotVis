matplotVis <- function(data, ..., plot.title="myplot", plot=TRUE, gaeDevel=TRUE,url=NULL){
  
  #############################
  # R FUNCTIONALITY GOES HERE #
  #############################
  require(RJSONIO)
  classes <-sapply(data, class)
  
  nr <- nrow(data)
  cn <- colnames(data)
  ll <- vector("list", length=nr)
  #   for (irow in 1:nr) ll[[irow]] <- sapply(data[irow,], as.character)
  for (irow in 1:nr) ll[[irow]] <- data[irow,]
  
  dropouts <- cn[classes != "numeric"]
  n <- sum(classes=="numeric")
  js <- toJSON(ll, pretty=TRUE)
#   f <- file("Overlap_Statistics.json")
#   cat(js, file=f)
#   close(f)

  if (length(dropouts) == 1) dropouts <- list(dropouts)
  # Parameters to pass to javascript
  d3Params <- list(json=js,
                   dropouts=dropouts,
                   n = n,
                   ...)
  
  # Form input types and ranges/options
  varType <- c("factor")
  
  varList <- list("variable" = dropouts)
  
  # Initialize healthvis object
  healthvisObj <- new("healthvis",
                      plotType="matplot",
                      plotTitle=plot.title,
                      varType=varType,
                      varList=varList,
                      d3Params=d3Params,
                      gaeDevel=TRUE,
                      url=NULL)
  
  if(plot){
    plot(healthvisObj)
  }
  
  return(healthvisObj)
  
}