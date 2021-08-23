// Capitalize words
const capitalize = s => {
  s = s.toLowerCase()
  return s
    .split(/[\s_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.substring(1))
    .join(" ")
}

// Add events to "sector"
const onEachSector = (feature, layer) => {
  const prop = "sector"
  layer.on({
    click: e => {
      if (!e.target.getPopup()) {
        createPopup(e, prop)
        e.target.openPopup(e.latlng)
      } else {
        e.target.closePopup()
      }
      highlightFeature(e)
    },
    popupclose: e => {
      polygonLayerGroup.eachLayer(layer => {
        layer.resetStyle()
      })
    }
  })
  // Bind permanent tooltip to each sector
  layer.bindTooltip(feature.properties.sector.toLocaleString(), {
    direction: "center",
    permanent: true,
    className: "tooltip-custom-cl"
  })
}

// Add events to debri shipment port
const onEachPort = (feature, layer) => {
  const prop = "port"
  layer.on({
    click: e => {
      if (!e.target.getPopup()) {
        createPopup(e, prop)
        e.target.openPopup(e.latlng)
      } else {
        e.target.closePopup()
      }
    }
  })
}

// Add events to barge routes
const onEachBargeRoute = (feature, layer) => {
  const prop = "origin"
  layer.on({
    click: e => {
      if (!e.target.getPopup()) {
        createPopup(e, prop)
        e.target.openPopup(e.latlng)
      } else {
        e.target.closePopup()
      }
    }
  })
}

// Add events to truck routes
const onEachTruckRoute = (feature, layer) => {
  const prop = "destination"
  layer.on({
    click: e => {
      if (!e.target.getPopup()) {
        createPopup(e, prop)
        e.target.openPopup(e.latlng)
      } else {
        e.target.closePopup()
      }
    }
  })
}

// Add events to each building
const onEachBuilding = (feature, layer) => {
  const prop = "building"
  layer.on({
    click: e => {
      if (!e.target.getPopup()) {
        createPopup(e, prop)
        e.target.openPopup(e.latlng)
      } else {
        e.target.closePopup()
      }
      highlightFeature(e)
    },
    popupclose: e => {
      polygonLayerGroup.eachLayer(layer => {
        layer.resetStyle()
      })
    }
  })
}
// Add perma tooltip to fresh kills
const onEachArea = (feature, layer) => {
  layer.bindTooltip(feature.properties.location.toLocaleString(), {
    direction: "right",
    permanent: true,
    className: "tooltip-custom-fk"
  })
}

// Create a popup depending on the property/aka variable
const createPopup = (e, prop) => {
  const target = e.target
  const feature = target.feature

  const key = ["port", "building"].includes(prop) ? "name" : prop
  const property = feature.properties[key]
  const attribute = capitalize(key)

  const popupContent =
    property !== null
      ? [`<h6><strong>${attribute}:</strong><br>${property}</h6>`]
      : []

  if (prop === "sector") {
    const area = Math.round(feature.properties.area).toLocaleString("en")
    popupContent.push(`<h6><strong>Area:</strong><br>${area} sqft</h6>`)
  } else if (prop === "port") {
    const tons = Math.round(feature.properties["total_ton"]).toLocaleString(
      "en"
    )
    popupContent.push(
      `<h6><strong>Debris Tonnage:</strong><br>${tons} tons</h6>`
    )
  } else if (["origin", "destination"].includes(prop)) {
    const dist = (
      Math.round(feature.properties.length * 100) / 100
    ).toLocaleString("en")
    popupContent.push(`<h6><strong>Distance:</strong><br>${dist} miles</h6>`)
  } else if (prop === "building") {
    const damage = feature.properties.damage
    popupContent.push(`<h6><strong>Damage:</strong><br>${damage}</h6>`)
  }

  popupHTML = popupContent.join("")

  target.bindPopup(popupHTML, {
    autoPan: false,
    className: "popup-custom"
  })
}

// Change color of features that have been selected
const highlightFeature = e => {
  const target = e.target

  polygonLayerGroup.eachLayer(layer => {
    layer.resetStyle()
  })
  target.setStyle(myStyle.highlight)
}
