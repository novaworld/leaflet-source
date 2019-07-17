import {geoJSON} from 'leaflet'
import {xhr, addData, parseJSON} from "../helpers";

function geoJSONLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    xhr(url, (resp) => geoJSONParse(resp.responseText, options, layer), layer)
    return layer
}

function geoJSONParse(content, options, layer) {
    let json = parseJSON(content)
    if (!json) return layer.fire('data:error', {error: 'Could not parse GeoJSON'})
    layer = layer || geoJSON()
    addData(layer, json)
    return layer
}

geoJSONLoad.parse = geoJSONParse

export default geoJSONLoad