// Maki marker icon
const portIcon = new L.MakiMarkers.icon({
  icon: "ferry",
  color: "#15abc2",
  size: "l"
})

// INITIALIZING LAYERS
// LABEL LAYER
const labelLayer = L.tileLayer(
  "https://maps.nyc.gov/xyz/1.0.0/carto/label-lt/{z}/{x}/{y}.png8",
  {
    minNativeZoom: 8,
    maxNativeZoom: 19,
    subdomains: "1234",
    bounds: L.latLngBounds([40.0341, -74.2727], [41.2919, -71.9101])
  }
)

// BASE LAYERS
const mbLight = new L.tileLayer(mapboxURL, {
  id: "mapbox/light-v10",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  accessToken: accessToken
})

const mbStreets = new L.tileLayer(mapboxURL, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  accessToken: accessToken
})

const mbSatellite = new L.tileLayer(mapboxURL, {
  id: "mapbox/satellite-v9",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  accessToken: accessToken
})

// NYC 2001 ortho layer
const ortho2001 = new L.tileLayer(
  "https://maps.nyc.gov/xyz/1.0.0/photo/2001-2/{z}/{x}/{y}.png8",
  {
    minNativeZoom: 8,
    maxNativeZoom: 19,
    subdomains: "1234",
    bounds: L.latLngBounds([40.4888, -74.2759], [40.9279, -73.6896])
  }
)

const aerialGroup = new L.layerGroup([ortho2001, labelLayer])

// OVERLAY LAYERS
// Phase 1 Cleanup Sectors
const cleanup1 = new L.geoJSON(null, {
  style: myStyle.cleanup1,
  onEachFeature: onEachSector
})

// Phase 2 Cleanup Sectors
const cleanup2 = new L.geoJSON(null, {
  style: myStyle.cleanup2,
  onEachFeature: onEachSector
})

// Ports where WTC debris was shipped to Fresh Kills
const debrisPorts = new L.geoJSON(null, {
  pointToLayer: (feature, latlng) => {
    return L.marker(latlng, { icon: portIcon })
  },
  onEachFeature: onEachPort
})

// Route the barges carrying debris traveled
const bargeRoutes = new L.geoJSON(null, {
  style: myStyle.bargeRoutes,
  onEachFeature: onEachBargeRoute
})

// Probable truck routes to drive debris to port
const truckRoutes = new L.geoJSON(null, {
  style: myStyle.truckRoutes,
  onEachFeature: onEachTruckRoute
})

// Building damage and debris field from WTC collapse
const buildingDamage = new L.geoJSON(null, {
  style: myStyle.buildings,
  onEachFeature: onEachBuilding
})

// Areas regarding 9/11 debris and monument
const freshKills = new L.geoJSON(null, {
  style: myStyle.freshKills,
  onEachFeature: onEachArea
})

const polygonLayerGroup = new L.layerGroup([cleanup1, cleanup2, buildingDamage])

// Visibile layers on map
const shownLayers = new L.layerGroup([debrisPorts, bargeRoutes, cleanup1])

const myMap = new L.map("mapid", {
  center: [40.707, -74.007],
  zoom: 15,
  layers: [mbLight, shownLayers],
  attributionControl: false,
  doubleClickZoom: false,
  maxBounds: L.latLngBounds(L.latLng(40.33, -74.7), L.latLng(41.08, -73.2)),
  minZoom: 10,
  maxZoom: 18,
  tap: false // remove touch screen problems
})

// Add a legend on extent of building damage in lower Manhattan
const legend = new L.control({ position: "bottomleft" })
legend.onAdd = () => {
  let classes, colorFunc, title
  const div = new L.DomUtil.create("div", "info legend unselectable")

  classes = [
    "No Damage",
    "Moderate Damage",
    "Major Damage",
    "Partial Collapse",
    "Destroyed"
  ]
  colorFunc = myStyle.getBuildingColor
  title = '<h6 class="font-weight-bold">Building Damage</h6>'

  let html = [title]
  let labels = []
  for (let i = 0; i < classes.length; i++) {
    labels.push(
      `&ensp;<svg style="background: ${colorFunc(
        classes[i]
      )}; opacity: 0.6; border: 1px solid black; width: 1.3em; height: 1.3em"></svg>&emsp;${
        classes[i]
      }`
    )
  }
  html.push(labels.join("<br>"))
  div.innerHTML = html.join("")
  return div
}

