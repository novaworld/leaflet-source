import {geoJSON} from 'leaflet'
import {parseXML, addData, xhr} from '../helpers'
import toGeoJSON from 'togeojson'

function kmlParse(gpx, options, layer) {
    let xml = parseXML(gpx)
    if (!xml) return layer.fire('data:error', {error: 'Could not parse KML'})
    layer = layer || geoJSON()
    let geojson = toGeoJSON.kml(xml)
    addData(layer, geojson)
    return layer
}

/**
 * Load a [KML](https://developers.google.com/kml/documentation/) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */

function kmlLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    xhr(url, (resp) => kmlParse(resp.responseXML || resp.responseText, options, layer), layer)
    return layer
}

kmlLoad.parse = kmlParse

export default kmlLoad