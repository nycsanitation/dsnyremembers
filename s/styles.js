const accessToken =
  "pk.eyJ1IjoicmhpZ2dpbnMiLCJhIjoic1ZCV1I2byJ9.kMLgoNIPFb6yNAyKNG_ZQg"
const mapboxAPI =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
L.MakiMarkers.accessToken = accessToken

// Maki marker icon
const portIcon = new L.MakiMarkers.icon({
  icon: "harbor",
  color: "#15abc2",
  size: "m"
})

const videoIcon = new L.MakiMarkers.icon({
  icon: "cinema",
  color: "#000000",
  size: "m"
})

const myStyle = {
  // First phase of clean up: 9/11/01 to 9/14/02
  cleanup1: {
    color: "#0da16a",
    fillColor: "#42f5b3",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6
  },
  // Second phase of clean up: 9/14/01 to 6/7/02
  cleanup2: {
    color: "#503082",
    fillColor: "#a783de",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6
  },
  // Harbor ports where debris was driven directly to for sortment and shipping to Fresh Kills
  ports: {
    radius: 1,
    color: "sienna",
    fillColor: "sienna",
    pane: "pointsPane"
  },
  // Barge routes from debris disposal sites to Fresh Kills
  bargeRoutes(feature) {
    return {
      color: ["#82eefd", "#016064", "#0492c2", "#1338be"][
        feature.properties.id - 1
      ]
    }
  },
  // Truck routes 
  truckRoutes(feature) {
    return {
      color: ["#ffdead", "#59260b", "#d2b48c", "#cd853f", "#8b4513"][
        feature.properties.id - 1
      ]
    }
  },
  // Was a literal dump
  freshKills(feature) {
    return {
      weight: 2,
      opacity: 6,
      color: "black",
      fillOpacity: 0.7,
      fillColor: ["#ede6b9", "#77c593", "#b85042"][feature.properties.id - 1]
    }
  },
  // building damage
  buildings(feature) {
    return {
      color: myStyle.getBuildingColor(feature.properties.damage),
      fillColor: myStyle.getBuildingColor(feature.properties.damage),
      weight: 2,
      opacity: 1,
      fillOpacity: 0.6
    }
  },
  highlight: {
    color: "#3db8ad",
    fillColor: "#03fce8",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6
  },
  getBuildingColor(damage) {
    const color =
      damage == "Destroyed"
        ? "#563587"
        : damage == "Partial Collapse"
        ? "#9c1010"
        : damage == "Major Damage"
        ? "#de9000"
        : damage == "Moderate Damage"
        ? "#d4d00b"
        : "#4ec439"
    return color
  }
}
