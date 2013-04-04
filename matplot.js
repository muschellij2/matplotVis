function HealthvisMatplot() {
 
    this.init = function(elementId, d3Params){
 
    // Create your div
    this.div = d3.select('#main');
 
    // Initialize variables
    this.json = d3Params.json;
    this.dropouts = d3Params.dropouts;

    this.json = JSON.parse(this.json);
    console.log("this.json", this.json);
    // console.log("obj", obj);
    console.log("this.dropouts", this.dropouts);
    this.n =d3Params.n;

 
    };
  

      var width = 960,
          size = 150,
          padding = 19.5;
       
      var x = d3.scale.linear()
          .range([padding / 2, size - padding / 2]);
       
      var y = d3.scale.linear()
          .range([size - padding / 2, padding / 2]);      

       
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(5);
       
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5);
       
      var color = d3.scale.category10(); 

    this.visualize = function(){



    // Set up your visualization area here.
    var data= this.json;
    console.log("data", data);
    var n = this.n;

      // console.log("data", data);
      // console.log(typeof data);
      // str.match(d.match("species", "type"))
      // list of factors from R
      var dropouts = this.dropouts;
      dlist = {};
      for(var i=0; i<dropouts.length;i++){dlist[dropouts[i]]="";}
      console.log("dlist", dlist);
      
      var domainByTrait = {},
          traits = d3.keys(data[0]).filter(function(d) { 
            //console.log("strmatch", d.match("species"));
            //console.log("d!== species logical:", d !== "species");
            //console.log("new test", !(d in b));
            return !(d in dlist); }),
          n = traits.length;
          console.log("n = ", n);
          console.log("csv traits=", traits);
      traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
      });

      this.domainByTrait = domainByTrait;
      this.traits = traits;
      // console.log("csv domain", domainByTrait)

     
      xAxis.tickSize(size * n);
      yAxis.tickSize(-size * n);
     
      var brush = d3.svg.brush()
          .x(x)
          .y(y)
          .on("brushstart", brushstart)
          .on("brush", brushmove)
          .on("brushend", brushend);
     
      var svg = this.div.append("svg")
          .attr("width", size * n + padding)
          .attr("height", size * n + padding)
        .append("g")
          .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
     
      svg.selectAll(".x.axis")
          .data(traits)
        .enter().append("g")
          .attr("class", "x axis")
          .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
          .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });
     
      svg.selectAll(".y.axis")
          .data(traits)
        .enter().append("g")
          .attr("class", "y axis")
          .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
          .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });
      
      this.svg = svg;

      var column = this.dropouts[0];
      var cell = svg.selectAll(".cell")
          .data(cross(traits, traits))
        .enter().append("g")
          .attr("class", "cell")
          .attr("transform", function(d) { 
            // console.log("d", d);
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; 
          })
          .each(plot);
     
      // Titles for the diagonal.
      cell.filter(function(d) { return d.i === d.j; }).append("text")
          .attr("x", padding)
          .attr("y", padding)
          .attr("dy", ".71em")
          .text(function(d) { return d.x; });
      
      function plot(p) {
        var cell = d3.select(this);
     
        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);
     
        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);
     
        cell.selectAll("circle")
            .data(data)
          .enter().append("circle")
            .attr("cx", function(d) { 
              // console.log("x", x);
              // console.log("d", d);
              // console.log("p", p);
              return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 3)
            .style("fill", function(d) { 
              //console.log("dcolumn", d[column]);
              return color(d[column]); 
            });
     
        cell.call(brush);
      }

     
      var brushCell;
     
      // Clear the previously-active brush, if any.
      function brushstart(p) {
        if (brushCell !== p) {
          cell.call(brush.clear());
          x.domain(domainByTrait[p.x]);
          y.domain(domainByTrait[p.y]);
          brushCell = p;
        }
      }
     
      // Highlight the selected circles.
      function brushmove(p) {
        var e = brush.extent();
        svg.selectAll("circle").classed("hidden", function(d) {
          return e[0][0] > d[p.x] || d[p.x] > e[1][0]
              || e[0][1] > d[p.y] || d[p.y] > e[1][1];
        });
      }
     
      // If the brush is empty, select all circles.
      function brushend() {
        if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
      }
     
      function cross(a, b) {
        console.log("a=", a);
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
      }
     
      d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
 
    };
 
    this.update = function(formdata){
    
    var data= this.json;
    var column = formdata[0].value;
    console.log("colll", column)
    // formdata contains the current state of the sidebar form.
    // Parse it and use it to update your visualization.
       var cell = this.svg.selectAll("circle")
            .transition()
            .style("fill", function(d) { 
              //console.log("dcolumn", d[column]);
              return color(d[column]);
            });       
        // .enter()
     
    // var par1 = formdata[0].value;
    // var par2 = formdata[1].value;
 
    // this.grid.transition()...;
 
    };
}
 
healthvis.register(new HealthvisMatplot());