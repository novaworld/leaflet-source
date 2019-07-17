import {geoJSON} from 'leaflet'
import * as topojson from 'topojson/dist/topojson'
import {xhr, addData} from "../helpers";

/**
 * Load a [TopoJSON](https://github.com/mbostock/topojson) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function topojsonLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON();
    xhr(url, (resp) => topojsonParse(resp.responseText, options, layer), layer)
    return layer;
}

function topojsonParse(data, options, layer) {
    let o = typeof data === 'string' ?
        JSON.parse(data) : data;
    layer = layer || geoJSON();

    for (let i in o.objects) {
        let ft = topojson.feature(o, o.objects[i]);

        if (ft.features) addData(layer, ft.features);
        else addData(layer, ft);
    }
    return layer;
}

topojsonLoad.parse = topojsonParse

export default topojsonLoad