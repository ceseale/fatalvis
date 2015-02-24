'use strict';

var app = angular.module('ibmappApp');

  app.controller('TimemapCtrl', function ($scope) {
  	$scope.acctime = new Date(978325200000);
    $scope.internaltime =  164.3*7;
    $scope.timeincrease = 7*24*6*600000;
    $scope.play = true ;
    $scope.pause = function (){

      d3.selectAll('circle').transition().duration(0);
      $scope.play =  false ;

    }
  	 setInterval(function(){

  	 	$scope.$apply(function(){

      if(Date.parse($scope.acctime) <= 1388552400000 && $scope.play)
  	 	$scope.acctime.setMilliseconds($scope.acctime.getMilliseconds()+($scope.timeincrease) );

  	 	$scope.date = $scope.acctime.toDateString();
  	 	$scope.time = $scope.acctime.toTimeString();
  	 });
// 164.3
  	 },$scope.internaltime)



  
  });


    app.directive('progressBar', function(){
      function link($scope, el, attr){
        el = el[0]
        var width = $(window).width()
        var height = 20
        var mill = d3.scale.linear().domain([978325200000,1388552400000]).range([0,width])
        var inversemill = d3.scale.linear().domain([0,width]).range([978325200000,1388552400000])


        var svg = d3.select(el).append('svg')
          .attr({width: width, height: height})
          .attr( 'id', 'timeplay')
          .style('border', '1px solid black');

        // the inner progress bar `<rect>`
        // the inner progress bar `<rect>`
        var rect = svg.append('rect').style('fill', 'blue');
        var count = 0 ;

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])

          
          svg.call(tip);

      svg.on('mousemove', function(){
         var coordinates = [0, 0];
          coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          tip.attr({x:coordinates[0] , y: rect.attr("height") })
          var bartime = (new Date(Math.floor(inversemill(x))))
           tip.html(function(d) {
            return "<br/>Go to: " + bartime.toDateString() + "<br/> " + bartime.toTimeString() ;
          })
          tip.show()
          
      })


        ;
      svg.on('mouseout', tip.hide);

        svg.on("click", function() {
          
           
         var coordinates = [0, 0];
          coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          $scope.acctime = new Date(Math.floor(inversemill(x)));

        });
        $scope.$watch('acctime', function(acctime){
             
          rect.attr({x: 0, y: 0, width: mill(Date.parse(acctime)) , height: height });

        },true)

      }

      return {
        link: link,
        restrict: 'E'
      };
    });

 app.directive('googleTime', function(){
  	function link($scope, el ){

var colorDead, colorAcci, lngDim, latDim, projection, overlay, padding, mapOffset, weekDayTable, gPrints, monthDim, weekdayDim, hourDim, map, barAcciHour, styledMap, initMap, transform, ifdead, setCircle, initCircle, tranCircle, updateGraph;
colorDead = '#de2d26';
colorAcci = 'rgb(255, 204, 0)';
lngDim = null;
latDim = null;
projection = null;
overlay = null;
padding = 5;
mapOffset = 4000;
weekDayTable = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
gPrints = null;
monthDim = null;
weekdayDim = null;
hourDim = null;
map = null;
barAcciHour = null;
var overlayed = false ;
var pastzoom ; 
var zoom_changed = false ;			     //0.4
var radiusTable = [0.1, 0.2, 0.3,0.34,0.38,1, 0.41,0.5,0.55,0.74,0.95, 1.5,4.1,4.8,4.1,4.66,6.85,7.0,8.43,9.9,40.99];
var rad ; 
var radzoom = 0;
var startzoom = 6;
var outofbounds;
var safetyW;
var safetyH;
    var overlaynorthEast;
    var overlaysouthWest;
    var data20000 = []; 
    var timeDim = null ;


        var styledMap = new  google.maps.StyledMapType([
    {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#193341'
            }
        ]
    },
    {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#2c5a71'
            }
        ]
    },
    {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#29768a'
            },
            {
                'lightness': -37
            }
        ]
    },
    {
        'featureType': 'poi',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#406d80'
            }
        ]
    },
    {
        'featureType': 'transit',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#406d80'
            }
        ]
    },
    {
        'elementType': 'labels.text.stroke',
        'stylers': [
            {
                'visibility': 'on'
            },
            {
                'color': '#3e606f'
            },
            {
                'weight': 2
            },
            {
                'gamma': 0.84
            }
        ]
    },
    {
        'elementType': 'labels.text.fill',
        'stylers': [
            {
                'color': '#3e606f'
            },
            {
                'lightness': 20
            }
        ]
    },
    {
        'featureType': 'administrative',
        'elementType': 'geometry',
        'stylers': [
            {
                'weight': 0.6
            },
            {
                'color': '#1a3541'
            }
        ]
    },
    {
        'elementType': 'labels.icon',
        'stylers': [
            {
                'visibility': 'off'
            }
        ]
    },
    {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [
            {
                'color': '#2c5a71'
            }
        ]
    }
] , { name: 'Styled Map'

 });
