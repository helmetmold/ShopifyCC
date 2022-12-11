'use strict';
var selectedLocation = false;
function sendvariable(location,camp)
{
  selectedLocation = true;
  console.log(location + " " + camp);
  var choice = [location,camp];
  window.parent.postMessage(choice,"*");
}

function LocatorPlus(configuration) {
  const locator = this;

  locator.locations = configuration.locations || [];
  locator.capabilities = configuration.capabilities || {};

  const mapEl = document.getElementById('map');
  const panelEl = document.getElementById('locations-panel');
  locator.panelListEl = document.getElementById('locations-panel-list');
  const sectionNameEl =
      document.getElementById('location-results-section-name');
  const resultsContainerEl = document.getElementById('location-results-list');

  const itemsTemplate = Handlebars.compile(
      document.getElementById('locator-result-items-tmpl').innerHTML);

  locator.searchLocation = null;
  locator.searchLocationMarker = null;
  locator.selectedLocationIdx = null;
  locator.userCountry = null;

  // Initialize the map -------------------------------------------------------
  locator.map = new google.maps.Map(mapEl, configuration.mapOptions);
  
  // Store selection.
  const selectResultItem = function(locationIdx, panToMarker, scrollToResult) {
    locator.selectedLocationIdx = locationIdx;
    for (let locationElem of resultsContainerEl.children) {
      locationElem.classList.remove('selected');
      for (let ChildLocationElem of locationElem.children) {
        if(ChildLocationElem.classList.contains("select-camp"))
        {
          ChildLocationElem.classList.remove('selected');
        }
      }
      if (getResultIndex(locationElem) === locator.selectedLocationIdx) 
      {
        if(locationElem.classList.contains("peng") && selectedLocation == false)
        {
          for (let locationElem of resultsContainerEl.children) {
            locationElem.classList.remove('peng');
            locationElem.classList.remove('selected');
            for (let ChildLocationElem of locationElem.children) 
            {
              if(ChildLocationElem.classList.contains("select-camp"))
              {
                ChildLocationElem.classList.remove('selected');
                ChildLocationElem.classList.remove('peng');
              }
            }
          }
          
        }
        else
        {
          locationElem.classList.add('peng');
          locationElem.classList.add('selected');
          for (let ChildLocationElem of locationElem.children) 
          {
            if(ChildLocationElem.classList.contains("select-camp"))
            {
                ChildLocationElem.classList.add('selected');
            }
          }
          selectedLocation = false;
        }
        if (scrollToResult) {
          panelEl.scrollTop = locationElem.offsetTop;
        }
      }
    }
    if (panToMarker && (locationIdx != null)) {
      locator.map.panTo(locator.locations[locationIdx].coords);
      if ($(window).width() > 876) {
        locator.map.panBy(-300,0);    
     }
    
    }
  };

  // Create a marker for each location.
  const image =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  var CCicon = {
    url: "img/CClogo.png", // url
    scaledSize: new google.maps.Size(79/2.5, 100/2.5), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  const markers = locator.locations.map(function(location, index) {
    const marker = new google.maps.Marker({
      position: location.coords,
      map: locator.map,
      title: location.title,
      icon: CCicon
    });

    const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<div id="photopin">'+
    `<img class="locaphoto" src=${location.img} alt="Location image" width="200" height="150"></img>` +
    '</div>'+
    `<h1 id="firstHeading" class="firstHeading">${location.title}</h1>` +
    '<div id="bodyContent">' +
    "<p><b>Available Camps:</b></p>" +
    `<p>${location.Available}</p>`+
    "</div>" +
    "</div>";

    marker.addListener('click', function() {
      selectResultItem(index, false, true);
        const infowindow = new google.maps.InfoWindow({
          content: contentString,
        });
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
      //open box
    });
    return marker;
  });
  // Fit map to marker bounds.
  locator.updateBounds = function() {
    const bounds = new google.maps.LatLngBounds();
    if (locator.searchLocationMarker) {
      bounds.extend(locator.searchLocationMarker.getPosition());
    }
    for (let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }
    locator.map.fitBounds(bounds);
    if ($(window).width() > 876) {
      locator.map.panBy(-300,0);    
   }
  
  };
  if (locator.locations.length) {
    locator.updateBounds();
  }



  // Get the distance of a store location to the user's location,
  // used in sorting the list.
  const getLocationDistance = function(location) {
    if (!locator.searchLocation) return null;

    // Use travel distance if available (from Distance Matrix).
    if (location.travelDistanceValue != null) {
      return location.travelDistanceValue;
    }

    // Fall back to straight-line distance.
    return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(location.coords),
        locator.searchLocation.location);
  };

  // Render the results list --------------------------------------------------
  const getResultIndex = function(elem) {
    return parseInt(elem.getAttribute('data-location-index'));
  };

  locator.renderResultsList = function() {
    let locations = locator.locations.slice();
    for (let i = 0; i < locations.length; i++) {
      locations[i].index = i;
    }
    if (locator.searchLocation) {
      sectionNameEl.textContent =
          'Nearest locations (' + locations.length + ')';
      locations.sort(function(a, b) {
        return getLocationDistance(a) - getLocationDistance(b);
      });
    } else {
      sectionNameEl.textContent = `All locations (${locations.length})`;
    }
    const resultItemContext = { locations: locations };
    resultsContainerEl.innerHTML = itemsTemplate(resultItemContext);
    for (let item of resultsContainerEl.children) {
      const resultIndex = getResultIndex(item);
      if (resultIndex === locator.selectedLocationIdx) {
        item.classList.add('selected');
      }

      const resultSelectionHandler = function() {
        selectResultItem(resultIndex, true, false);
        //add selections
      };

      // Clicking anywhere on the item selects this location.
      // Additionally, create a button element to make this behavior
      // accessible under tab navigation.
      item.addEventListener('click', resultSelectionHandler);
      item.querySelector('.select-location')
          .addEventListener('click', function(e) {
            resultSelectionHandler();
            e.stopPropagation();
          });
    }
  };

  // Optional capability initialization --------------------------------------
  initializeSearchInput(locator);
  initializeDistanceMatrix(locator);

  // Initial render of results -----------------------------------------------
  locator.renderResultsList();
}

