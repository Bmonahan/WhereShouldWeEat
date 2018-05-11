var map, infoWindow,service;
var myLatlng ={lat: 44.912704, lng:  -68.687675}
var globalCount = 0;
var geocoder;

var findResButton = document.getElementById('findRes');
var findCafeButton = document.getElementById('findCafe');
var slider = document.getElementById("myRange");
var range = document.getElementById("demo");
document.getElementById('submit').addEventListener('click', function() {
          if(markers.length>0)
            clearMarkers();
          geocodeAddress(geocoder, map);
        });
range.innerHTML = slider.value;

var placeType ='';

var markers=[];
var myLocMarker = [];
var myLocMarkerCount =0;


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatlng,
    zoom: 13
  });
  var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
  var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Here",
      icon:image
  });
  myLocMarker[myLocMarkerCount++]= marker;
  google.maps.event.addListener(marker, 'click', function() {
      var contentString = '<h1>You</h1>';
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
  marker.setMap(map);
  service = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();
}


slider.oninput = function() {
  output.innerHTML = this.value;
}

findResButton.onclick = function() {
  findResButton.disabled = false;
  if(markers.length>0)
    clearMarkers();
  var Parent = document.getElementById('placesList');
  while(Parent.hasChildNodes())
  {
     Parent.removeChild(Parent.firstChild);
  }
  findResturants();
};
findCafeButton.onclick = function() {
  findCafeButton.disabled = false;
  if(markers.length>0)
    clearMarkers();
  var Parent = document.getElementById('placesList');
  while(Parent.hasChildNodes())
  {
     Parent.removeChild(Parent.firstChild);
  }
  findCafe();
};

function findCafe(){
  placeType='cafe'
  var request = {
    location: myLatlng,
    radius: slider.value,
    type: ['cafe']
  };
  service.nearbySearch(request,callback)
}
function findResturants(){
  placeType='restaurant'
  var request = {
    location: myLatlng,
    radius: slider.value,
    type: ['restaurant']
  };
  service.nearbySearch(request,callback)
}
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      type = placeType;
      createMarkers(results[i],type);
    }
  }
  else{
    window.alert("Nothing Found");
  }
}
function createMarkers(place,type) {
  var placesList = document.getElementById("placesList");
  if(!place.types.includes('gas_station')){
    //console.log(place)
    var placeLoc = place.geometry.location;
    if(type=='cafe'){
      var img = 'http://www.advanceduninstaller.com/0bf562902908b10238c874ce0b4042a1-icon.ico';
    }
    if(type=='restaurant'){
      var img = 'spaghetti.png';
    }
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon:img
    });
    markers[globalCount++]=marker;
    google.maps.event.addListener(marker, 'click', function() {
      var contentString = '<h1>'+place.name+
      '</h1><p>'+place.types.toString()+'</p>'+
      '<p>'+place.price_level+'</p>';
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
    var tr = document.createElement('tr');
    tr.textContent = place.name;
    placesList.appendChild(tr);

    marker.setMap(map);
  }
}

function sudoCreateMarker(place){
  var marker = new google.maps.Marker({
      map: map,
      position: place
    });
    marker.setMap(map);
    markers[globalCount++]=marker;
    google.maps.event.addListener(marker, 'click', function() {
      var contentString = '<h1>You</h1>';
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
    marker.setMap(map);
}
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function setMapOnAllCurrLoc(map){
  for (var i = 0; i < myLocMarker.length; i++) {
    myLocMarker[i].setMap(map);
  }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}
function clearCurrLoc(){
  setMapOnAllCurrLoc(null);
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      clearCurrLoc()
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
        icon:image
      });
      myLocMarker[myLocMarkerCount++]=marker;
      myLatlng = results[0].geometry.location;
      google.maps.event.addListener(marker, 'click', function() {
        var contentString = '<h1>You</h1>'+
        '<p>'+results[0].geometry.location+'</p>';
        infowindow.setContent(contentString);
        infowindow.open(map, this);
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  //infoWindow.open(map);
}
function getLocation(pos){
  return pos;
}
// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else { 
//         var x = "Geolocation is not supported by this browser.";
//         console.log(x);
//     }
// }

// function showPosition(position) {
//     var x = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude;
//     //console.log(x);
//     loc = {lat:position.coords.latitude,lng:position.coords.longitude}
//     console.log(loc);
//     return loc;
// }
  // var lati = position.coords.latitude;
  // var long =  position.coords.longitude;
  // pos = {lat:lati,lng:long};
  // return pos;