initMap = function(){
  // google.maps.visualRefresh = true;



  rad = radiusTable[startzoom];
  map = new google.maps.Map(d3.select('#map').node(), {

    zoom: startzoom,
    center: new google.maps.LatLng(25.7877,  -80.2241),
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeId: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }





  });

  // Add to new directive
   var input = d3.select('#pac-input').node()

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
   var bounds = new google.maps.LatLngBounds();
    if (places.length == 0) {
      return;
    }
       for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);


    
        map.fitBounds(bounds);
        map.setZoom(startzoom);
    }
});



pastzoom  = map.getZoom();

google.maps.event.addListener(map, 'zoom_changed', function(){
var currentzoomlevel = this.getZoom();
if (currentzoomlevel < startzoom){
	currentzoomlevel = startzoom;
	map.setZoom(currentzoomlevel);
}
radzoom = currentzoomlevel ;
rad = radiusTable[radzoom];
zoom_changed = true ; 

  });

  google.maps.event.addListener(map, 'bounds_changed', function(){
    var bounds, northEast, southWest;
    bounds = this.getBounds();
    radzoom = this.getZoom();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
    searchBox.setBounds(bounds); // For search bias


    return dc.redrawAll();
  });


  google.maps.event.addListener(map, 'dragend', function(){
    var bounds, northEast, southWest;
    bounds = this.getBounds();
    radzoom = this.getZoom();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();


    if (outofbounds( northEast, southWest)){
    	console.log('out');
    	overlay.draw();


    }
   
  });


  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  return overlay.setMap(map);

};



transform = function(d){
  d = new google.maps.LatLng(d.GoogleLat, d.GoogleLng);
  d = projection.fromLatLngToDivPixel(d);
  return d3.select(this).style('left', (d.x - padding) + 'px').style('top', (d.y - padding) + 'px');
};
ifdead = function(it, iftrue, iffalse){
  if (1 > 0) {
    return iftrue;
  } else {
    return iffalse;
  }
};



setCircle = function(it){


  return it.attr({
    'cx': function(it){
      return it.coorx;
    },
    'cy': function(it){
      return it.coory;
    },
    'r' : rad + 'px'
  }).style({
  	'fill':'red',
  	'position': 'absolute',
    'opacity': .9
  })
};


var accidentHappend = function (it){

return it.attr({
    'r': function(it){

      return ifdead(it, rad*32 + 'px', rad*32 + 'px');
    }

}).style({
    'fill': function(it){
      return ifdead(it, 'red', 'red');
    },
    'position': 'absolute',
    'opacity': function(it){
      return ifdead(it, 0, 0);
    }
  }).each('end', function (){
    if ($scope.play){
    d3.select(this).remove();
  }

  });




};

initCircle = function(it){
  return it.style({
    'opacity': 0
  });
};
tranCircle = function(it){
  return it.style({
    'opacity': function(it){
      return ifdead(it, 1, 1);
    }
  });
};

var emstimer = function(it){
return it.ems_arrival;
}


