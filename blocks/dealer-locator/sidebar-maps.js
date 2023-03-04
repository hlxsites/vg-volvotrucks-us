/* eslint-disable  */
$('.slider-arrow').click(function () {
  if ($(window).width() <= 700) {
    if ($(this).hasClass('show')) {
      $('.slider-arrow, .sidebar, .sidebar-legend').animate({ left: '+=80%' }, 200, () => {
      });
      $(this).removeClass('show').addClass('hide').find('i')
        .removeClass('fa fa-angle-right')
        .addClass('fa fa-angle-left');
    } else if ($(window).width() <= 700) {
      $('.slider-arrow, .sidebar, .sidebar-legend').animate({ left: '-=80%' }, 200, () => {
      });
      $(this).removeClass('hide').addClass('show').find('i')
        .removeClass('fa fa-angle-left')
        .addClass('fa fa-angle-right');
    } else {
      $('.slider-arrow, .sidebar, .sidebar-legend').animate({ left: '-=483' }, 200, () => {
      });
      $(this).removeClass('hide').addClass('show').find('i')
        .removeClass('fa fa-angle-left')
        .addClass('fa fa-angle-right');
    }
  } else if ($(this).hasClass('show')) {
    $('.slider-arrow, .sidebar, .sidebar-legend').animate({ left: '+=483' }, 200, () => {
    });
    $(this).removeClass('show').addClass('hide').find('i')
      .removeClass('fa fa-angle-right')
      .addClass('fa fa-angle-left');
  } else if ($(window).width() <= 700) {
    $('.slider-arrow, .sidebar, .sidebar-legend').animate({ left: '-=80%' }, 200, () => {
    });
    $(this).removeClass('hide').addClass('show').find('i')
      .removeClass('fa fa-angle-left')
      .addClass('fa fa-angle-right');
  } else {
    $('.slider-arrow, .sidebar, .sidebar-legend').animate({ left: '-=483' }, 200, () => {
    });
    $(this).removeClass('hide').addClass('show').find('i')
      .removeClass('fa fa-angle-left')
      .addClass('fa fa-angle-right');
  }
});

const $html = $('html');
const $pins2 = [];
let $pins = [];
let $location = null;
let $radius = null;
let $me = null;
let $nearbyPins = [];
let $markers = [];
const $radiusControl = $('#filters input[type="range"]');
let $map = null;
let $geocoder = null;
const $filters = $('.sidebar-content #filter-options input[type="checkbox"]');
const $consolidateFilters = window.locatorConfig.consolidateFilters;
let $viewingPin = null;
const $pinIcon = 'pin.svg';
const $meIcon = '/blocks/dealer-locator/images/ME.svg';
const $panes = [];
let $lastPane = '';
const $radiusValue = $('#range').val();
let $sortedPins = null;
const $offset = (new Date()).getTimezoneOffset() / 60 * -1;
const $key = 'AIzaSyAP8IewqHuU8SMz_6tNiIUlbU_l0GFOd1w';
let $myDealer = null;
let $wayPoints = [];
let $directionsService = null;
let $directionsDisplay = null;
let $directionsObject = null;
const $printDirections = $('#print-directions');
const $printableDirections = $('#printable-directions');
let $directionResults = null;
let $currentAddress = '';
const $directionsMessage = $('#directions-message');
const $isAsist = window.locatorConfig.asist;
const $isAmentities = window.locatorConfig.amenities;
let $brandOptionSelected = '';
const $eloquaFormHTML = $('script#eloquaForm').html();
const $showAsistDialog = window.locatorConfig.showAsistDialog;
let $electricDealer = !1;
const $hoverText = $('#hoverText').val();

const initMap = function () {
  if ($geocoder = new google.maps.Geocoder(), $map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 39.670469, lng: -101.766407 },
    zoom: 4,
    mapTypeControl: !1,
    streetViewControl: !1,
    fullscreenControl: !1,
    styles: [{ elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] }, {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'on' }],
    }, {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    }, {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#f5f5f5' }],
    }, {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#bdbdbd' }],
    }, {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#eeeeee' }],
    }, {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }],
    }, {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#e5e5e5' }],
    }, {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9e9e9e' }],
    }, {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    }, {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }],
    }, {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#dadada' }],
    }, {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    }, {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9e9e9e' }],
    }, {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{ color: '#e5e5e5' }],
    }, {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{ color: '#eeeeee' }],
    }, {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9c9c9' }],
    }, { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }],
  }), $.fn.setLocation(), $directionsService = new google.maps.DirectionsService(), $directionsDisplay = new google.maps.DirectionsRenderer(), google.maps.event.addListener($directionsDisplay, 'routeindex_changed', () => {
  }), $isAsist && ($('#filter-options').css('display', 'none'), $brandOptionSelected = window.locatorConfig.selectedBrand), $isAsist && $showAsistDialog) {
    $('.datasource-option').toggle();
    const options = $.map([$('.brand button#volvo'), $('.brand button#mack'), $('.brand button#dual')], (el) => el.get());
    $(options).on('click', (ev) => {
      switch ($id = $brandOptionSelected = $(ev.target).attr('id'), $id) {
        case 'mack':
          window.locatorConfig.dataSource = 'https://www.macktrucks.com/simpleprox.ashx?https://mvservices.na.volvogroup.com/DealerJSON_new.ashx';
          break;
        case 'volvo':
          window.locatorConfig.dataSource = 'https://www.macktrucks.com/simpleprox.ashx?https://mvservices.na.volvogroup.com/Volvo_DealerJSON.ashx';
          break;
        case 'dual':
          window.locatorConfig.dataSource = 'https://www.macktrucks.com/simpleprox.ashx?https://mvservices.na.volvogroup.com/Dualbrand_DealerJSON.ashx';
      }
      $.fn.loadPins();
      $('.datasource-option').toggle();
    });
  }
};

