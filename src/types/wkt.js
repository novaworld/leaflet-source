import {geoJSON} from 'leaflet'
import wellknown from 'wellknown'
import {xhr, addData} from "../helpers";

/**
 * Load a WKT (Well Known Text) string into a layer and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */

function wktLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    xhr(url, (resp) => wktParse(resp.responseText, options, layer), layer)
    return layer
}

function wktParse(wkt, options, layer) {
    layer = layer || geoJSON()
    let geojson = wellknown(wkt)
    addData(layer, geojson)
    return layer
}

wktLoad.parse = wktParse

export default wktLoad