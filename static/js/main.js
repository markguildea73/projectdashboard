queue()
        .defer(d3.csv, "/data/amb1.csv")
        .await(makeGraphs);
        
    function makeGraphs(error, data) {
        var ndx = crossfilter(data);
        
        // date parsing
        
        var parseDate = d3.time.format("%d/%m/%Y %H:%M").parse;
        data.forEach(function(d){
            d.date = parseDate(d.date);
            d.temp1 = +d.temp1;
            d.temp2 = +d.temp2;
            d.temp3 = +d.temp3;
            d.temp4 = +d.temp4;
            
        });
        
        // charts 
        
        
        show_composite_trend(ndx);
        
        show_scatter_plot(ndx);
        
        show_scatter_plot_2(ndx);
        
        data_list(ndx);
        
        min_Temp(ndx);
        
        
        // render charts
        
        
        
        
    }
    
    //Composite line graph
    function show_composite_trend(ndx){
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        
        
        var temp1Data = date_dim.group().reduceSum(dc.pluck("temp1"));
        var temp2Data = date_dim.group().reduceSum(dc.pluck("temp2"));
        var temp3Data = date_dim.group().reduceSum(dc.pluck("temp3"));
        var temp4Data = date_dim.group().reduceSum(dc.pluck("temp4"));
        
        var compositeChart = dc.compositeChart('.ambient_trend');
        
        compositeChart
            .width(600)
            .height(130)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .y(d3.scale.linear().domain([0,30]))
            .yAxisLabel("Temperature")
            .xAxisLabel("Date")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .elasticX(false)
            .yAxisPadding(5)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(temp1Data, "temp1"),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(temp2Data, "temp2"),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(temp3Data, "temp3"),
                dc.lineChart(compositeChart)
                    .colors('orange')
                    .group(temp4Data, "temp4"),
            ])
            .brushOn(true)
            // .render()
        }
        
        //Scatter Plot with one sensor
        
        function show_scatter_plot(ndx){
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
       
        
        var temp_dim = ndx.dimension(function (d) {
            return [d.date, d.temp1];
            })
        var temp_group = temp_dim.group();
        var temp_chart = dc.scatterPlot(".TBD");
            
            temp_chart
                .width(600)
                .height(130)
                .x(d3.time.scale().domain([minDate, maxDate]))
                .yAxisLabel("Temperature")
                .xAxisLabel("Date")
                .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
                .y(d3.scale.linear().domain([0,30]))
                .renderHorizontalGridLines(true)
                .brushOn(false)
                .symbolSize(2)
                .clipPadding(10)
                .dimension(temp_dim)
                .group(temp_group, "Temp3")

        }
        
        //Scatter Plot composite
        
        function show_scatter_plot_2(ndx){
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
      
    
        
        
        var temp_dim_1 = ndx.dimension(function (d) {
        return [d.date, d.temp1];
        })
        var temp_dim_2 = ndx.dimension(function (d) {
        return [d.date, d.temp2];
        })
        var temp_dim_3 = ndx.dimension(function (d) {
        return [d.date, d.temp3];
        })
        var temp_group_1 = temp_dim_1.group();
        var temp_group_2 = temp_dim_2.group();
        var temp_group_3 = temp_dim_3.group();
        
        var scatter = dc.compositeChart('.TBD');
        
        scatter
            .width(600)
            .height(130)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .y(d3.scale.linear().domain([0,30]))
            .yAxisLabel("Temperature")
            .xAxisLabel("Date")
            .legend(dc.legend().x(80).y(2).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .elasticX(false)
            .compose([
                dc.scatterPlot(scatter)
                    .colors('green')
                    .group(temp_group_1, "temp1")
                    .symbolSize(2)
                    .clipPadding(10),
                dc.scatterPlot(scatter)
                    .colors('red')
                    .group(temp_group_2, "temp2")
                    .symbolSize(2)
                    .clipPadding(10),
                dc.scatterPlot(scatter)
                    .colors('blue')
                    .group(temp_group_3, "temp3")
                    .symbolSize(2)
                    .clipPadding(10)
            ])
            .brushOn(false)
            
         }
         
         //Table code 1
        
        function data_list(ndx){
            d3.csv("data/amb.csv", function(error, data) {
		  if (error) throw error;
		  
		  //console.log(data)
		  
		  var sortAscending = true;
		  var table = d3.select('.ambient_table').append('table');
		  var titles = d3.keys(data[0]);
		  var headers = table.append('thead').append('tr')
		                   .selectAll('th')
		                   .data(titles).enter()
		                   .append('th')
		                   .text(function (d) {
			                    return d;
		                    });
		  
		  var rows = table.append('tbody').selectAll('tr')
		               .data(data).enter()
		               .append('tr');
		  rows.selectAll('td')
		    .data(function (d) {
		    	return titles.map(function (k) {
		    		return { 'value': d[k], 'name': k};
		    	});
		    }).enter()
		    .append('td')
		    .attr('data-th', function (d) {
		    	return d.name;
		    })
		    .text(function (d) {
		    	return d.value;
		    });
	  });
        }
// Table code 2

        function min_Temp(ndx){
            d3.csv("data/amb1.csv", function(error, data) {
		  if (error) throw error;
		  //console.log(data)
		  
		  var minTemp1 = d3.min(data, function(d) {return d.temp1});
		  var maxTemp1 = d3.max(data, function(d) {return d.temp1});
		  var highlowTemp1 = d3.extent(data, function(d) {return d.temp1});
		  var meanTemp1 = d3.mean(data, function(d) {return d.temp1});
		  var staDevTemp1 = d3.deviation(data, function(d) {return d.temp1});
		 
		  //console.log(minTemp1 + " Minimum Tempertaures")
		  //console.log(maxTemp1 + " Maximum Tempertaures")
		  //console.log(highlowTemp1 + " High and low")
		  //console.log(meanTemp1 + " Mean Temperatures")
		  //console.log(staDevTemp1 + " Standard deviation at Temperature 1")
		  
		  var tabulate = function (data,columns) {
          var table = d3.select('.TBD').append('table')
        	var thead = table.append('thead')
        	var tbody = table.append('tbody')
        
        	thead.append('tr')
        	  .selectAll('th')
        	    .data(columns)
        	    .enter()
        	  .append('th')
        	    .text(function (d) { return d })
        
        	var rows = tbody.selectAll('tr')
        	    .data(data)
        	    .enter()
        	  .append('tr')
        
        	var cells = rows.selectAll('td')
        	    .data(function(row) {
        	    	return columns.map(function (column) {
        	    		return { column: column, value: row[column] }
        	      })
              })
              .enter()
            .append('td')
              .text(function (d) { return d.value })
        
          return table;
        }
        
        d3.csv('data/amb1.csv',function (data) {
        	var columns = ['date','temp1','temp2','temp3','temp4']
          tabulate(data,columns)
})
		  
        });
        }
        

        
// summary div will have a drop down choice 
var inPut = document.querySelector("input[name=dropDown]");
var summArray = ["", "Max Temp", "Min Temp", "Mean Temp", "StdDev"]
var selSummary = document.querySelector("select[name=summary]");

document.addEventListener("DOMContentLoaded", function(){
    summArray.forEach(function(item){
        let choice = document.createElement("option");
        choice.value=item
        choice.innerHTML=item
        selSummary.appendChild(choice)
        console.log(choice)
    })
    
})



// User interface options-make the button change from scatter to line graph using JS
