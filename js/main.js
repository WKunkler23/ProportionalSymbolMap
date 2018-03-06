function createMap(){
    
    var first_layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributers</a>'
});
    
    var NorthEastCorner = L.latLng(35.787743, -78.644257);
    var SouthWestCorner = L.latLng(47.650589, -100.437012);

    var Topo_Layer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
    
    var blackWhite_Layer =  L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
    
   
   var FortWayne = L.marker([41.093842, -85.139236]).bindPopup("1: Education and HealthCare, 2: Construction, 3: Manufactoring ");
    
    var Toledo = L.marker([41.651031, -83.541939]).bindPopup("1: trade transportation and utilities, 2: Manufacturing, 3: government");
    
    var SpringField = L.marker([39.801717, -89.643711]).bindPopup("1: Public Admin, 2: Utilities, 3: Healthcare & social assistance");
    
    var Peoria = L.marker([40.703545, -89.579086]).bindPopup("1: Trade Transportation Utilities, 2: Education and Health Services, 3: Leisure and hospitality");
    var Chicago = L.marker([41.881832, -87.623117]).bindPopup("1: Manufacturing, 2: Chemical Manufactoring, 3: printing");
    var Detroit = L.marker([42.331429, -83.045753]).bindPopup("1: Technology, 2: Bioscience, 3: auto manufacturing");
    var Madison = L.marker([43.0730517, -89.4012302]).bindPopup("1: Agribusiness, 2: Health care, 3: Insurance");
    var Milwuake= L.marker([43.038902, -87.906471]).bindPopup("1: Auto manufacturing, 2: Insurance, 3: Contract Employment");
    var StLouis = L.marker([38.627003, -90.199402]).bindPopup("1: Bioscience, 2: Health care, 3: Education");
    var Indianapolis = L.marker([39.768826, -86.168968]).bindPopup("1: Trade, 2: transportation and utilities, 3: professional and business services	governmen");
    var Cincinnati = L.marker([39.103119, -84.512016]).bindPopup("1: advanced energy, 2: advanced manufactoring, 3: BioHealth");
    var Cleveland = L.marker([41.505493, -81.68129]).bindPopup("1: Auto manufacturing, 2: Banking and Finance, 3: Electric and Lighting");
    
    var Columbus = L.marker([40.367474, -82.996216]).bindPopup("1: Auto manufacturing, 2: Insurance, 3: Data Centers");
    
    var DesMoines = L.marker([41.619549, -93.598022]).bindPopup("1: Advanced Manufactoring, 2: Agbioscience, 3: Data Centers");
    
    var Minn = L.marker([44.986656, -93.258133]).bindPopup("1:Biosiences, 2: Manufactoring, 3: Data Centers");
    
    
    //create layer group for overlay
    var cities = L.layerGroup([Chicago, Detroit, Madison, Milwuake, StLouis, Indianapolis, Cincinnati, Cleveland, Columbus, DesMoines, Minn, Peoria, SpringField, Toledo, FortWayne]);
    
    //creates our basemaps
    var baseMaps = {
        "OpenStreetMap": first_layer,
        "Topo_Layer": Topo_Layer,
        "Landscape_Layer": blackWhite_Layer
    };
    //text for our overlay data
    var overLayData = {
        "Largest Economic Sectors": cities
    };
    
//creates our map with zoom and panning options as well as layer groups
var mymap = L.map("mapid", {
                  zoomDelta: 0.1,
                  zoomSnap: 0,
                  doubleClickZoom: false,
                  touchZoom: true,
                  maxBounds: L.latLngBounds(SouthWestCorner, NorthEastCorner),
                  inertia: true,
                  layers: [first_layer, Topo_Layer, blackWhite_Layer]
                  }).setView([41.881832
, -87.623117], 6);

    



    L.control.layers(baseMaps, overLayData).addTo(mymap);
    
    //calls our ajax function to get our data
getData(mymap);
};

//creates our legend and updates the size of our svg icon based on the value of
//the unemployment rate attribute
function createLegend(map, attributes){
    //creates our legend in the bottom right of the map
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        
        //our function which adds the a legend-control-container class and 
        //our temporal legend
        onAdd: function (map){
            var container = L.DomUtil.create('div', 'legend-control-container');
            
            $(container).append('<div id="temporal-legend">');
            
            var svg = '<svg id="attribute-legend" width="180px" height="180px">';
            
            
            var circles = ["max", "mean", "min"];
           // var values = getCircleValues(map, attributes);
            for(var i=0; i < circles.length; i++){
                svg += '<circle class="legend-circle" id="' + circles[i] + '" fill="#0000ff" fill-opacity="0.8" stroke="#000000" cx="30"/>';
                
                //svg += '<text id="' + circles[i] + '-text" x="65" y="' +circles[i] +'"></text>';
            };
           
            
            svg += "</svg>";
            
            
            $(container).append(svg);
            return container;
        }
    });
    
    
    map.addControl(new LegendControl());
    updateLegend(map, attributes);
};