/** When the search input capability is enabled, initialize it. */
function initializeSearchInput(locator) {
  const geocodeCache = new Map();
  const geocoder = new google.maps.Geocoder();

  const searchInputEl = document.getElementById('location-search-input');
  const searchButtonEl = document.getElementById('location-search-button');

  const updateSearchLocation = function(address, location) {
    if (locator.searchLocationMarker) {
      locator.searchLocationMarker.setMap(null);
    }
    if (!location) {
      locator.searchLocation = null;
      return;
    }
    locator.searchLocation = {'address': address, 'location': location};
    locator.searchLocationMarker = new google.maps.Marker({
      position: location,
      map: locator.map,
      title: 'My location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: '#3367D6',
        fillOpacity: 0.5,
        strokeOpacity: 0,
      }
    });

    // Update the locator's idea of the user's country, used for units. Use
    // `formatted_address` instead of the more structured `address_components`
    // to avoid an additional billed call.
    const addressParts = address.split(' ');
    locator.userCountry = addressParts[addressParts.length - 1];

    // Update map bounds to include the new location marker.
    locator.updateBounds();

    // Update the result list so we can sort it by proximity.
    locator.renderResultsList();

    locator.updateTravelTimes();
  };

  const geocodeSearch = function(query) {
    if (!query) {
      return;
    }

    const handleResult = function(geocodeResult) {
      searchInputEl.value = geocodeResult.formatted_address;
      updateSearchLocation(
          geocodeResult.formatted_address, geocodeResult.geometry.location);
    };

    if (geocodeCache.has(query)) {
      handleResult(geocodeCache.get(query));
      return;
    }
    const request = {address: query, bounds: locator.map.getBounds()};
    geocoder.geocode(request, function(results, status) {
      if (status === 'OK') {
        if (results.length > 0) {
          const result = results[0];
          geocodeCache.set(query, result);
          handleResult(result);
        }
      }
    });
  };

  // Set up geocoding on the search input.
  searchButtonEl.addEventListener('click', function() {
    geocodeSearch(searchInputEl.value.trim());
  });

  // Initialize Autocomplete.
  initializeSearchInputAutocomplete(
      locator, searchInputEl, geocodeSearch, updateSearchLocation);
}

/** Add Autocomplete to the search input. */
function initializeSearchInputAutocomplete(
    locator, searchInputEl, fallbackSearch, searchLocationUpdater) {
  // Set up Autocomplete on the search input. Bias results to map viewport.
  const autocomplete = new google.maps.places.Autocomplete(searchInputEl, {
    types: ['geocode'],
    fields: ['place_id', 'formatted_address', 'geometry.location']
  });
  autocomplete.bindTo('bounds', locator.map);
  autocomplete.addListener('place_changed', function() {
    const placeResult = autocomplete.getPlace();
    if (!placeResult.geometry) {
      // Hitting 'Enter' without selecting a suggestion will result in a
      // placeResult with only the text input value as the 'name' field.
      fallbackSearch(placeResult.name);
      return;
    }
    searchLocationUpdater(
        placeResult.formatted_address, placeResult.geometry.location);
  });
}

/** Initialize Distance Matrix for the locator. */
function initializeDistanceMatrix(locator) {
  const distanceMatrixService = new google.maps.DistanceMatrixService();

  // Annotate travel times to the selected location using Distance Matrix.
  locator.updateTravelTimes = function() {
    if (!locator.searchLocation) return;

    const units = (locator.userCountry === 'USA') ?
        google.maps.UnitSystem.IMPERIAL :
        google.maps.UnitSystem.METRIC;
    const request = {
      origins: [locator.searchLocation.location],
      destinations: locator.locations.map(function(x) {
        return x.coords;
      }),
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: units,
    };
    const callback = function(response, status) {
      if (status === 'OK') {
        const distances = response.rows[0].elements;
        for (let i = 0; i < distances.length; i++) {
          const distResult = distances[i];
          let travelDistanceText, travelDistanceValue;
          if (distResult.status === 'OK') {
            travelDistanceText = distResult.distance.text;
            travelDistanceValue = distResult.distance.value;
          }
          const location = locator.locations[i];
          location.travelDistanceText = travelDistanceText;
          location.travelDistanceValue = travelDistanceValue;
        }

        // Re-render the results list, in case the ordering has changed.
        locator.renderResultsList();
      }
    };
    distanceMatrixService.getDistanceMatrix(request, callback);
  };
}