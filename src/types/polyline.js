import { geoJSON } from "leaflet";
import {xhr, addData} from "../helpers";
import polyline from 'polyline'

/**
 * Load a polyline string into a layer and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */

function polylineLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    xhr(url, (resp) => polylineParse(resp.responseText, options, layer), layer)
    return layer
}

function polylineParse(txt, options, layer) {
    layer = layer || geoJSON();
    options = options || {};
    // let coords = polyline.decode(txt, options.precision);
    // let geojson = { type: 'LineString', coordinates: [] };
    // for (let i = 0; i < coords.length; i++) {
    //     // polyline returns coords in lat, lng order, so flip for geojson
    //     geojson.coordinates[i] = [coords[i][1], coords[i][0]];
    // }
    let geojson = polyline.toGeoJSON(txt, options.precision)
    addData(layer, geojson);
    return layer;
}

polylineLoad.parse = polylineParse

export default polylineLoad