$.fn.initGoogleMaps = function () {
  $.ajax({
    type: 'GET',
    url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAP8IewqHuU8SMz_6tNiIUlbU_l0GFOd1w&libraries=places,geometry',
    dataType: 'script',
    success(d) {
      initMap();
    },
  });
};
$.fn.loadPins = function () {
  $pins = [], $nearbyPins = [], $markers = [], window.locatorConfig.dataSource || (window.locatorConfig.dataSource = '/simpleprox.ashx?https://mvservices.na.volvogroup.com/Dualbrand_US_DealerJSON.ashx'), $.ajax({
    url: `${window.locatorConfig.dataSource}?${window.locatorConfig.asist ? 'asist=1%26' : ''}state=1`,
    type: 'GET',
    success(data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
      }
      for (const country in data.countries) {
        if (data.countries.hasOwnProperty(country)) {
          $country = data.countries[country];
          for (const state in $country.states) {
            if ($country.states.hasOwnProperty(state)) {
              $state = $country.states[state];
              for (const dealer in $state.dealers) {
                if ($state.dealers.hasOwnProperty(dealer)) {
                  if ($dealer = $state.dealers[dealer], $dealer.services) {
                    for (const service in $dealer.services) $dealer.services.hasOwnProperty(service) && ($service = $dealer.services[service], $service.toLowerCase().indexOf('certified uptime') > -1 && ($dealer.isCertifiedUptimeCenter = !0, $electricDealer = !1), $service.toLowerCase().indexOf('certified') > -1 && ($dealer.isCertifiedCenter = !0), $service.toLowerCase().indexOf('premium used') > -1 && ($dealer.isPremiumUsedTruckDealer = !0, $service = 'Premium Certified Used Truck Dealer'), $service.toLowerCase().indexOf('select part store') > -1 && ($dealer.isPartsAssist = !0, $dealer.services[service] = 'SELECT Part Store&reg;'));
                    Object.values($dealer.services).includes('Volvo Certified EV Dealer') && ($electricDealer = !0);
                  }
                  if ($dealer.isCertifiedUptimeCenter) {
                    var pinIcon = {
                      url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
                      scaledSize: new google.maps.Size(17, 23),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(0, 0),
                    };
                    if ($electricDealer === !0 || $dealer.services && Object.values($dealer.services).includes('Volvo Certified EV Dealer')) {
                      var pinIcon = {
                        url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
                        scaledSize: new google.maps.Size(17, 23),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(0, 0),
                      };
                    }
                  } else if ($electricDealer === !0 || $dealer.services && Object.values($dealer.services).includes('Volvo Certified EV Dealer')) {
                    var pinIcon = {
                      url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
                      scaledSize: new google.maps.Size(17, 23),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(0, 0),
                    };
                  } else {
                    var pinIcon = {
                      url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
                      scaledSize: new google.maps.Size(17, 23),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(0, 0),
                    };
                  }
                  $marker = new google.maps.Marker({
                    id: $dealer.IDENTIFIER_VALUE,
                    position: {
                      lat: parseFloat($dealer.MAIN_LATITUDE),
                      lng: parseFloat($dealer.MAIN_LONGITUDE),
                    },
                    title: $dealer.COMPANY_DBA_NAME,
                    map: $map,
                    icon: pinIcon,
                  }), $marker.addListener('click', function () {
                    const index = $markers.indexOf(this);
                    const
                      marker = $markers[index];
                    if ($map.panTo(marker.position), $lastPane != 'sidebar-select-pins') {
                      $markers.forEach((marker) => {
                        const details = $.fn.getPinById(marker.ID);
                        if (details.isCertifiedUptimeCenter) {
                          var pinIcon = {
                            url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
                            scaledSize: new google.maps.Size(17, 23),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 0),
                          };
                          if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
                            var pinIcon = {
                              url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
                              scaledSize: new google.maps.Size(17, 23),
                              origin: new google.maps.Point(0, 0),
                              anchor: new google.maps.Point(0, 0),
                            };
                          }
                        } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
                          var pinIcon = {
                            url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
                            scaledSize: new google.maps.Size(17, 23),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 0),
                          };
                        } else {
                          var pinIcon = {
                            url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
                            scaledSize: new google.maps.Size(17, 23),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 0),
                          };
                        }
                        marker.setIcon(pinIcon);
                      });
                      var details = $.fn.getPinById(marker.ID);
                      if (details.isCertifiedUptimeCenter) {
                        var pinIcon = {
                          url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
                          scaledSize: new google.maps.Size(58, 80),
                          origin: new google.maps.Point(0, 0),
                          anchor: new google.maps.Point(0, 0),
                        };
                        if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
                          var pinIcon = {
                            url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
                            scaledSize: new google.maps.Size(58, 80),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 0),
                          };
                        }
                      } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
                        var pinIcon = {
                          url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
                          scaledSize: new google.maps.Size(58, 80),
                          origin: new google.maps.Point(0, 0),
                          anchor: new google.maps.Point(0, 0),
                        };
                      } else {
                        var pinIcon = {
                          url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
                          scaledSize: new google.maps.Size(58, 80),
                          origin: new google.maps.Point(0, 0),
                          anchor: new google.maps.Point(0, 0),
                        };
                      }
                      marker.setIcon(pinIcon), $.fn.myDealer(), $.fn.switchSidebarPane('sidebar-pin', marker.id);
                    } else {
                      var details = null;
                      for (i = 0; i < $pins.length; i++) {
                        if ($pins[i].IDENTIFIER_VALUE == marker.id) {
                          if ($.fn.isWaypoint($pins[i].waypoint)) continue;
                          $wayPoints.push($pins[i].waypoint), details = $pins[i];
                          var pinIcon = $.fn.drawPin('-', 38, 38, '808080');
                          marker.setIcon(pinIcon), $.fn.renderAddDirectionsPin(marker, details);
                        }
                      }
                    }
                  }), $markers.push($marker), $marker.ID = $dealer.IDENTIFIER_VALUE, $dealer.waypoint = {
                    id: $dealer.IDENTIFIER_VALUE,
                    point: {
                      location: new google.maps.LatLng($dealer.MAIN_LATITUDE, $dealer.MAIN_LONGITUDE),
                      stopover: !1,
                    },
                  }, $pins.push($dealer), $pins2.push($dealer);
                }
              }
            }
          }
        }
      }
      $.fn.myDealer(), $.fn.filterRadius();
      const markerId = $.fn.getUrlParameter('view');
      const
        viewMarker = $.fn.getPinById(markerId);
      if (markerId && viewMarker) for (i = 0; i < $markers.length; i++) $markers[i].id == markerId && $.fn.switchSidebarPane('sidebar-pin', markerId);
    },
  });
};
$.fn.removeWaypoint = function (pin) {
  for (var $this = $(pin), $id = $this.attr('data-id'), i = 0; i < $pins.length; i++) {
    if ($markers[i].id == $id) {
      const pinIcon = $.fn.drawPin('+', 38, 38, '4174C4');
      $markers[i].setIcon(pinIcon);
    }
  }
  $wayPoints = $.grep($wayPoints, (w) => w.id != $id);
  const parent = $this.parents('.panel-card');
  parent.remove();
};
$.fn.isWaypoint = function (waypoint) {
  for (let i = 0; i < $wayPoints.length; i++) if ($wayPoints[i].id == waypoint.id) return !0;
  return !1;
};
$.fn.getHours = function (dealer) {
  let hours = null;
  return dealer.hours.Parts && (hours = dealer.hours.Parts), !hours && dealer.hours.Service && (hours = dealer.hours.Service), !hours && dealer.hours.Leasing && (hours = dealer.hours.Leasing), hours;
};
$.fn.isOpen = function (dealer, time) {
  let hours = $.fn.getHours(dealer);
  const zone = moment.tz.guess();
  let
    closeSoon = !1;
  if (hours) {
    time || (time = new Date());
    const todayAtDealer = hours[time.getDay()];
    if (todayAtDealer) {
      let startTime = todayAtDealer.Start;
      startTime.toLowerCase() == 'midnight' && (startTime = '12:00 AM');
      let endTime = todayAtDealer.End;
      endTime.toLowerCase() == 'midnight' && (endTime = '11:59 PM'), startTime.toLowerCase().indexOf('24') > -1 && (startTime = '12:00 AM'), endTime.toLowerCase().indexOf('24') > -1 && (endTime = '11:59 PM'), startTime.toLowerCase() == 'noon' && (startTime = '12:00 PM'), endTime.toLowerCase() == 'noon' && (endTime = '12:00 PM');
      const start = new Date();
      start.setFullYear(time.getFullYear()), start.setMonth(time.getMonth()), start.setDate(time.getDate()), start.setHours(moment(startTime, ['h:mm A']).format('HH')), start.setMinutes(moment(startTime, ['h:mm A']).format('mm')), start.setSeconds(0);
      const end = new Date();
      return end.setFullYear(time.getFullYear()), end.setMonth(time.getMonth()), end.setDate(time.getDate()), end.setHours(moment(endTime, ['h:mm A']).format('HH')), end.setMinutes(moment(endTime, ['h:mm A']).format('mm')), end.setSeconds(0), ~endTime.toLowerCase().indexOf('am') && (console.log('end date is AM, add 1 day'), end.setDate(time.getDate() + 1)), moment.tz(zone).isBetween(start, end) ? (hours = Math.abs(time - end) / 36e5, hours < 1 && (closeSoon = !0), {
        open: !0,
        endTime: end,
        closeSoon,
      }) : { open: !1, endTime: end, closeSoon };
    }
  }
  return 2;
};
$.fn.canDetermineHours = function (pin) {
  let hours = null;
  return pin.hours.Parts && (hours = pin.hours.Parts), !hours && pin.hours.Service && (hours = pin.hours.Service), !hours && pin.hours.Leasing && (hours = pin.hours.Leasing), !!hours;
};
$.fn.renderPinDirections = function (markerId) {
  let markerDetails;
  var templateClone = $($('#sidebar-directions').clone(!0).html());
  var templateClone = $($('#sidebar-direction-list').clone(!0).html());
  for ($('.add-directions').attr('data-id', markerId), i = 0; i < $sortedPins.length; i++) $sortedPins[i].IDENTIFIER_VALUE == markerId && (markerDetails = $sortedPins[i]);
  $('.main-header').css('display', 'none'), $('.main-directions').css('display', 'block'), $('.go-back').css('display', 'none'), $origin = $currentAddress, $origin && $origin != '' || ($origin = `${$location[0]},${$location[1]}`, $('.from-directions input').val($origin)), $destination = `${markerDetails.MAIN_ADDRESS_LINE_1_TXT} ${markerDetails.MAIN_ADDRESS_LINE_2_TXT}, ${markerDetails.MAIN_CITY_NM}, ${markerDetails.MAIN_STATE_PROV_CD} ${markerDetails.MAIN_POSTAL_CD}`, $('.from-directions input').val() && ($origin = $('.from-directions input').val()), $directionsObject = {
    origin: $origin,
    destination: $destination,
    travelMode: 'DRIVING',
    optimizeWaypoints: !0,
    provideRouteAlternatives: !0,
    waypoints: $.fn.wayPointArray(),
  }, $directionsService.route($directionsObject, (result, status) => {
    status == 'OK' && ($directionsDisplay.setMap($map), $directionsDisplay.setPanel(templateClone.find('#directions-container').get(0)), $directionsDisplay.setDirections(result), $directionResults = result);
  }), $('.from-directions input').val($origin), $('.to-directions input').val($destination);
  for (var waypointDecodeUrl = '', x = 0; x < $wayPoints.length; x++) {
    const loc = $wayPoints[x].point.location;
    waypointDecodeUrl += `/${loc.lat()},${loc.lng()}/`;
  }
  return templateClone.find('#gmaps-link').attr('onclick', `window.open("https://www.google.com/maps/dir/${$origin}/${$destination}${waypointDecodeUrl}", "_blank")`), templateClone;
};
$.fn.renderPinDetails = function (markerId) {
  let markerDetails;
  const
    templateClone = $($('#sidebar-pin').clone(!0).html());
  for (i = 0; i < $sortedPins.length; i++) $sortedPins[i].IDENTIFIER_VALUE == markerId && (markerDetails = $sortedPins[i]);
  let marker;
  for (i = 0; i < $markers.length; i++) $markers[i].id == markerId && (marker = $markers[i], $viewingPin = marker);
  $asistHtml = '<button title="Request Access" class="join-select" onclick="return false;">Request Access</button>', $isAsist && (templateClone.find('#partsasist-button').html($asistHtml), templateClone.find('#partsasist-button').attr('data-dealerid', markerDetails.IDENTIFIER_VALUE), templateClone.find('#partsasist-button').attr('data-name', $.fn.camelCase(markerDetails.COMPANY_DBA_NAME)), markerDetails.PARTS_EMAIL ? templateClone.find('#partsasist-button').attr('data-dealeremail', markerDetails.PARTS_EMAIL.toLowerCase()) : templateClone.find('#partsasist-button').attr('data-dealeremail', markerDetails.EMAIL_ADDRESS.toLowerCase()), templateClone.find('#partsasist-button').attr('data-postalcode', markerDetails.MAIN_POSTAL_CD)), templateClone.find('#title').text($.fn.camelCase(markerDetails.COMPANY_DBA_NAME)), templateClone.find('#title2').text($.fn.camelCase(markerDetails.COMPANY_DBA_NAME)), templateClone.find('#address1 div').text(markerDetails.MAIN_ADDRESS_LINE_1_TXT), templateClone.find('#address2 div').text(markerDetails.MAIN_ADDRESS_LINE_2_TXT), templateClone.find('#city-state-zip div').text(`${markerDetails.MAIN_CITY_NM}, ${markerDetails.MAIN_STATE_PROV_CD} ${markerDetails.MAIN_POSTAL_CD}`), markerDetails.WEB_ADDRESS ? templateClone.find('#website').html(`<a href="${$.fn.formatWebAddress(markerDetails.WEB_ADDRESS)}" target="_blank">${$.fn.formatWebAddress(markerDetails.WEB_ADDRESS)}</a>`) : templateClone.find('#website .controls').css('display', 'none'), markerDetails.EMAIL_ADDRESS && templateClone.find('#email').html(`<a href="mailto:${markerDetails.EMAIL_ADDRESS.toLowerCase()}"><img src="/blocks/dealer-locator/images/Mail.png" />${markerDetails.EMAIL_ADDRESS.toLowerCase()}</a>`), templateClone.find('.detail-website a').attr('href', $.fn.formatWebAddress(markerDetails.WEB_ADDRESS)), templateClone.find('.detail-email').html(`<a href="mailto:${markerDetails.EMAIL_ADDRESS.toLowerCase()}"><img src="/blocks/dealer-locator/images/Mail-2.png" />Email</a>`), templateClone.find('#phone div').html(`<a href="tel:${markerDetails.REG_PHONE_NUMBER}">${$.fn.formatPhoneNumber(markerDetails.REG_PHONE_NUMBER)}</a>`), templateClone.find('#directions').attr('data-id', markerDetails.IDENTIFIER_VALUE), templateClone.find('#clipboard-address').attr('data-clipboard', `${markerDetails.MAIN_ADDRESS_LINE_1_TXT} ${markerDetails.MAIN_ADDRESS_LINE_2_TXT} ${markerDetails.MAIN_CITY_NM}, ${markerDetails.MAIN_STATE_PROV_CD} ${markerDetails.MAIN_POSTAL_CD}`), templateClone.find('#open-website').attr('onclick', `window.open('${$.fn.formatWebAddress(markerDetails.WEB_ADDRESS)}', '_blank')`), templateClone.find('#share-link').val(`${window.location.href.split('?')[0]}?view=${markerDetails.IDENTIFIER_VALUE}`), templateClone.find('.detail-call').html(`<a href="tel:${markerDetails.REG_PHONE_NUMBER}"><img src="/blocks/dealer-locator/images/Phone-2.png" />Call</a>`), templateClone.find('#head-marker').attr('src', $viewingPin.icon.url), templateClone.find('#head-marker').css('width', '31px'), templateClone.find('#head-marker').css('height', '43px');
  const myDealer = $.fn.getCookie('my-dealer');
  myDealer == markerDetails.IDENTIFIER_VALUE ? (templateClone.find('#set-dealer').html('<img src="/blocks/dealer-locator/images/Vector-3.svg" />'), templateClone.find('#head-marker').attr('src', $viewingPin.icon)) : templateClone.find('#set-dealer').html('<img src="/blocks/dealer-locator/images/Star-1.svg" />'), templateClone.find('#set-dealer').attr('data-pin', markerDetails.IDENTIFIER_VALUE);
  const isOpen = $.fn.isOpen(markerDetails);
  let
    isOpenHtml = '';
  isOpenHtml = isOpen.open && !isOpen.closeSoon ? `Open till ${moment(isOpen.endTime).format('h:mm A')}` : isOpen.open && isOpen.closeSoon ? 'Closing soon' : 'Closed';
  const servicesHtml = templateClone.find('#services');
  const driversHtml = templateClone.find('#drivers');
  const driverAmenities = [];
  const newdriverAmenities = [];
  const
    serviceAmenities = [];
  if (markerDetails.services) var newMarkerDetail = Object.values(markerDetails.services);
  newMarkerDetail && jQuery.grep(newMarkerDetail, (el) => {
    jQuery.inArray(el, $isAmentities) == -1 && serviceAmenities.push(el);
  }), $isAmentities && jQuery.grep($isAmentities, (el) => {
    jQuery.inArray(el, newMarkerDetail) == -1 && driverAmenities.push(el);
  }), $isAmentities && jQuery.grep($isAmentities, (el) => {
    jQuery.inArray(el, driverAmenities) == -1 && newdriverAmenities.push(el);
  }), serviceAmenities && $.each(serviceAmenities, (i, item) => {
    $('<li/>', { html: serviceAmenities[i] }).appendTo(servicesHtml);
  }), newdriverAmenities && $.each(newdriverAmenities, (i, item) => {
    $('<li/>', { html: newdriverAmenities[i] }).appendTo(driversHtml);
  });
  const driversId = templateClone.find('#drivers');
  driversId && !driversId.find('li').length || newdriverAmenities.length == 0 ? templateClone.find('.header-driver-title').hide() : templateClone.find('.header-driver-title').show(), $.isEmptyObject(markerDetails.services) && templateClone.find('.header-title').css('display', 'none');
  let hours = null;
  const hoursHtml = templateClone.find('#details');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let hasPartsHours = !1;
  let hasServiceHours = !1;
  let hasLeasingHours = !1;
  let
    hasSalesHours = !1;
  if (markerDetails.hours.Parts) {
    hours = markerDetails.hours.Parts, $('<div/>', { html: '<div class="hours-dept">Parts:</div>' }).appendTo(hoursHtml);
    var added = 0;
    $.each(hours, (i, item) => {
      if (hours[i].Start.toLowerCase().indexOf('24 hours') >= 0 || hours[i].Start.toLowerCase().indexOf('closed') >= 0) hours[i].Start = ''; else if (hours[i].Start.toLowerCase().length <= 0) return;
      $('<div/>', { html: `<span id=day>${days[i]}</span> <span id=time>${hours[i].Start}${hours[i].Start ? ' - ' : ''}${hours[i].End}</span>` }).appendTo(hoursHtml), added++, hasPartsHours = !0;
    }), added <= 0 && $('<div/>', { html: 'Please call for hours.' }).appendTo(hoursHtml);
  }
  if (markerDetails.hours.Service) {
    hours = markerDetails.hours.Service, $('<div/>', { html: '<div class="hours-dept">Service:</div>' }).appendTo(hoursHtml);
    var added = 0;
    $.each(hours, (i, item) => {
      if (hours[i].Start.toLowerCase().indexOf('24 hours') >= 0 || hours[i].Start.toLowerCase().indexOf('closed') >= 0) hours[i].Start = ''; else if (hours[i].Start.toLowerCase().length <= 0) return;
      $('<div/>', { html: `<span id=day>${days[i]}</span> <span id=time>${hours[i].Start}${hours[i].Start ? ' - ' : ''}${hours[i].End}</span>` }).appendTo(hoursHtml), added++, hasServiceHours = !0;
    }), added <= 0 && $('<div/>', { html: 'Please call for hours.' }).appendTo(hoursHtml);
  }
  if (markerDetails.hours.Leasing) {
    hours = markerDetails.hours.Leasing, $('<div/>', { html: '<div class="hours-dept">Leasing:</div>' }).appendTo(hoursHtml);
    var added = 0;
    $.each(hours, (i, item) => {
      if (hours[i].Start.toLowerCase().indexOf('24 hours') >= 0 || hours[i].Start.toLowerCase().indexOf('closed') >= 0) hours[i].Start = ''; else if (hours[i].Start.toLowerCase().length <= 0) return;
      $('<div/>', { html: `<span id=day>${days[i]}</span> <span id=time>${hours[i].Start}${hours[i].Start ? ' - ' : ''}${hours[i].End}</span>` }).appendTo(hoursHtml), added++, hasLeasingHours = !0;
    }), added <= 0 && $('<div/>', { html: 'Please call for hours.' }).appendTo(hoursHtml);
  }
  if (markerDetails.hours.Sales && (hours = markerDetails.hours.Sales, hours[0].Start.length > 0)) {
    $('<div/>', { html: '<div class="hours-dept">Sales:</div>' }).appendTo(hoursHtml);
    var added = 0;
    $.each(hours, (i, item) => {
      if (hours[i].Start.toLowerCase().indexOf('24 hours') >= 0 || hours[i].Start.toLowerCase().indexOf('closed') >= 0) hours[i].Start = ''; else if (hours[i].Start.toLowerCase().length <= 0) return;
      $('<div/>', { html: `<span id=day>${days[i]}</span> <span id=time>${hours[i].Start}${hours[i].Start ? ' - ' : ''}${hours[i].End}</span>` }).appendTo(hoursHtml), added++, hasSalesHours = !0;
    }), added <= 0 && $('<div/>', { html: 'Please call for hours.' }).appendTo(hoursHtml);
  }
  return hasPartsHours || hasServiceHours || hasLeasingHours || hasSalesHours || (isOpenHtml = 'Call'), templateClone.find('#hours div').html(`${isOpenHtml} <span class="toggle-arrow"></span>`), $.isEmptyObject(hours) && templateClone.find('.toggle-arrow').css('display', 'none'), $.fn.isOpen(markerDetails), $map.panTo(marker.position), templateClone;
};
$.fn.renderAddDirectionsPin = function (marker, details) {
  const templateClone = $($('#sidebar-select-pin').clone(!0).html());
  templateClone.find('.fa-close').attr('data-id', details.IDENTIFIER_VALUE), console.log(details, 'details');
  const isOpen = $.fn.isOpen(details);
  let
    isOpenHtml = '';
  isOpenHtml = isOpen.open && !isOpen.closeSoon ? `Open till ${moment(isOpen.endTime).format('h:mm A')}` : isOpen.open && isOpen.closeSoon ? 'Closing soon' : 'Closed', templateClone.find('.heading p').text($.fn.camelCase(details.COMPANY_DBA_NAME)), templateClone.find('.hours').text(isOpenHtml), templateClone.find('.distance').text(`${details.distance.toFixed(2)} mi`), templateClone.find('.address').text(details.MAIN_ADDRESS_LINE_1_TXT), templateClone.find('.city').text(`${details.MAIN_CITY_NM}, ${details.MAIN_STATE_PROV_CD} ${details.MAIN_POSTAL_CD}`), templateClone.find('.phone').text(details.REG_PHONE_NUMBER), templateClone.find('.detail-website a').attr('href', $.fn.formatWebAddress(pin.WEB_ADDRESS)), templateClone.find('.detail-call').html(`<a href="tel:${pin.REG_PHONE_NUMBER}"><img src="/blocks/dealer-locator/images/Phone-2.png" />Call</a>`), $('<div/>', { html: templateClone }).appendTo('.nearby-select');
};
$.fn.setupAddDirectionsView = function () {
  $('.go-back-pin').attr('onclick', `$.fn.switchSidebarPane('add-directions-return','${$lastPane.split('-').pop().trim()}');`), $('div[id*="sidebar-select-pins"] span#filter').text($.fn.currentFilterHumanReadable());
  for (let i = 0; i < $markers.length; i++) {
    for (let k = 0; k < $pins.length; k++) {
      if ($pins[k].IDENTIFIER_VALUE == $markers[i].id && $.fn.showPin($pins[k])) {
        if ($markers[i].setMap($map), $.fn.isWaypoint($pins[k].waypoint)) var pinIcon = $.fn.drawPin('-', 38, 38, '808080'); else var pinIcon = $.fn.drawPin('+', 38, 38, '4174C4');
        $markers[i].setIcon(pinIcon);
      }
    }
  }
  $map.setZoom(8);
};
$.fn.switchSidebarPane = function (id, e) {
  const markerId = $(e).data('id') ? $(e).data('id') : e;
  let content = $(`#${id}`).html();
  let
    forceRefresh = !1;
  console.log(markerId, 'markerId'), e && id == 'sidebar-pin' && (content = $.fn.renderPinDetails(markerId)), e && id == 'sidebar-directions' || id == 'add-directions-return' || id == 'sidebar-direction-list' ? (content = $.fn.renderPinDirections(markerId), $('.sidebar-content').addClass('direction-content'), $('.go-back').css('display', 'none'), $('.sidebar-legend').hide(), $(window).width() < 992 && ($('.sidebar').css('overflow', 'scroll'), $('.add-directions').text('Recalculate')), id == 'add-directions-return' && (forceRefresh = !0)) : id.indexOf('sidebar-select-pins') >= 0 ? ($.fn.setupAddDirectionsView(), content = $(`#${id}`).html(), $('.main-directions').css('display', 'none'), $('.main-header').css('display', 'none')) : ($('.main-directions').css('display', 'none'), $('.main-header').css('display', 'block'), $.fn.clearDirections(), $map.setZoom(8)), $lastPane && $(`#d-

    ${$lastPane}`).css('display', 'none'), id == 'sidebar-directions' || id == 'sidebar-direction-list' ? $('.go-back').css('display', 'none') : id == 'sidebar-filter' ? ($('.go-back').css('display', 'block'), $('.go-back').css('background', 'none')) : id == 'sidebar-pin' ? ($('.go-back').css('display', 'block'), $('.go-back').css('background', '#202A44')) : $('.go-back').css('display', 'none'), document.body.scrollTop = 0, $('.sidebar').scrollTop(0), id += e != null ? `-${markerId}` : '';
  let foundPane = !1;
  $panes.forEach((pane) => {
    pane == id && (id.indexOf('directions') >= 0 || id.indexOf('direction') >= 0 ? ($(`#d-${id}`).remove(), $('.go-back').css('display', 'none')) : id.indexOf('sidebar-pin') >= 0 && id.indexOf(`sidebar-pin-${markerId}`) >= 0 ? $(`#d-${id}`).remove() : ($(`#d-${id}`).css('display', 'block'), foundPane = !0));
  }), foundPane || ($('<div/>', {
    id: `d-${id}`,
    html: content,
  }).appendTo('.sidebar-content'), $panes.push(id)), forceRefresh && $(`#d-${id}`).html(content), $('.sidebar').css('left') != '0px' && ($(window).width() <= 700 ? $('.slider-arrow, .sidebar').animate({ left: '+=80%' }, 200, () => {
  }) : $('.slider-arrow, .sidebar').animate({ left: '+=408' }, 200, () => {
  }), $('.slider-arrow').html('&laquo;').removeClass('show').addClass('hide')), $lastPane = id;
};
$.fn.getPinById = function (id) {
  return $.grep($pins, (v, i) => v.IDENTIFIER_VALUE === id)[0];
};
$.fn.filterRadius = function () {
  if ($nearbyPins = [], $.fn.myDealer(), !$me && $location && ($pin = {
    url: $meIcon,
    size: new google.maps.Size(100, 100),
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(30, 30),
  }, $me = new google.maps.Marker({
    position: { lat: $location[0], lng: $location[1] },
    title: 'ME',
    map: $map,
    zIndex: 0,
    icon: $pin,
  }), $me.setZIndex(0)), $isAsist) {
    for (var i = 0; i < $markers.length; i++) {
      var pin = $.grep($pins, (v, b) => v.IDENTIFIER_VALUE === $markers[i].ID)[0];
      $markers[i].setMap($map), $markers[i].setZIndex(2), $nearbyPins.push($markers[i].ID);
    }
    return $.fn.filterNearbyPins(), $.fn.switchSidebarPane('sidebar-pins'), $('.waiting-overlay').css('display', 'none'), void $map.setZoom(4);
  }
  for (var radius = $.fn.milesInMeters($('#range').val()), bounds = new google.maps.LatLngBounds(), k = 1, i = 0; i < $markers.length; i++) {
    if (google.maps.geometry.spherical.computeDistanceBetween($markers[i].getPosition(), $me.getPosition()) < radius) {
      bounds.extend($markers[i].getPosition());
      var pin = $.grep($pins, (v, b) => v.IDENTIFIER_VALUE === $markers[i].ID)[0];
      $.fn.showPin(pin) ? ($markers[i].setMap($map), $markers[i].setZIndex(2), $nearbyPins.push($markers[i].ID), k++) : $markers[i].setMap(null);
    } else {
      var pin = $.grep($pins, (v, b) => v.IDENTIFIER_VALUE === $markers[i].ID)[0];
      if ($.fn.showPin(pin) && $markers[i].setMap($map), $myDealer != null && $myDealer.IDENTIFIER_VALUE == $markers[i].id) var pinIcon = $.fn.drawPin('', 43, 63, '328E04'); else if (details.isCertifiedUptimeCenter) {
        var pinIcon = {
          url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
          scaledSize: new google.maps.Size(17, 23),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
        if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
        }
      } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
        var pinIcon = {
          url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
          scaledSize: new google.maps.Size(17, 23),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
      } else {
        var pinIcon = {
          url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
          scaledSize: new google.maps.Size(17, 23),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
      }
      $markers[i].setIcon(pinIcon), $markers[i].pinIndex = null;
    }
    $map.fitBounds(bounds), $map.setZoom(8);
  }
  $map.setCenter($me.getPosition()), $map.setZoom(8), $.fn.filterNearbyPins();
};
$.fn.milesInMeters = function ($mi) {
  return 1609.3 * $mi;
};
$.fn.kmToMiles = function ($km) {
  return 0.621371 * $km;
};
$.fn.radiusChange = function () {
  $value = 1 * $('#range').val(), $radiusLabel = $('label[for="range"] span'), $radiusLabel.html($value), $radius.setRadius($.fn.milesInMeters($value)), $.fn.filterRadius(), $value < 100 ? $map.fitBounds($radius.getBounds()) : $map.setZoom(8);
};
$.fn.setCookie = function (name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3), expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};
$.fn.getCookie = function (name) {
  for (let nameEQ = `${name}=`, ca = document.cookie.split(';'), i = 0; i < ca.length; i++) {
    for (var c = ca[i]; c.charAt(0) == ' ';) c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
$.fn.deleteCookie = function (name) {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};
$.fn.sortedPins = function () {
  $pinLength = $pins.length;
  for (let i = 0; i < $pinLength; i++) $pins[i], $pins[i].distance = $.fn.getDistanceInKm([$pins[i].MAIN_LATITUDE, $pins[i].MAIN_LONGITUDE]);
  return $sortedPins = $pins, $sortedPins.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)), $sortedPins.filter((i, n) => {
    $.fn.showPin(i);
  }), $sortedPins;
};
$.fn.showPin = function (pin) {
  if ($isAsist) return !0;
  let condition;
  const
    filter = $.fn.currentFilter();
  if ($consolidateFilters) {
    switch (filter) {
      case 'all':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('full line') > -1 || pin.DEALER_TYPE_DESC.toLowerCase().indexOf('parts & service') > -1 || pin.DEALER_TYPE_DESC.toLowerCase().indexOf('parts only') > -1 || pin.DEALER_TYPE_DESC.toLowerCase().indexOf('satellite') > -1 || pin.isCertifiedCenter || pin.isCertifiedUptimeCenter;
        break;
      case 'rental-leasing':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('leasing') > -1;
        break;
      default:
        condition = !1;
    }
  } else {
    switch (filter) {
      case 'full-line':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('full line') > -1;
        break;
      case 'rental-leasing':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('leasing') > -1;
        break;
      case 'parts-service':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('parts & service') > -1;
        break;
      case 'parts-only':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('parts only') > -1;
        break;
      case 'satellite':
        condition = pin.DEALER_TYPE_DESC.toLowerCase().indexOf('satellite') > -1;
        break;
      case 'premium-certified':
        condition = pin.isCertifiedCenter;
        break;
      case 'certified-uptime':
        condition = pin.isCertifiedUptimeCenter;
        break;
      default:
        condition = !1;
    }
  }
  return condition;
};
$.fn.tmpPins = function (tmpPinList) {
  let pinIndex = 1;
  const
    nearbyHtml = $('.nearby-pins').empty();
  tmpPinList.forEach((pin) => {
    if (!$.fn.showPin(pin)) return !0;
    const templateClone = $($('#nearbyPinDetails').clone(!0).html());
    templateClone.find('.teaser-top').attr('data-id', pin.IDENTIFIER_VALUE), templateClone.find('.more').attr('data-id', pin.IDENTIFIER_VALUE);
    const isOpen = $.fn.isOpen(pin);
    let
      isOpenHtml = '';
    isOpenHtml = isOpen.open && !isOpen.closeSoon ? `Open till ${moment(isOpen.endTime).format('h:mm A')}` : isOpen.open && isOpen.closeSoon ? 'Closing soon' : 'Closed', templateClone.find('.heading p').text($.fn.camelCase(pin.COMPANY_DBA_NAME)), templateClone.find('.hours').text(isOpenHtml), templateClone.find('.distance').text(`${pin.distance.toFixed(2)} mi`), templateClone.find('.address').text(pin.MAIN_ADDRESS_LINE_1_TXT), templateClone.find('.city').text(`${pin.MAIN_CITY_NM}, ${pin.MAIN_STATE_PROV_CD} ${pin.MAIN_POSTAL_CD}`), templateClone.find('.phone').text($.fn.formatPhoneNumber(pin.REG_PHONE_NUMBER)), templateClone.find('.website a').text('Dealer Site'), templateClone.find('.call a').text('Call'), templateClone.find('.direction a').text('Direction'), templateClone.find('.website a').attr('href', $.fn.formatWebAddress(pin.WEB_ADDRESS)), templateClone.find('.detail-call').html(`<a href="tel:${pin.REG_PHONE_NUMBER}"><img src="/blocks/dealer-locator/images/Phone-2.png" />Call</a>`), templateClone.find('.call a').attr('href', $.fn.formatPhoneNumber(pin.REG_PHONE_NUMBER)), templateClone.find('.call').html(`<a href="tel:${pin.REG_PHONE_NUMBER}">Call</a>`), templateClone.find('.direction a').attr('data-id', pin.IDENTIFIER_VALUE);
    let marker;
    for (i = 0; i < $markers.length; i++) {
      if ($markers[i].id == pin.IDENTIFIER_VALUE) {
        if (marker = $markers[i], $myDealer || ($myDealer = { IDENTIFIER_VALUE: $.fn.getCookie('my-dealer') }), $myDealer.IDENTIFIER_VALUE == pin.IDENTIFIER_VALUE) {
          var pinIcon = $.fn.drawPin('', 43, 63, '328E04');
          templateClone.find('#marker').css('width', 'auto'), templateClone.find('#marker').css('height', 'auto');
        } else if (pin.isCertifiedUptimeCenter) {
          var pinIcon = '/blocks/dealer-locator/images/volvo-pin-uptime.svg';
          var pinIcon2 = {
            url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
          if ($electricDealer === !0 || pin.services && Object.values(pin.services).includes('Volvo Certified EV Dealer')) {
            var pinIcon = '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg';
            var pinIcon2 = {
              url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          }
        } else if ($electricDealer === !0 || pin.services && Object.values(pin.services).includes('Volvo Certified EV Dealer')) {
          var pinIcon = '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg';
          var pinIcon2 = {
            url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
          };
        } else {
          var pinIcon = '/blocks/dealer-locator/images/volvo-pin-dealer.svg';
          var pinIcon2 = {
            url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
          };
        }
        marker.setIcon(pinIcon2), marker.pinIndex = pinIndex, templateClone.find('#marker').attr('src', pinIcon), pinIndex++;
      }
    }
    $.fn.myDealer(), $('<div/>', {
      html: templateClone,
      click() {
      },
      mouseenter() {
        $(this).click(function () {
          $(this).attr('clicked', 'yes');
        });
        const details = $.fn.getPinById(marker.ID);
        if (details.isCertifiedUptimeCenter) {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
            scaledSize: new google.maps.Size(58, 80),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
          if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
              scaledSize: new google.maps.Size(58, 80),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          }
        } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
            scaledSize: new google.maps.Size(58, 80),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
        } else {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
            scaledSize: new google.maps.Size(58, 80),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
        }
        marker.setIcon(pinIcon), $.fn.myDealer();
      },
      mouseleave() {
        if ($(this).attr('clicked') != 'yes') {
          const details = $.fn.getPinById(marker.ID);
          if (details.isCertifiedUptimeCenter) {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
            if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
              var pinIcon = {
                url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
                scaledSize: new google.maps.Size(17, 23),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
              };
            }
          } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          } else {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          }
          marker.setIcon(pinIcon), $.fn.myDealer();
        }
      },
    }).appendTo(nearbyHtml);
  });
};
$.fn.filterNearbyPins = function () {
  const $assist = 0; const $full = 0; const $rental = 0; const $partsService = 0; const $parts = 0; const $premium = 0; const
    $uptime = 0;
  const tmpPinList = []; const
    sorted = $.fn.sortedPins();
  $nearbyPins.forEach((pin) => {
    tmpPinList.push($.grep(sorted, (v, i) => v.IDENTIFIER_VALUE === pin)[0]);
  }), tmpPinList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)), $('#filterUptime,#filterElectricDealer,#filterDealer').css('cursor', 'pointer'), $('.no-dealer-text').hide(), $('#filterUptime,#filterElectricDealer,#filterDealer').css('background', '#484A4E'), $('#filterElectricDealerMobile,#filterDealerMobile,#filterUptimeMobile').css('background', '#484A4E'), $('#filterUptime,#filterElectricDealer,#filterDealer').removeData('toggled'), $('#filterElectricDealerMobile,#filterDealerMobile,#filterUptimeMobile').removeData('toggled'), document.getElementById('filterElectricDealer').style.pointerEvents = 'auto', document.getElementById('filterDealer').style.pointerEvents = 'auto', document.getElementById('filterUptime').style.pointerEvents = 'auto', document.getElementById('filterElectricDealerMobile').style.pointerEvents = 'auto', document.getElementById('filterDealerMobile').style.pointerEvents = 'auto', document.getElementById('filterUptimeMobile').style.pointerEvents = 'auto', $('#filterUptime, #filterUptimeMobile ').unbind().bind('click', function (e) {
    e.preventDefault();
    let tmpPinList2 = []; const
      toggled = $(this).data('toggled');
    $(this).data('toggled', !toggled), $('.nearby-pins').empty(), $('.no-dealer-text').hide();
    const filteredArray = tmpPinList.filter((item) => item.isCertifiedUptimeCenter == 1 || item.isCertifiedUptimeCenter == 1 && item.services && Object.values(item.services).includes('Volvo Certified EV Dealer'));
    filteredArray.length == 0 && ($('.nearby-pins').empty(), $('.no-dealer-text').show());
    const newList = []; let
      pins = [];
    return pins = $pins, pins && jQuery.grep(pins, (el) => {
      jQuery.inArray(el, filteredArray) == -1 && newList.push(el);
    }), toggled ? ($(this).css('background', '#484A4E'), $('.no-dealer-text').hide(), $.fn.tmpPins(tmpPinList), newList.forEach((pin) => {
      if (!$.fn.showPin(pin)) return !0;
      for (i = 0; i < $markers.length; i++) $markers[i].id == pin.IDENTIFIER_VALUE && (marker = $markers[i], marker.setMap($map));
    }), document.getElementById('filterElectricDealer').style.pointerEvents = 'auto', document.getElementById('filterDealer').style.pointerEvents = 'auto', document.getElementById('filterElectricDealerMobile').style.pointerEvents = 'auto', document.getElementById('filterDealerMobile').style.pointerEvents = 'auto', document.getElementById('dealer-tag').removeAttribute('title', $hoverText), document.getElementById('electric-tag').removeAttribute('title', $hoverText)) : ($(this).css('background', '#808080'), tmpPinList2 = filteredArray, $.fn.tmpPins(tmpPinList2), newList.forEach((pin) => {
      for (i = 0; i < $markers.length; i++) $markers[i].id == pin.IDENTIFIER_VALUE && (marker = $markers[i], marker.setMap(null));
    }), document.getElementById('filterElectricDealer').style.pointerEvents = 'none', document.getElementById('filterDealer').style.pointerEvents = 'none', document.getElementById('filterElectricDealerMobile').style.pointerEvents = 'none', document.getElementById('filterDealerMobile').style.pointerEvents = 'none', document.getElementById('dealer-tag').setAttribute('title', $hoverText), document.getElementById('electric-tag').setAttribute('title', $hoverText)), !1;
  }), $('#filterElectricDealer, #filterElectricDealerMobile ').unbind().bind('click', function (e) {
    e.preventDefault();
    let tmpPinList3 = []; const
      toggled = $(this).data('toggled');
    $(this).data('toggled', !toggled), $('.nearby-pins').empty(), $('.no-dealer-text').hide();
    const filteredDealerArray = tmpPinList.filter((item) => item.services && Object.values(item.services).includes('Volvo Certified EV Dealer'));
    filteredDealerArray.length == 0 && ($('.nearby-pins').empty(), $('.no-dealer-text').show());
    const newList = []; let
      pins = [];
    return pins = $pins, pins && jQuery.grep(pins, (el) => {
      jQuery.inArray(el, filteredDealerArray) == -1 && newList.push(el);
    }), toggled ? ($(this).css('background', '#484A4E'), $('.no-dealer-text').hide(), $.fn.tmpPins(tmpPinList), newList.forEach((pin) => {
      if (!$.fn.showPin(pin)) return !0;
      for (i = 0; i < $markers.length; i++) $markers[i].id == pin.IDENTIFIER_VALUE && (marker = $markers[i], marker.setMap($map));
    }), document.getElementById('filterDealer').style.pointerEvents = 'auto', document.getElementById('filterUptime').style.pointerEvents = 'auto', document.getElementById('filterDealerMobile').style.pointerEvents = 'auto', document.getElementById('filterUptimeMobile').style.pointerEvents = 'auto', document.getElementById('dealer-tag').removeAttribute('title', $hoverText), document.getElementById('uptime-tag').removeAttribute('title', $hoverText)) : ($(this).css('background', '#808080'), tmpPinList3 = filteredDealerArray, $.fn.tmpPins(tmpPinList3), newList.forEach((pin) => {
      for (i = 0; i < $markers.length; i++) $markers[i].id == pin.IDENTIFIER_VALUE && (marker = $markers[i], marker.setMap(null));
    }), document.getElementById('filterDealer').style.pointerEvents = 'none', document.getElementById('filterUptime').style.pointerEvents = 'none', document.getElementById('filterDealerMobile').style.pointerEvents = 'none', document.getElementById('filterUptimeMobile').style.pointerEvents = 'none', document.getElementById('dealer-tag').setAttribute('title', $hoverText), document.getElementById('uptime-tag').setAttribute('title', $hoverText)), !1;
  }), $('#filterDealer, #filterDealerMobile ').unbind().bind('click', function (e) {
    e.preventDefault();
    let tmpPinList4 = []; const
      toggled = $(this).data('toggled');
    $(this).data('toggled', !toggled), $('.nearby-pins').empty(), $('.no-dealer-text').hide();
    const filteredDealerArray = tmpPinList.filter((item) => void 0 == item.services || void 0 == item.isCertifiedUptimeCenter && item.services && Object.values(item.services).includes('Volvo Certified EV Dealer') || void 0 == item.isCertifiedUptimeCenter && item.services && !Object.values(item.services).includes('Volvo Certified EV Dealer'));
    filteredDealerArray.length == 0 && ($('.nearby-pins').empty(), $('.no-dealer-text').show());
    const newList = []; let
      pins = [];
    return pins = $pins, pins && jQuery.grep(pins, (el) => {
      jQuery.inArray(el, filteredDealerArray) == -1 && newList.push(el);
    }), toggled ? ($(this).css('background', '#484A4E'), $('.no-dealer-text').hide(), $.fn.tmpPins(tmpPinList), newList.forEach((pin) => {
      if (!$.fn.showPin(pin)) return !0;
      for (i = 0; i < $markers.length; i++) $markers[i].id == pin.IDENTIFIER_VALUE && (marker = $markers[i], marker.setMap($map));
    }), document.getElementById('filterElectricDealer').style.pointerEvents = 'auto', document.getElementById('filterUptime').style.pointerEvents = 'auto', document.getElementById('filterElectricDealerMobile').style.pointerEvents = 'auto', document.getElementById('filterUptimeMobile').style.pointerEvents = 'auto', document.getElementById('electric-tag').removeAttribute('title', $hoverText), document.getElementById('uptime-tag').removeAttribute('title', $hoverText)) : ($(this).css('background', '#808080'), tmpPinList4 = filteredDealerArray, $.fn.tmpPins(tmpPinList4), newList.forEach((pin) => {
      for (i = 0; i < $markers.length; i++) $markers[i].id == pin.IDENTIFIER_VALUE && (marker = $markers[i], marker.setMap(null));
    }), document.getElementById('filterElectricDealer').style.pointerEvents = 'none', document.getElementById('filterUptime').style.pointerEvents = 'none', document.getElementById('filterElectricDealerMobile').style.pointerEvents = 'none', document.getElementById('filterUptimeMobile').style.pointerEvents = 'none', document.getElementById('electric-tag').setAttribute('title', $hoverText), document.getElementById('uptime-tag').setAttribute('title', $hoverText)), !1;
  }), $.fn.tmpPins(tmpPinList), $(window).width() <= 768 ? $('.panel-footer').html(`<img src="${$.fn.drawPin('', 38, 38, '3F62A5')}" /> Certified Uptime Dealer`) : ($('.panel-footer').html(`Showing ${$nearbyPins.length} locations`), $isAsist && $('.panel-footer').html(`Showing ${$nearbyPins.length} ${$brandOptionSelected == 'dual' ? '' : $brandOptionSelected} locations`)), $('.loading-overlay').css('display', 'none');
};
$.fn.selectNearbyPins = function () {
  const nearbyHtml = $('.nearby-pins-select').empty();
  const tmpPinList = [];
  const
    sorted = $.fn.sortedPins();
  $nearbyPins.forEach((pin) => {
    tmpPinList.push($.grep(sorted, (v, i) => v.IDENTIFIER_VALUE === pin)[0]);
  }), tmpPinList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  let pinIndex = 1;
  tmpPinList.forEach((pin) => {
    if (!$.fn.showPin(pin)) return !0;
    const templateClone = $($('#nearbyPinDetails').clone(!0).html());
    templateClone.find('.panel-container').parent().attr('data-id', pin.IDENTIFIER_VALUE);
    const isOpen = $.fn.isOpen(pin);
    let
      isOpenHtml = '';
    isOpenHtml = isOpen.open && !isOpen.closeSoon ? `Open till ${moment(isOpen.endTime).format('h:mm A')}` : isOpen.open && isOpen.closeSoon ? 'Closing soon' : 'Closed', templateClone.find('.heading p').text($.fn.camelCase(pin.COMPANY_DBA_NAME)), templateClone.find('.hours').text(isOpenHtml), templateClone.find('.distance').text(`${pin.distance.toFixed(2)} mi`), templateClone.find('.address').text(pin.MAIN_ADDRESS_LINE_1_TXT), templateClone.find('.city').text(`${pin.MAIN_CITY_NM}, ${pin.MAIN_STATE_PROV_CD} ${pin.MAIN_POSTAL_CD}`), templateClone.find('.phone').text($.fn.formatPhoneNumber(pin.REG_PHONE_NUMBER)), templateClone.find('.website a').text('Dealer Site'), templateClone.find('.website a').attr('href', $.fn.formatWebAddress(pin.WEB_ADDRESS)), templateClone.find('.detail-website a').attr('href', $.fn.formatWebAddress(pin.WEB_ADDRESS)), templateClone.find('.detail-call').html(`<a href="tel:${pin.REG_PHONE_NUMBER}"><img src="/blocks/dealer-locator/images/Phone-2.png" />Call</a>`);
    let marker;
    for (i = 0; i < $markers.length; i++) {
      if ($markers[i].id == pin.IDENTIFIER_VALUE) {
        if (marker = $markers[i], $myDealer || ($myDealer = { IDENTIFIER_VALUE: $.fn.getCookie('my-dealer') }), $myDealer.IDENTIFIER_VALUE == pin.IDENTIFIER_VALUE) var pinIcon = $.fn.drawPin('', 43, 63, '328E04'); else {
          const details = $.fn.getPinById(pin.ID);
          if (details.isCertifiedUptimeCenter) {
            var pinIcon = '/blocks/dealer-locator/images/volvo-pin-uptime.svg';
            ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) && (pinIcon = '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg');
          } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) var pinIcon = '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg'; else var pinIcon = '/blocks/dealer-locator/images/volvo-pin-dealer.svg';
        }
        marker.setIcon(pinIcon), marker.pinIndex = pinIndex, templateClone.find('#marker').attr('src', pinIcon), templateClone.find('#marker').css('width', '31px'), templateClone.find('#marker').css('height', '43px'), pinIndex++;
      }
    }
    $.fn.myDealer(), $('<div/>', {
      html: templateClone,
      click() {
      },
      mouseenter() {
        $(this).click(function () {
          $(this).attr('clicked', 'yes');
        });
        const details = $.fn.getPinById(marker.ID);
        if (details.isCertifiedUptimeCenter) {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
          if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          }
        } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
        } else {
          var pinIcon = {
            url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
            scaledSize: new google.maps.Size(17, 23),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
        }
        marker.setIcon(pinIcon), $.fn.myDealer();
      },
      mouseleave() {
        if ($(this).attr('clicked') != 'yes') {
          const details = $.fn.getPinById(marker.ID);
          if (details.isCertifiedUptimeCenter) {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
            if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
              var pinIcon = {
                url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
                scaledSize: new google.maps.Size(17, 23),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
              };
            }
          } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          } else {
            var pinIcon = {
              url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
              scaledSize: new google.maps.Size(17, 23),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            };
          }
          marker.setIcon(pinIcon), $.fn.myDealer();
        }
      },
    }).appendTo(nearbyHtml);
  }), $(window).width() <= 768 ? $('.panel-footer').html(`<img src="${$.fn.drawPin('', 38, 38, '3F62A5')}" /> Certified Uptime Dealer`) : $('.panel-footer').html(`Showing ${$nearbyPins.length} locations`);
};
$.fn.getDistanceInKm = function ($b) {
  return $location ? ($R = 6371, $dLat = $.fn.deg2rad($b[0] - $location[0]), $dLon = $.fn.deg2rad($b[1] - $location[1]), $a = Math.sin($dLat / 2) * Math.sin($dLat / 2) + Math.cos($.fn.deg2rad($location[0])) * Math.cos($.fn.deg2rad($b[0])) * Math.sin($dLon / 2) * Math.sin($dLon / 2), $c = 2 * Math.atan2(Math.sqrt($a), Math.sqrt(1 - $a)), $d = $R * $c, $d) : 0;
};
$.fn.deg2rad = function ($deg) {
  return $deg * (Math.PI / 180);
};
$.fn.getTimezone = function (dealerId) {
  for (var time = Date.now(), dealerLength = $dealers.length, dealer = null, i = 0; i < dealerLength; i++) {
    if ($dealers[i].IDENTIFIER_VALUE == dealerId) {
      dealer = $dealers[i];
      break;
    }
  }
  dealer.timezone ? $.fn.isCurrentlyOpen(dealer) : $.ajax({
    url: `https://maps.googleapis.com/maps/api/timezone/json?location=${dealer.MAIN_LATITUDE},${dealer.MAIN_LONGITUDE}&timestamp=${Math.floor(time / 1e3)}&key=${$key}`,
    type: 'GET',
    success(data) {
      dealer.hourOffset = (data.rawOffset + data.dstOffset) / 60 / 60, dealer.timezone = data.timeZoneId, $.fn.isCurrentlyOpen(dealer);
    },
  });
};
$.fn.setAddress2 = function () {
  return address2 = $('#location2').val(), address2 ? ($geocoder = new google.maps.Geocoder(), $geocoder = new google.maps.Geocoder(), void $geocoder.geocode({ address: address2 }, (results, status) => {
    if (results.length == 0) setAddressNotFoundError(), console.log('results not found'); else {
      $map.viewtype = results[0].types[0];
      results[0].geometry.viewport.getNorthEast(), results[0].geometry.viewport.getSouthWest();
      $map.fitBounds(results[0].geometry.viewport), position = results[0].geometry.location;
      const pos = { lat: position.lat(), lng: position.lng() };
      $location = [position.lat(), position.lng()], $me || ($pin = {
        url: $meIcon,
        size: new google.maps.Size(100, 100),
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(30, 30),
      }, $me = new google.maps.Marker({
        position: { lat: $location[0], lng: $location[1] },
        title: 'ME',
        map: $map,
        zIndex: 0,
        icon: $pin,
      }), $me.setZIndex(0)), $me.setPosition({
        lat: parseFloat(pos.lat),
        lng: parseFloat(pos.lng),
      }), $radius ? ($radius.setCenter({
        lat: parseFloat(pos.lat),
        lng: parseFloat(pos.lng),
      }), $.fn.filterRadius()) : ($isAsist || ($radius = new google.maps.Circle({
        strokeColor: '#2c6ba4',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#2c6ba4',
        fillOpacity: 0.15,
        map: $map,
        center: pos,
        radius: $.fn.milesInMeters($('#range').val()),
      })), $('.loading-overlay').css('display', 'block'), $.fn.loadPins(), $.fn.sortedPins(), $.fn.switchSidebarPane('sidebar-pins')), $.fn.switchSidebarPane('sidebar-pins'), $('.waiting-overlay').css('display', 'none');
    }
  })) : null;
};
$.fn.setAddress = function () {
  return $(window).width() < 992 && (address = address2), address = $('#location').val(), address ? ($geocoder = new google.maps.Geocoder(), $geocoder = new google.maps.Geocoder(), void $geocoder.geocode({ address }, (results, status) => {
    if (results.length == 0) setAddressNotFoundError(), console.log('results not found'); else {
      $map.viewtype = results[0].types[0];
      results[0].geometry.viewport.getNorthEast(), results[0].geometry.viewport.getSouthWest();
      $map.fitBounds(results[0].geometry.viewport), position = results[0].geometry.location;
      const pos = { lat: position.lat(), lng: position.lng() };
      $location = [position.lat(), position.lng()], $me || ($pin = {
        url: $meIcon,
        size: new google.maps.Size(100, 100),
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(30, 30),
      }, $me = new google.maps.Marker({
        position: { lat: $location[0], lng: $location[1] },
        title: 'ME',
        map: $map,
        zIndex: 0,
        icon: $pin,
      }), $me.setZIndex(0)), $me.setPosition({
        lat: parseFloat(pos.lat),
        lng: parseFloat(pos.lng),
      }), $radius ? ($radius.setCenter({
        lat: parseFloat(pos.lat),
        lng: parseFloat(pos.lng),
      }), $.fn.filterRadius()) : ($isAsist || ($radius = new google.maps.Circle({
        strokeColor: '#2c6ba4',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#2c6ba4',
        fillOpacity: 0.15,
        map: $map,
        center: pos,
        radius: $.fn.milesInMeters($('#range').val()),
      })), $('.loading-overlay').css('display', 'block'), $.fn.loadPins(), $.fn.sortedPins(), $.fn.switchSidebarPane('sidebar-pins')), $.fn.switchSidebarPane('sidebar-pins'), $('.waiting-overlay').css('display', 'none');
    }
  })) : null;
};
$.fn.setLocation = function () {
  navigator.geolocation ? navigator.geolocation.getCurrentPosition((position) => {
    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
    $location = [position.coords.latitude, position.coords.longitude], $map.setCenter(pos), $map.setZoom(8), $radius ? ($me.setPosition({
      lat: parseFloat(pos.lat),
      lng: parseFloat(pos.lng),
    }), $radius.setCenter({
      lat: parseFloat(pos.lat),
      lng: parseFloat(pos.lng),
    }), $.fn.filterRadius()) : ($isAsist || ($radius = new google.maps.Circle({
      strokeColor: '#2c6ba4',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#2c6ba4',
      fillOpacity: 0.15,
      map: $map,
      center: pos,
      radius: $.fn.milesInMeters($('#range').val()),
    })), $.fn.loadPins(), $.fn.sortedPins(), $.fn.switchSidebarPane('sidebar-pins'));
    let address;
    const
      latlng = new google.maps.LatLng(pos.lat, pos.lng);
    $geocoder.geocode({ latLng: latlng }, (results, status) => {
      status == google.maps.GeocoderStatus.OK ? (results[6] ? address = results[0].formatted_address : results[0] ? address = results[5].formatted_address : console.log('no results found'), address && ($('.sidebar #location').val(address), $currentAddress = address, $('#location2').val(address), $currentAddress = address)) : console.log(`geocode failed due to: ${status}`);
    });
  }, () => {
    console.log('error with navigator'), $.fn.handleLocationError(!0);
  }) : (console.log('could not determine location'), $.fn.handleLocationError(!1));
};
$.fn.currentFilter = function () {
  return $current = $('#filter-options input:checked').first(), void 0 !== $current.get(0) ? $('#filter-options input:checked').first().attr('id') : '';
};
$.fn.currentFilterHumanReadable = function () {
  return $current = $('#filter-options input:checked').first(), void 0 !== $current.get(0) ? $('#filter-options input:checked').first().attr('value') : '';
};
$.fn.setMyDealer = function (dealer) {
  if ($myDealer != null && $myDealer.oldZIndex, $eventData = {
    dealer: '',
    dealerName: '',
    dealerHours: {},
    dealerNumber: '',
  }, dealer) {
    $myDealer = dealer;
    let marker;
    for (i = 0; i < $markers.length; i++) $markers[i].id == dealer.IDENTIFIER_VALUE && (marker = $markers[i]);
    const pinIcon = $.fn.drawPin('', 43, 63, '328E04');
    marker.setIcon(pinIcon), $myDealer.marker = marker;
    let hours = {};
    $myDealer.hours.Parts && (hours = $myDealer.hours.Parts), $.isEmptyObject(hours) && $myDealer.hours.Service && (hours = $myDealer.hours.Service), $.isEmptyObject(hours) && $myDealer.hours.Leasing && (hours = $myDealer.hours.Leasing), $eventData.dealer = $myDealer.IDENTIFIER_VALUE, $eventData.dealerName = $myDealer.COMPANY_DBA_NAME, $eventData.dealerHours = hours, $eventData.dealerNumber = $myDealer.REG_PHONE_NUMBER, $.fn.setCookie('my-dealer', $myDealer.IDENTIFIER_VALUE, 3650), $.fn.setCookie('my-dealer-name', $myDealer.COMPANY_DBA_NAME, 3650), $.fn.setCookie('my-dealer-hours', JSON.stringify(hours), 3650), $.fn.setCookie('my-dealer-number', $myDealer.REG_PHONE_NUMBER, 3650), $.fn.setCookie('my-dealer-coords', `${$myDealer.MAIN_LATITUDE},${$myDealer.MAIN_LONGITUDE}`, 3650), $.fn.setCookie('my-dealer-city', $myDealer.MAIN_ADDRESS_LINE_1_TXT, 3650), $.fn.setCookie('my-dealer-city', $myDealer.MAIN_ADDRESS_LINE_2_TXT, 3650), $.fn.setCookie('my-dealer-city', $myDealer.MAIN_CITY_NM, 3650), $.fn.setCookie('my-dealer-state', $myDealer.MAIN_STATE_PROV_CD, 3650), $.fn.setCookie('my-dealer-zip', $myDealer.MAIN_POSTAL_CD, 3650), $html.attr('data-dealer', $myDealer.IDENTIFIER_VALUE), $.fn.filterRadius();
  } else $.fn.deleteCookie('my-dealer'), $.fn.deleteCookie('my-dealer-name'), $.fn.deleteCookie('my-dealer-hours'), $.fn.deleteCookie('my-dealer-number'), $.fn.deleteCookie('my-dealer-coords'), $myDealer = null, $html.attr('data-dealer', '');
  $dealerEvent = new CustomEvent('my-dealer', { detail: $eventData }), window.dispatchEvent($dealerEvent);
};
$.fn.myDealer = function () {
  let marker;
  const
    dealer = $.fn.getCookie('my-dealer');
  for (i = 0; i < $markers.length; i++) {
    if ($markers[i].id == dealer) {
      const pinIcon = $.fn.drawPin('', 43, 63, '328E04');
      $markers[i].setIcon(pinIcon), marker = $markers[i];
    }
  }
  return marker;
};
$.fn.drawPin = function (text, width, height, color) {
  return text || (text = ''), color == '328E04' && $.fn.isMack(), color == '3F62A5' && $.fn.isMack() && (color = '85754d'), `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22${width}%22%20height%3D%22${height}%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23${color}%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E${text}%3C%2Ftext%3E%3C%2Fsvg%3E`;
};
$.fn.handleLocationError = function (browserHasGeolocation, infoWindow, pos) {
  browserHasGeolocation ? ($('.loading-overlay').css('display', 'none'), $('.waiting-overlay').css('display', 'block')) : alert("Error: Your browser doesn't support geolocation.");
};
$.fn.camelCase = function (str) {
  return str.toLowerCase().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
$.fn.formatPhoneNumber = function (str) {
  return str.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};
$.fn.formatWebAddress = function (str) {
  const prefix = 'http://';
  return str.substr(0, prefix.length) !== prefix ? prefix + str.toLowerCase() : str.toLowerCase();
};
$.fn.clearDirections = function () {
  $.fn.directionsMessage(), $directionResults = null, $directionsDisplay.setMap(null), $directionsObject = null, $wayPoints = [];
};
$.fn.mapDirections = function () {
};
$.fn.getCurrentRouteTimeInHours = function () {
  return $currentRoute = null, $currentTime = null, $directionResults && ($directionResults.routes && $directionResults.routes.length == 1 ? $currentRoute = $directionResults.routes[0] : $directionResults.routes && $directionResults.routes.length > 1 && ($referencePoint = $('.adp-listsel').first(), $currentRoute = $directionResults.routes[$referencePoint.attr('data-route-index')])), $currentRoute && ($currentTime = $currentRoute.legs[0].duration.value / 60 / 60), $currentTime;
};
$.fn.wayPointArray = function () {
  const waypoints = [];
  $wayPoints.length;
  for (const wayPoint in $wayPoints) $wayPoints.hasOwnProperty(wayPoint) && waypoints.push($wayPoints[wayPoint].point);
  return waypoints;
};
$.fn.directionsMessage = function (message) {
  message ? $directionsMessage.html(message) : $directionsMessage.html('');
};
$.fn.getUrlParameter = function (sParam) {
  let sParameterName;
  let i;
  const sPageURL = window.location.search.substring(1);
  const
    sURLVariables = sPageURL.split('&');
  for (i = 0; i < sURLVariables.length; i++) if (sParameterName = sURLVariables[i].split('='), sParameterName[0] === sParam) return void 0 === sParameterName[1] || decodeURIComponent(sParameterName[1]);
};
$.fn.snackbar = function (message) {
  const x = document.getElementById('locator-snackbar');
  x.innerHTML = message, x.className = 'show', setTimeout(() => {
    x.className = x.className.replace('show', '');
  }, 3e3);
};
$.fn.isMack = function () {
  return $.fn.brand() == 'mack';
};
$.fn.isVolvo = function () {
  return $.fn.brand() == 'volvo';
};
$.fn.brand = function () {
  return $html.is('[data-brand]') ? $html.attr('data-brand') : '';
};
$.fn.copyToClipboard = function (text) {
  typeof text !== 'string' && (text = $(text).attr('data-clipboard'));
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed', textArea.style.bottom = '0', textArea.style.left = '0', textArea.style.width = '2em', textArea.style.height = '2em', textArea.style.padding = '0', textArea.style.border = 'none', textArea.style.outline = 'none', textArea.style.boxShadow = 'none', textArea.style.background = 'transparent', textArea.value = text, document.body.appendChild(textArea), textArea.focus(), textArea.select();
  let result = !1;
  try {
    const successful = document.execCommand('copy');
    $.fn.snackbar('Copied to clipboard.'), result = !!successful;
  } catch (err) {
    result = !1;
  }
  return document.body.removeChild(textArea), result;
};
$.fn.registration = function (evt) {
  const dealerId = $(evt).attr('data-dealerid');
  const dealerZipcode = $(evt).attr('data-postalcode');
  const dealerEmail = $(evt).attr('data-dealeremail');
  const dealerName = $(evt).attr('data-name');
  const dealerFormTemplate = $($eloquaFormHTML).clone();
  $('.partsasist-form').toggle(), $('.partsasist-form h3').text(dealerName), dealerFormTemplate.find('input[name="Dealercode"]').val(dealerId), dealerFormTemplate.find('input[name="SelectedBrand"]').val($brandOptionSelected), dealerFormTemplate.find('input[name="DealerPartsEmail"]').val(dealerEmail), dealerFormTemplate.find('input[name="Postalcode"]').val(dealerZipcode), $('#select-form').html(dealerFormTemplate.html()), $('.ajax').each(function () {
    const frm = $(this);
    const
      frmId = frm.attr('id');
    $(this).find('.ajaxSitecoreEloquaSubmit').each(function () {
      let redirectURL = '';
      $("input[name='redirectURL']").length && (redirectURL = `, '${$("input[name='redirectURL']").val()}'`);
      $(this).attr('href', `javascript:void(submitSitecoreEloquaForm('${frmId}'${redirectURL}));`);
    });
    $(this).find('.ajaxEloquaSubmit').each(function () {
      let redirectURL = '';
      $jq1("input[name='redirectURL']").length && (redirectURL = `, '${$jq1("input[name='redirectURL']").val()}'`), $(this).attr('href', `javascript:void(submitEloquaForm('${frmId}'${redirectURL}));`);
    });
  });
};
$.fn.resetRegistration = function (evt) {
  $('.partsasist-form').toggle(), $('#select-form').html(''), $('.partsasist-form h3').text('');
};

$('.go-back').on('click', () => {
  $.fn.switchSidebarPane('sidebar-pins'), $wayPoints = [], $('.nearby-select').empty(), $('.sidebar-content').removeClass('direction-content'), $('.sidebar-legend').css('display', 'flex'), $('.sidebar').css('overflow', 'hidden'), $('.add-directions').text('Recalculate Directions');
});
$('.go-back-direction').on('click', () => {
  $.fn.switchSidebarPane('sidebar-pins');
  let $wayPoints = [];
  $('.nearby-select').empty();
  $('.sidebar-content').removeClass('direction-content');
  $('.sidebar-legend').css('display', 'flex');
  $('.sidebar').css('overflow', 'hidden');
  $('.add-directions').text('Recalculate Directions');
});
$('#location').on('keyup', (e) => {
  e.keyCode == 13 && $.fn.setAddress();
});
$('#location2').on('keyup', (e) => {
  e.keyCode == 13 && $.fn.setAddress2();
});
$('#cancel').on('click', () => {
  try {
    const details = $.fn.getPinById($viewingPin.ID);
    if (details.isCertifiedUptimeCenter) {
      var pinIcon = {
        url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
        scaledSize: new google.maps.Size(17, 23),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
      if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
        var pinIcon = {
          url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
          scaledSize: new google.maps.Size(17, 23),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
      }
    } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
      var pinIcon = {
        url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
        scaledSize: new google.maps.Size(17, 23),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
    } else {
      var pinIcon = {
        url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
        scaledSize: new google.maps.Size(17, 23),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
    }
    $viewingPin.setIcon(pinIcon), $.fn.myDealer();
  } catch (e) {
  }
  $('.nearby-pins').children().attr('clicked', '');
});
$('#cancel2').on('click', () => {
  try {
    const details = $.fn.getPinById($viewingPin.ID);
    if (details.isCertifiedUptimeCenter) {
      var pinIcon = {
        url: '/blocks/dealer-locator/images/volvo-pin-uptime.svg',
        scaledSize: new google.maps.Size(17, 23),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
      if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
        var pinIcon = {
          url: '/blocks/dealer-locator/images/volvo-pin-uptime-electric.svg',
          scaledSize: new google.maps.Size(17, 23),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
      }
    } else if ($electricDealer === !0 || details.services && Object.values(details.services).includes('Volvo Certified EV Dealer')) {
      var pinIcon = {
        url: '/blocks/dealer-locator/images/volvo-pin-dealer-electric.svg',
        scaledSize: new google.maps.Size(17, 23),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
    } else {
      var pinIcon = {
        url: '/blocks/dealer-locator/images/volvo-pin-dealer.svg',
        scaledSize: new google.maps.Size(17, 23),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
    }
    $viewingPin.setIcon(pinIcon), $.fn.myDealer();
  } catch (e) {
  }
  $('.nearby-pins').children().attr('clicked', '');
});

$(window).on('resize', () => {
  $(window).width() < 992 && $('.direction-content') ? ($('.sidebar').css('overflow', 'scroll'), $('.add-directions').text('Recalculate')) : ($('.sidebar').css('overflow', 'hidden'), $('.add-directions').text('Recalculate Directions')), $('#location').val() && $('#location2').val($('#location').val()), $('#location2').val() && $('#location').val($('#location2').val());
});
$(document).on('click', '.sidebar-content #filter-options input[type="checkbox"]', function (e) {
  return $clicked = $(this), $('.sidebar-content #filter-options input[type="checkbox"]:checked').length < 1 ? void $clicked.prop('checked', !0) : ($('.sidebar-content #filter-options input[type="checkbox"]').each(function (i) {
    $filter = $(this), $clicked.get(0) !== $filter.get(0) && $filter.prop('checked', !1);
  }), void $.fn.filterRadius());
});
$(document).on('click', '.accordion', function (eventObject) {
  $(this).next('.accordion-panel').slideToggle('slow');
  $(this).find('.toggle-arrow').toggleClass('close');
  document.getElementById('share-link').select();
});
$(document).on('click', '#set-dealer', function (eventObject) {
  console.log('inside set dealer');
  const pinId = $(this).attr('data-pin');
  const
    pin = $.fn.getPinById(pinId);
  $.fn.setMyDealer(pin), $(this).find('#set-dealer').html('<img src="/blocks/dealer-locator/images/Vector-3.svg" />');
});
$(document).on('click', '#print', function (eventObject) {
  const divToPrint = $(this).parents('.directions-panel').find('#directions-container');
  const newWin = window.open('', 'Print Window');
  newWin.document.open(), newWin.document.write(`<html><body onload="window.print()">${divToPrint.html()}</body></html>`), newWin.document.close(), setTimeout(() => {
    newWin.close();
  }, 10);
});

$.fn.initGoogleMaps();
