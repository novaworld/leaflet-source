import {geoJSON} from 'leaflet'
import {parseXML, addData, xhr} from '../helpers'
import toGeoJSON from 'togeojson'

/**
 * Load a GPX document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */

function gpxLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    xhr(url, (resp) => gpxParse(resp.responseXML || resp.responseText, options, layer), layer)
    return layer
}

function gpxParse(gpx, options, layer) {
    let xml = parseXML(gpx)
    if (!xml) return layer.fire('data:error', {error: 'Could not parse GPX'})
    layer = layer || geoJSON()
    let geojson = toGeoJSON.gpx(xml)
    addData(layer, geojson)
    return layer
}

gpxLoad.parse = gpxParse

export default gpxLoad