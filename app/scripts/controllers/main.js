/*google*/
/*d3*/
/*crossfilter*/
'use strict';

/**
 * @ngdoc function
 * @name ibmappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ibmappApp
 */
var app = angular.module('ibmappApp');
  app.controller('MainCtrl', function ($scope) {

  });


  app.directive('googleVis', function(){
  	function link(scope, el ){

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
var radiusTable = [0.1, 0.2, 0.3,0.34,0.38,1, 0.41,0.5,0.55,0.74,0.95, 1.5,2.1,2.8,3.1,3.66,3.85,4.0,4.43,5.9,6.99];
var rad ; 
var radzoom = 0;
var startzoom = 12;
var outofbounds;
var safetyW;
var safetyH;
    var overlaynorthEast;
    var overlaysouthWest;
    var data20000 = []; 
    var infoWindow;
    var infoWindow2;
  var rect1_mean ;
  var rect2_mean ;
  var rect1_var ;
  var rect2_var ;
  var rect1_n ;
  var rect2_n ;
  // scope.t_value = null; 
  var rectangle;
  var rectangle2;



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

  var bounds2 = new google.maps.LatLngBounds(
    new google.maps.LatLng(25.748781939750618, -80.21240599060059),
    new google.maps.LatLng(25.77087930591169, -80.18184391784666)
      
  );

 // Define a rectangle and set its editable property to true.
  rectangle = new google.maps.Rectangle({
    bounds: bounds2,
    draggable: true,
    editable: true
  });

  rectangle.setMap(map);

    rectangle2 = new google.maps.Rectangle({
    bounds: bounds2,
    draggable: true,
    editable: true
  });

  rectangle2.setMap(map);

    // Add an event listener on the rectangle.
  google.maps.event.addListener(rectangle2, 'bounds_changed', showNewRect2);
  google.maps.event.addListener(rectangle, 'bounds_changed', showNewRect);

  // Define an info window on the map.
  infoWindow = new google.maps.InfoWindow();
  infoWindow2 = new google.maps.InfoWindow();

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




// Show the new coordinates for the rectangle in an info window.
/** @this {google.maps.Rectangle} */
function showNewRect(event) {
  var ne = rectangle.getBounds().getNorthEast();
  var sw = rectangle.getBounds().getSouthWest();
  lngDim.filterRange([sw.lng(), ne.lng()]);
  latDim.filterRange([sw.lat(), ne.lat()]);
  var inner1 = monthDim.top(Infinity);

  rect1_mean = d3.mean(inner1, function(ob){
    return ob.drunk_dr;
  })

 rect1_var = d3.variance(inner1, function(ob){
    return ob.drunk_dr;
  })


rect1_n = inner1.length;




  var contentString = '<b>Stat Tester</b><br>' +
      'Inner mean: ' + rect1_mean + '<br>' +
      'Deviation: ' + Math.sqrt(rect1_var) + '<br>' +
      'Sample Size: ' + rect1_n;


  // Set the info window's content and position.
  infoWindow.setContent(contentString);
  infoWindow.setPosition(ne);

//Returning bounds
    var bounds, northEast, southWest;
    bounds = map.getBounds();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
ttest();
  infoWindow.open(map);
 

}

/** @this {google.maps.Rectangle} */
function showNewRect2(event) {
  var ne = rectangle2.getBounds().getNorthEast();
  var sw = rectangle2.getBounds().getSouthWest();
  lngDim.filterRange([sw.lng(), ne.lng()]);
  latDim.filterRange([sw.lat(), ne.lat()]);
  var inner2 = monthDim.top(Infinity);

  rect2_mean = d3.mean(inner2, function(ob){
    return ob.drunk_dr;
  })

 rect2_var = d3.variance(inner2, function(ob){
    return ob.drunk_dr;
  })


rect2_n = inner2.length;


  var contentString = '<b>Stat Tester</b><br>' +
      'Inner mean: ' + rect2_mean + '<br>' +
      'Deviation: ' + Math.sqrt(rect2_var) + '<br>' +
      'Sample Size: ' + rect2_n;



  // Set the info window's content and position.
  infoWindow2.setContent(contentString);
  infoWindow2.setPosition(ne);

//Returning bounds
    var bounds, northEast, southWest;
    bounds = map.getBounds();
    northEast = bounds.getNorthEast();
    southWest = bounds.getSouthWest();
    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);

  infoWindow2.open(map);
  ttest();
}
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

var ttest = function (){
  scope.$apply(function(){
  scope.t_value = (rect1_mean - rect2_mean)/ (Math.sqrt( ((rect1_var/rect1_n) + (rect2_var/rect2_n)) )) ;
});
}

var rect_color = d3.scale.linear().domain([-3,3]).range(['red','black', 'black','red'])
scope.$watch('t_value', function (t_value){

if ( ! (scope.t_value === undefined)){
 rectangle.setOptions({fillColor:rect_color(t_value) })
 rectangle2.setOptions({fillColor:rect_color(t_value) })
}
 

}, true)








transform = function(d){
  d = new google.maps.LatLng(d.GoogleLat, d.GoogleLng);
  d = projection.fromLatLngToDivPixel(d);
  return d3.select(this).style('left', (d.x - padding) + 'px').style('top', (d.y - padding) + 'px');
};
ifdead = function(it, iftrue, iffalse){
  if (it.dead > 0) {
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
    'r': function(it){

      return ifdead(it, rad + 'px', rad + 'px');
    }
  }).style({
    'fill': function(it){
      return ifdead(it, '#de2d26', 'yellow');
    },
    'position': 'absolute',
    'opacity': function(it){
      return ifdead(it, .9, .9);
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

updateGraph = function(){
  var dt;
  dt = gPrints.selectAll('circle').data(monthDim.top(Infinity));
  dt.enter().append('circle').call(setCircle);
  dt.call(setCircle);
  return dt.exit().remove();
};

d3.csv('./vis1u.csv', function(err, tsvBody){
  var deadData, barPerMonth, barPerWeekDay, barPerHour, barAcciMonth, barAcciWeekDay, ndx, all, acciMonth, acciWeekDay, acciHour, deathMonth, deathWeekDay, deathHour, barMt, barWk, barHr, marginMt, marginWk, marginHr, navls, navidx, nav;
  // deadData = [];
  tsvBody.filter(function(d){

    d.GoogleLng = +d.GoogleLng;
    d.GoogleLat = +d.GoogleLat;
    d.date = new Date(d['year'], d['month'], d['day'], d['hour'], d['minute']);
    d.week = weekDayTable[d.date.getDay()];
    d.dead = +d['drunk_dr'];

    // if (d.dead > 0) {
    //   deadData.push(d);
    // }
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
    console.log('here');
 //    	if(data20000.length == 0 ){
 //    	lngDim.filterAll();
	// 	latDim.filterAll();
	// }
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
      dt = gPrints.selectAll('circle').data(_data);
      dt.enter().append('circle'); //.call(setCircle)
      dt.call(setCircle);
      //  returning the bounds 
	var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    lngDim.filterRange([southWest.lng(), northEast.lng()]);
    latDim.filterRange([southWest.lat(), northEast.lat()]);
   
    return dt.exit().remove();

    };
    

  };
  barPerMonth = dc.barChart('#DeathMonth');
  barPerWeekDay = dc.barChart('#DeathWeekDay');
  barPerHour = dc.barChart('#DeathHour');
  barAcciMonth = dc.barChart('#AcciMonth');
  barAcciWeekDay = dc.barChart('#AcciWeekDay');
  barAcciHour = dc.barChart('#AcciHour');
  ndx = crossfilter(tsvBody);

  all = ndx.groupAll();
  monthDim = ndx.dimension(function(it){
    return Number( it['month']);
  });
  weekdayDim = ndx.dimension(function(it){
    return it.week;
  });
  hourDim = ndx.dimension(function(it){
    return Number( it['hour'] ) ;
  });
  lngDim = ndx.dimension(function(it){
    return it.GoogleLng;
  });
  latDim = ndx.dimension(function(it){
    return it.GoogleLat;
  });
  acciMonth = monthDim.group().reduceCount();
  acciWeekDay = weekdayDim.group().reduceCount();
  acciHour = hourDim.group().reduceCount();
  deathMonth = monthDim.group().reduceSum(function(it){
    return it.dead;
  });
  deathWeekDay = weekdayDim.group().reduceSum(function(it){
    return it.dead;
  });
  deathHour = hourDim.group().reduceSum(function(it){
    return it.dead;
  });
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
  barPerMonth.width(barMt).height(100).margins(marginMt).dimension(monthDim).group(deathMonth).x(d3.scale.ordinal().domain(d3.range(1, 13))).xUnits(dc.units.ordinal).elasticY(true).on('filtered', function(c, f){

    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
	}
  }).yAxis().ticks(3);
  barPerWeekDay.width(barWk).height(100).margins(marginWk).dimension(weekdayDim).group(deathWeekDay).x(d3.scale.ordinal().domain(weekDayTable)).xUnits(dc.units.ordinal).gap(4).elasticY(true).on('filtered', function(c, f){

    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
	}
  }).yAxis().ticks(3);
  barPerHour.width(barHr).height(100).margins(marginHr).dimension(hourDim).group(deathHour).x(d3.scale.linear().domain([0, 24])).elasticY(true).on('filtered', function(c, f){

    if ( !checkoverlay(map.getZoom())) {

    return updateGraph();
	}
  }).yAxis().ticks(3);
  barAcciMonth.width(barMt).height(100).margins(marginMt).dimension(monthDim).group(acciMonth).x(d3.scale.ordinal().domain(d3.range(1, 13))).xUnits(dc.units.ordinal).elasticY(true).on('filtered', function(c, f){
	
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
	}
  }).yAxis().ticks(4);
  barAcciWeekDay.width(barWk).height(100).margins(marginWk).dimension(weekdayDim).group(acciWeekDay).x(d3.scale.ordinal().domain(weekDayTable)).xUnits(dc.units.ordinal).elasticY(true).gap(4).on('filtered', function(c, f){

    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
	}
  }).yAxis().ticks(4);
  barAcciHour.width(barHr).height(100).margins(marginHr).dimension(hourDim).group(acciHour).x(d3.scale.linear().domain([0, 24])).elasticY(true).on('filtered', function(c, f){
  	  
    if ( !checkoverlay(map.getZoom())) {
    return updateGraph();
	}
  }).yAxis().ticks(4);
  dc.renderAll();
  initMap();
  navls = [
    {
      'ttl': 'Accident Crossfilter',
      'txt': 'Accidents from the Xinzhu area in Taiwan are visualized in the period January to October 2013 – a total of 13,200 accidents and 25+ deaths. Orange represents accidents, and red are accidents where death occurred. </br></br>(Click here to start navigation.)',
      'act': function(){}
    }, {
      'ttl': 'Death by Month – 2013',
      'txt': 'Here are the statistics by months: Orange represents accidents, and red accidents involved a death. Notice that there were no deaths in April, although the accident count is relatively high. (Click here for Day of the Week)',
      'act': function(){
        return d3.selectAll('.fltWeek, .fltHour').transition().style({
          'opacity': 0.2
        });
      }
    }, {
      'ttl': 'Day of the Week',
      'txt': 'Accidents on days of the week are relatively even; however, in our dataset, there were no accidents death on Monday. (Click here for Hour of the Day)',
      'act': function(){
        d3.selectAll('.fltMonth, .fltHour').transition().style({
          'opacity': 0.2
        });
        return d3.selectAll('.fltWeek').transition().style({
          'opacity': 1
        });
      }
    }, {
      'ttl': 'Hour of the Day',
      'txt': 'Accidents decreased after 7 pm, and the lowest number occurred between 0 am to 7 am. When we look at accident deaths, however, 0 am to 7 am is very deadly. To prevent accident deaths, this time period is a good place to start.</br></br>This is interesting, but where exactly are these accidents? (Click here to find out)',
      'act': function(){
        d3.selectAll('.fltMonth, .fltWeek').transition().style({
          'opacity': 0.2
        });
        return d3.selectAll('.fltHour').transition().style({
          'opacity': 1
        });
      }
    }, {
      'ttl': 'Analysis with a Click',
      'txt': 'If you drag your mouse from 0 am to 7 am, all the accidents are highlighted on the map (1 sec response time). Notice that the week and month charts are updated according to your action. (Click here for Crossfilter)',
      'act': function(){
        d3.selectAll('.filter').transition().style({
          'opacity': 1
        });
        return hourDim.filter([0, 8]);
      }
    }, {
      'ttl': 'Crossfilter',
      'txt': 'You can also select multiple criteria, such as the accidents that happened from 0 am to 7 am on weekends. For these criteria, drag your mouse for the timeframe and then click on Saturday and Sunday. (Click here for Geo-Crossfilter)',
      'act': function(){
        return weekdayDim.filter(['Sat', 'Sun']);
      }
    }, {
      'ttl': 'Geo-Crossfilter',
      'txt': 'This also work the other way, we can zoom-in into any part of the map, and the charts will update accordingly. Now we are viewing the area around the train station. (Click here for another Geo-Crossfilter)',
      'act': function(){
        map.setZoom(13);
        return setTimeout(function(){
          map.setZoom(14);
          return setTimeout(function(){
            map.setZoom(15);
            return setTimeout(function(){
              return map.setZoom(16);
            }, 100);
          }, 100);
        }, 100);
      }
    }, {
      'ttl': 'Geo-Crossfilter',
      'txt': 'Now we’re around Chiao Tung University.</br></br>The benefit of programming-generated visualization is that once developed, we just feed in different data to generate an up-to-date graph.</br></br>Start exploring on your own! Zoom in and out use the sliding scale on the left. You can use the directional arrows to move around the map or just drag the map itself from one part of the city to another.',
      'act': function(){
        return map.panTo({
          lat: 24.799232620011438,
          lng: 120.98143010818478
        });
      }
    }
  ];
  navidx = 0;
  (nav = function(){
    var ctn, l;
    ctn = navls[navidx];
    l = navls.length - 1;
    if (navidx > l) {
      return d3.selectAll('.ctn-nav').transition().style({
        'opacity': 0
      });
    } else {
      d3.selectAll('.navttl').text(ctn.ttl);
      d3.selectAll('.navidx').text(navidx + '/' + l);
      d3.selectAll('.navtxt').html(ctn.txt);
      return ctn.act();
    }
  })();
  return d3.selectAll('.ctn-nav').on('mousedown', function(){
    ++navidx;
    return nav();
  });
});

google.maps.event.addDomListener(window, 'load', initMap);
  	}
  	return {

  		link : link, 
  		restrict: 'E'

  	}


  })
 