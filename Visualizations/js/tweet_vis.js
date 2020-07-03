var width = 900;
var height = 540;

var projection = d3.geo.albersUsa();
	//.scale(900);

var color = d3.scale.linear()
	.domain([0, 15])
	.range(['#5b5858', '#4f4d4d', '#454444', '#323131']);

var svg = d3.select('#map').append('svg')
		.attr('width', width)
		.attr('height', height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append('g');

d3.json('json/us-states.json', function(error, topology) {
    g.selectAll('path')
		.data(topojson.feature(topology, topology.objects.usStates).features)
		.enter()
		.append('path')
		.attr('class', function(d){ return 'states ' + d.properties.STATE_ABBR;} )
		.attr('d', path)
		.attr('fill', function(d, i) { return color(i); });

    d3.json('json/blm_geo_tweets.json', function(error2, blmTweets) {
                    // if (error2) {return console.error(error2)}
										blmTweets.forEach(function(d) {
							            d = parseFloat(d);
							        		});
                    console.log(blmTweets)
                    addPointsToMap(blmTweets);
                });

});

var addPointsToMap = function(blmTweets) {
      var colorScale  = d3.scale.category10();

			console.log(blmTweets.sentiment)
			console.log(d3.min(blmTweets.sentiment))

      console.log(d3.extent(blmTweets.sentiment, function(tweet) { return +tweet; }))

      var radiusScale = d3.scale.sqrt()
          .domain(d3.min(blmTweets.sentiment))
          .range([2, 15]);

      // Add the tooltip container to the vis container
      // it's invisible and its position/contents are defined during mouseover
      var tooltip = d3.select("#map").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      // tooltip mouseover event handler
      var tipMouseover = function(d) {
          this.setAttribute("class", "circle-hover"); // add hover class to emphasize

          var color = colorScale(d.CR);
          var html  = "<span style='color:" + color + ";'>" + d.CR + "</span><br/>" +
                      "Count: " + d.TOT + "<br/>Date: " + d.MO + "/" + d.YR;

          tooltip.html(html)
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 28) + "px")
            .transition()
              .duration(200) // ms
              .style("opacity", .9) // started as 0!
      };

      // tooltip mouseout event handler
      var tipMouseout = function(d) {
          this.classList.remove("circle-hover"); // remove hover class

          tooltip.transition()
              .duration(300) // ms
              .style("opacity", 0); // don't care about position!
      };

			console.log(blmTweets.place[0][0][0][0])

      svg.selectAll("circle")
          .data(blmTweets.place)
          .enter()
          .append("circle")
          .attr("fill", function(d) { return colorScale(d.sentiment); })
          .attr("cx", function(d) { return projection([+d[0][0][0][0]])[0]; })
          .attr("cy", function(d) { return projection([[+d[0][0][0][1]]])[1]; })
          .attr("r",  function(d) { return radiusScale(+d.sentiment); })
          .on("mouseover", tipMouseover)
          .on("mouseout", tipMouseout);

      // addLegend(colorScale);
  };
//
// function getData() {
//     //Reading Data into JS
// 		pubnub.history({
// 	    	channel: channel,
// 	    	count: 100,
// 	    	callback: function(messages) {
// 	    		pubnub.each( messages[0], processData );
// 	    		getStreamData();
// 	    	},
// 	    	error: function(error) {
// 	    		console.log(error);
// 	    		if(error) {
// 	    			getStreamData();
// 	    		}
// 	    	}
// 	    });
// 	}
//
// function display1(error, data) {
//   if (error) {
//     console.log(error);
//   }
  //
  // var studio_data = groupData(data)
  //
  // console.log("raw", data)
  //
  // var start_date = new Date("01-01-2002")
  // var end_date = new Date("01-01-2006")
  //
  // myBarChart(start_date, end_date, data)
  //
  // var init_data = topstudios(getInit(start_date, end_date, studio_data), 10)
  //
  // myBubbleChart(".industry-bubbles", init_data)
  //
  // var timelineData = getTimeline(studio_data)
  //
  // myTimeLine(".industry-timeline", timelineData, studio_data)


// }

// d3.json("", display1);
