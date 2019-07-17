import {geoJSON} from 'leaflet'
import {addData, xhr} from '../helpers'
import csv2geojson from 'csv2geojson'

/**
 * Load a CSV document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */

function csvLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    xhr(url, (resp) => csvParse(resp.responseXML || resp.responseText, options, layer), layer)
    return layer
}

function csvParse(csv, options, layer) {
    layer = layer || geoJSON();
    options = options || {
        latfield: 'lat',
        lonfield: 'lng',
        delimiter: ','
    }
    csv2geojson.csv2geojson(csv, options, onparse)

    function onparse(err, geojson) {
        if (err) return layer.fire('data:error', {error: err})
        addData(layer, geojson)
    }

    return layer
}

csvLoad.parse = csvParse

export default csvLoad