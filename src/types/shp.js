import {geoJSON} from 'leaflet'
import shp from 'shpjs'
import {addData, geojson2features} from '../helpers'

function shpLoad(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    shp(url).then(function (geojson) {
        let features = geojson2features(geojson)
        addData(layer, features)
        layer.fire('data:loaded', layer)

    }).catch(function (err) {
        layer.fire('data:error', {error: err})
    })

    return layer
}

function shpParse(buffer, options, layer) {
    layer = layer || geoJSON()
    let features = geojson2features(shp.parseZip(buffer))
    addData(layer, features)
    return layer
}

shpLoad.parse = shpParse

export default shpLoad