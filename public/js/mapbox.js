/* eslint-disable no-undef */

const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken =
  'pk.eyJ1Ijoic3VwZXJ0YWkyMjI5OCIsImEiOiJja2tuY25yM3czMWJiMm9xdWw5N3RyM3g3In0.otu_9JvHEbxSSY7unpjnZg'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/supertai22298/ckkndfe755m0t17qt7cgbatej',
  scrollZoom: false,
  // center: [108.173206, 16.048718],
  // zoom: 8,
})

const bounds = new mapboxgl.LngLatBounds()

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div')
  el.className = 'marker'

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map)

  new mapboxgl.Popup({
    offset: 30,
    closeButton: false,
    closeOnClick: false,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
})
