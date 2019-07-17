import { geoJSON } from "leaflet";
import { addData, xhr } from "../helpers";

function xlsxLoad(url, options, customLayer) {
    // let layer = customLayer || geoJSON()
    // xhr(url, (resp) => xlsxParse(resp.responseText, options, layer), layer)
    // return layer
}

function xlsxParse(xlsx, options, layer) {
    // layer = layer || geoJSON()
    // let geojson = wellknown(xlsx)
    // addData(layer, geojson)
    // return layer
}

xlsxLoad.parse = xlsxParse

export default xlsxLoad