// Group similar layers together
const groupedOverlays = {
  "DSNY Cleanup Zones": {
    "Phase 1": cleanup1,
    "Phase 2": cleanup2
  },
  "Debris Field": {
    "Building Damage": buildingDamage,
    "Fresh Kills Burial Site": freshKills
  },
  "WTC Debris Transport": {
    Ports: debrisPorts,
    "Truck Routes": truckRoutes,
    "Barge Routes": bargeRoutes
  }
}

// Grouped basemaps
const baseMaps = {
  Grayscale: mbLight,
  Streets: mbStreets,
  Satellite: mbSatellite,
  "Ortho 2001": aerialGroup
}
// Add grouped layer control
const layerControls = new L.control.groupedLayers(
  baseMaps,
  groupedOverlays
).addTo(myMap)

// Add in Geojson data.
$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/cleanup_zones1.geojson?token=ALPUUOBZ3NEPDJMF26HNBJ3BE74AC", data => {
  cleanup1.addData(data)
})

$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/cleanup_zones2.geojson?token=ALPUUOFWJJFNBS5NQXHGHRDBE75KG", data => {
  cleanup2.addData(data)
})

$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/debris_ports.geojson?token=ALPUUODZNKMNWGS2HWYOB2TBE75LG", data => {
  debrisPorts.addData(data)
})

$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/barge_routes.geojson?token=ALPUUODDLGD3XJILHNWPSR3BE75GM", data => {
  bargeRoutes.addData(data)
})

$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/truck_routes.geojson?token=ALPUUODMXXSAWHSBVW7G3U3BE75OY", data => {
  truckRoutes.addData(data)
})

$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/building_damage.geojson?token=ALPUUOAFUTRN26ZG2CMWZBLBE75IW", data => {
  buildingDamage.addData(data)
})

$.getJSON("https://raw.githubusercontent.com/allan-lu/dsny/main/fresh_kills.geojson?token=ALPUUOHTUU7RP5HT5HSTIHLBE75NM", data => {
  freshKills.addData(data)
})

// Map events
myMap.on({
  baselayerchange: base => {
    shownLayers.addLayer(base.layer).addLayer(labelLayer)
    if (base.name !== "Ortho 2001") {
      shownLayers.removeLayer(labelLayer)
    }
  },
  overlayadd: overlay => {
    const zoom = myMap.getZoom()
    // layer style shoould be reset
    polygonLayerGroup.eachLayer(layer => {
      layer.resetStyle()
      if (zoom > 14) {
        layer.eachLayer(feature => {
          const center = feature.getBounds().getCenter()
          feature.openTooltip(center)
        })
      }
      if (zoom <= 14) {
        layer.eachLayer(feature => {
          feature.closeTooltip()
        })
      }
    })
    shownLayers.addLayer(overlay.layer)

    if (overlay.name == "Building Damage") legend.addTo(myMap)
  },
  overlayremove: overlay => {
    shownLayers.removeLayer(overlay.layer)

    if (overlay.name == "Building Damage") myMap.removeControl(legend)
  },
  // hide permanent cleanup sector tooltips at certain zoom levels
  zoomend: () => {
    const zoom = myMap.getZoom()
    polygonLayerGroup.eachLayer(layer => {
      if (zoom > 14) {
        layer.eachLayer(feature => {
          const center = feature.getBounds().getCenter()
          feature.openTooltip(center)
        })
      }
      if (zoom <= 14) {
        layer.eachLayer(feature => {
          feature.closeTooltip()
        })
      }
    })
  }
})

$(document).ready(() => {
  // Header buttons pan & zoom the map to the selected area of interest,
  // Also display the desired layers
  $("#header button").click(e => {
    let bounds
    const id = $(e.target).attr("id")
    const options = { duration: 0.25 }
    shownLayers.clearLayers()
    if (id == "btn-cz") {
      bounds = cleanup2.getBounds()
      shownLayers.addLayer(mbLight).addLayer(cleanup2).addLayer(debrisPorts)
    } else if (id == "btn-df") {
      bounds = buildingDamage.getBounds()
      shownLayers.addLayer(aerialGroup).addLayer(buildingDamage)
    } else if (id == "btn-dt") {
      bounds = truckRoutes.getBounds()
      shownLayers
        .addLayer(mbLight)
        .addLayer(debrisPorts)
        .addLayer(bargeRoutes)
        .addLayer(truckRoutes)
    } else if (id == "btn-fk") {
      bounds = freshKills.getBounds()
      shownLayers.addLayer(mbSatellite).addLayer(freshKills).addLayer(debrisPorts)
    }
    myMap.flyToBounds(bounds, options)
    shownLayers.addTo(myMap)
  })
  myMap.flyToBounds(cleanup1.getBounds())
})