updateGraph = function(){
  var dt;
  dt = gPrints.selectAll('circle').data(monthDim.top(Infinity));
  dt.enter().append('circle').call(setCircle);
  // dt.call(setani);
  dt.transition().duration(emstimer).call(accidentHappend)

  // return dt.exit().remove();
};
d3.csv('./vis2u.csv', function(err, tsvBody){
  var deadData, barPerMonth, barPerWeekDay, barPerHour, barAcciMonth, barAcciWeekDay, ndx, all, acciMonth, acciWeekDay, acciHour, deathMonth, deathWeekDay, deathHour, barMt, barWk, barHr, marginMt, marginWk, marginHr, navls, navidx, nav;

  tsvBody.filter(function(d){

    d.GoogleLng = +d.GoogleLng;
    d.GoogleLat = +d.GoogleLat;
    d.date = new Date(d['year'], d['month'], d['day'], d['hour'], d['minute']);
    // d.dead = +d['drunk_dr'];


    return true;
  });


 function checkoverlay (currentzoom) {
	
	if (zoom_changed & (pastzoom == currentzoom)){
		overlay.draw();

		zoom_changed = false ;
		return true;

	} else if ( (pastzoom == currentzoom) ) {
		return false;
	}
	 else {
		overlay.draw();
		pastzoom = map.getZoom();
		return true;
	}
}

outofbounds = function ( northEast, southWest){
	
    var okay1 = (southWest.lng() > overlaysouthWest.lng()-safetyW*2);
    var okay2 = (southWest.lat() > overlaysouthWest.lat()-safetyH*3);
    var okay3 = (northEast.lng() < overlaynorthEast.lng()+safetyW*2);
    var okay4 = (northEast.lat() < overlaynorthEast.lat()+safetyH*3);
    // console.log((okay1 && okay2 && okay3 && okay4));
    if (okay1 && okay2 && okay3 && okay4){
		return false ;
		}
		else {
		return true; 
			}

}

var randomCrash = function (){

if (data20000.length == 0 ){
data20000 = _.sample(monthDim.top(Infinity),1000);
return data20000;
} else {
return data20000;

}


};


  overlay = new google.maps.OverlayView();

  overlay.onRemove = function (){
d3.select("circle")
       .remove();

  };

  overlay.onAdd = function(){
  	console.log("count")
    var layer, svg;
    layer = d3.select(this.getPanes().overlayLayer).append('div').attr('class', 'stationOverlay');
    svg = layer.append('svg');
    gPrints = svg.append('g').attr({
      'class': 'class',
      'gPrints': 'gPrints'
    });
    svg.attr({
      'width': mapOffset * 2,
      'height': mapOffset * 2
    }).style({
      'position': 'absolute',
      'top': -1 * mapOffset + 'px',
      'left': -1 * mapOffset + 'px'
    });
  

    return overlay.draw = function(){

    	// making internal data so overlay doesn't redraw everything
    	var _data = null;
    	// filtering out bounds 
    var overlaybounds = map.getBounds();

    overlaynorthEast = overlaybounds.getNorthEast();
    overlaysouthWest = overlaybounds.getSouthWest();
    


    safetyW = ( overlaynorthEast.lng() - overlaysouthWest.lng() )
    safetyH = ( overlaynorthEast.lat() - overlaysouthWest.lat() )

    lngDim.filterRange([overlaysouthWest.lng()-safetyW*2 , overlaynorthEast.lng()+safetyW*2 ]);
    latDim.filterRange([overlaysouthWest.lat()-safetyH*3, overlaynorthEast.lat()+safetyH*3]);
  //  console.log('here');
 //    	if(data20000.length == 0 ){
 //    	lngDim.filterAll();
	// 	latDim.filterAll();
	// }
	timeDim.filterAll();
	  _data = monthDim.top(Infinity);//randomCrash();
      var googleMapProjection, dt;
      projection = this.getProjection();
      googleMapProjection = function(coordinates){
        var googleCoordinates, pixelCoordinates;
        googleCoordinates = new google.maps.LatLng(coordinates[0], coordinates[1]);
        pixelCoordinates = projection.fromLatLngToDivPixel(googleCoordinates);
        return [pixelCoordinates.x + mapOffset, pixelCoordinates.y + mapOffset];
      };

      _data.filter(function(it){
        var coor;
        coor = googleMapProjection([it.GoogleLat, it.GoogleLng]);
        it.coorx = coor[0];
        it.coory = coor[1];

        return true;
      });
 //      dt = gPrints.selectAll('circle').data(_data);
 //      dt.enter().append('circle'); //.call(setCircle)
 //      dt.call(setCircle);
 //      // dt.call(setani);
	//   dt.transition().duration(2000).call(accidentHappend);
 //      //  returning the bounds 
	var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();
     var timeint =  Date.parse($scope.acctime)+($scope.timeincrease);
    (timeDim.filterRange([$scope.acctime, new Date(  timeint )]));
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
   
    // return dt.exit().remove();

    };
    

  };
  // barPerMonth = dc.barChart('#DeathMonth');

  barAcciMonth = dc.barChart('#AcciMonth');
  // countygraph 

  ndx = crossfilter(tsvBody);

  all = ndx.groupAll();
  timeDim = ndx.dimension(function(it){
  	return it.date;
  });



  monthDim = ndx.dimension(function (it){
    return Number( it['month']);
  });

   // var dateDimension = ndx.dimension(function (it) {
   //      return it.date;
   //  });

  // weekdayDim = ndx.dimension(function(it){
  //   return it.week;
  // });
  // hourDim = ndx.dimension(function(it){
  //   return Number( it['hour'] ) ;
  // });
  lngDim = ndx.dimension(function(it){
    return it.GoogleLng;
  });
  latDim = ndx.dimension(function(it){
    return it.GoogleLat;
  });
  acciMonth = monthDim.group().reduceCount();

  // deathMonth = monthDim.group().reduceSum(function(it){
  //   return it.dead;
  // });


  $scope.$watch('acctime', function (){


  var timeint =  Date.parse($scope.acctime)+($scope.timeincrease);
   (timeDim.filterRange([$scope.acctime, new Date(  timeint )]));

   updateGraph();
   return dc.redrawAll();

   
  },true);





  barMt = 350;
  barWk = 270;
  barHr = 550;
  marginMt = {
    'top': 10,
    'right': 10,
    'left': 30,
    'bottom': 20
  };
  marginWk = marginMt;
  marginHr = marginMt;



 //  barPerMonth.width(barMt).height(100).margins(marginMt).dimension(monthDim).group(deathMonth).x(d3.scale.ordinal().domain(d3.range(1, 13))).xUnits(dc.units.ordinal).elasticY(true).on('filtered', function(c, f){

 //    if ( !checkoverlay(map.getZoom())) {
 //    return updateGraph();
	// }
 //  }).yAxis().ticks(3);

  barAcciMonth.width(barMt).height(100).margins(marginMt).dimension(monthDim).group(acciMonth).x(d3.scale.ordinal().domain(d3.range(1, 13))).xUnits(dc.units.ordinal).elasticY(true).on('filtered', function(c, f){
	
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
	}
  }).yAxis().ticks(4);

  dc.renderAll();
  initMap();

});

  google.maps.event.addDomListener(window, 'load', initMap);

  	}
  	return {

  		link : link, 
  		restrict: 'E'

  	}


  })
 