//function returns values of circles for legend
function getCircleValues(map, attribute){
    //start out with generic values
    var min = 5.5,
        max = 5.7
        mean = 5.6;
    //calculates the max, mean, and min for the data based on the year
    map.eachLayer(function(layer){
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);
            
            if(attributeValue < min){
                min = attributeValue;
            };
            
            if(attributeValue > max){
                max = attributeValue;
                
            };
        };
    });
    
    var mean = (max + min) / 2;
  
    return {
        max: max,
        mean: mean, 
        min: min
    };
};

//updates our legend by changing the size of our proportional symbols
function updateLegend(map, attribute){
    //var year = attribute.split("_")[1];
    
    var content = "Unemployment Rate from 1992-2016";
    $('#temporal-legend').html(content);
    console.log(attribute);
    var circleValues = getCircleValues(map, attribute);
    
    for(var key in circleValues){
        var radius = calcPropRadius(circleValues[key]);
        console.log(radius);
        $('#'+key).attr({
            cy: 60 - radius,
            r: radius
        });
        
        $('#'+ key +'-text').text(circleValues[key] + " Percent");
        
    };
    
};







//function creates our proportional symbols
function createPropSymbols(data, map, attributes){
    //sets our color and size options initially
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#0000ff",
        color: "#000",
        
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    //calculates the size of our proportional symbol with each iteration
    //through our control sequence
    function calcPropRadius(attValue){
        var scaleFactor = 0.5;
        var area = attValue * scaleFactor;
        var radius = Math.sqrt(area/Math.PI);
        return radius;
    };

    //returns our circle markers with the symbolization options at default
    L.geoJson(data, {
            pointToLayer: function(feature, latlng){ 
            
            return L.circleMarker(latlng, geojsonMarkerOptions);
    
                
            //pointToLayer(feature, latlng, attributes);   
        }
        
    }).addTo(map);
    
};



//function allows for us to adjust the markers
function calcPropRadius(attValue){
        var scaleFactor = 50;
        var area = attValue * scaleFactor;
        var radius = Math.sqrt(area/Math.PI);
        return radius;
    };


//assigns the first attribute
function pointToLayer(feature, latlng, attributes){
    var attribute = attributes[0];
    console.log(attribute);
}

//creates the sequence controls by adding a range and button classes
function createSequenceControls(map, attributes){
    $('#Unemployment_Query').append('<button class="skip" id="reverse">Reverse</button>');
    $('#Unemployment_Query').append('<button class="skip" id="forward">Skip</button>');
    $('#Unemployment_Query').append('<input class="range-slider" type="range">');
    
    //sets the default values of our range class
    
    $('.range-slider').attr({
        max: 12,
        min: 1,
        value: 0,
        step: 1
    });
    
    
    //sets up a listener that changes the value of our index based on
    //our clicks to the range slider
   $('.skip').click(function(){
       var index = $('.range-slider').val();
       
       if ($(this).attr('id') == 'forward'){
           index++;
           index = index > 12 ? 1 : index;
       } 
        else if ($(this).attr('id') == 'reverse'){
           index--;
           index = index < 1 ? 12 : index;       
       };
       
       //updates our range slider and our symbol
       
      $('.range-slider').val(index);
       //console.log(attributes[index2].split("_")[0]);
       updatePropSymbols(map, attributes[index]);
   });
    

    $('.range-slider').on('input', function(){
       var index = $(this).val();
       updatePropSymbols(map, attributes[index]); 
    });
    
};

//this function updates the size of our proportional symbols based on the value of
//the attribute
function updatePropSymbols(map, attribute){
    
    map.eachLayer(function(layer){
        if(layer.feature && layer.feature.properties[attribute]){
        
            var props = layer.feature.properties;
            
            var radius =  calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            
            
            var popupContent = "<p><b>City:</b> " + props["City"] + "</p>";
            
            popupContent += "<p><b>Mayor:</b> " + props["Mayor_" + attribute.split('_')[1]] + "</p>";
            
            var year = attribute.split('_')[1];
            
            popupContent += "<p><b>Unemployment Rate in " + year + ":</b> " + props[attribute] + "</p>";
            layer.bindPopup(popupContent);
            
            layer.on({
                    mouseover: function(){
                        this.openPopup();
                    },
                    mouseout: function(){
                        this.closePopup();
                    }
                });
            
            
            
            } 
    
    });
    
    //update our legend with min, mean, and max
    // of the updated values of our proportional symbols
    updateLegend(map, attribute);
    };

        
    

//get the attributes for our data      
function processData(data){
    var attributes = [];
    var properties = data.features[0].properties;
    
    for (var attribute in properties){
        if(attribute != "City"){
        attributes.push(attribute);
        
    }
    };
    
    console.log(attributes);
    return attributes;
    
};


 
//our ajax call which retrieves our data and creates the map and legend
function getData(map){
    $.ajax("data/MidWesternCities5.geojson", {
        dataType: "json",
        success: function(response){
        
        var attributes = processData(response);
            
        createPropSymbols(response, map, attributes);
        createSequenceControls(map, attributes);
        createLegend(map, attributes);
        
            
        }
        
    });
};
window.onload = createMap();