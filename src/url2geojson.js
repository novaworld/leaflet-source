// import XLSX from 'xlsx'
// import toGeoJSON from 'togeojson'
// import wellknown from 'wellknown'
// import polyline from 'polyline'
// import csv2geojson from 'csv2geojson'
// import { get, isArray, includes, head, omit, map, zipObject, values, mapKeys, invert, mapValues } from 'lodash'
// import shp from "shpjs"
// import axios from 'axios'
// import { point } from '@turf/turf'
//
// export function file2geojson(file, options, customLayer) {
//     let
//         layer = customLayer || L.geoJson(),
//         parser,
//         reader = new FileReader()
//
//     parser = getParser(file.name, 'file')
//     if (!parser) {
//         setTimeout(() => layer.fire('data:error', {error: new Error('Unsupported file type')}))
//         return layer
//     }
//
//     reader.onload = function (e) {
//         let format = parser.ext,
//             params = {filename: file.name, format},
//             data = e.target.result
//         try {
//             layer.fire('data:loading', params)
//             parser.processor.call(this, data, options, layer)
//             layer.fire('data:loaded', params)
//         } catch (err) {
//             layer.fire('data:error', {error: err});
//         }
//     }
//
//     if (!file.testing) {
//         if (includes(['zip', 'xls', 'xlsx'], parser.ext)) {
//             reader.readAsArrayBuffer(file)
//         } else {
//             reader.readAsText(file)
//         }
//     }
//
//     return layer
// }
//
import { geoJSON } from 'leaflet'
import URI from 'urijs'
import FileSaver from 'file-saver'
import * as topojson from 'topojson'
import tokml from 'tokml'
import shpwrite from 'shp-write'
import polyline from 'polyline'
import { getParserFn, getType } from "./helpers";
import { isURL } from '@ttungbmt/validator'
import { get, isPlainObject } from 'lodash'

export function toGeoJSON(input, options, customLayer) {
    let layer = customLayer || geoJSON(),
        type = getType(input),
        data = getDataFromType(input, type)

    let parserFn = getParserFn(input)

    if (!parserFn) {
        console.log(parserFn)
        // setTimeout(() => layer.fire('data:error', {error: new Error(`Unsupported file type: ${ext}`)}))
        return layer
    }

    return parserFn(data, options, customLayer)
}

function getDataFromType(input, type) {
    let url = get(input, 'url')
    if (url) return url

    switch (type) {
        case 'geojson':
            return get(input, 'data')
        default:
    }
}

export function url2geojson(url, options, customLayer) {
    let layer = customLayer || geoJSON()
    let parser = getParser(url, 'url')
    // if (!parser) {
    //     // setTimeout(() => layer.fire('data:error', {error: new Error('Unsupported file type')}))
    //     // return layer
    // }
    // return parser.processor.call(this, url, options, layer)
}

function convertFromGeoJSON(options) {

}

const callbackFn = function (geoJSON, str) {

}

export function toGeospatialFile(input, type, callback = callbackFn, options = {}) {
    if (URI(input).is('url')) {
        let uri = URI(input),
            url = uri.toString(),
            ext = uri.suffix()


        getParserFn(ext)(url).on('data:loaded', layer => {
            let geoJSON = layer.toGeoJSON(),
                geoJSONStr = JSON.stringify(geoJSON),
                blob;

            try {
                switch (type) {
                    case 'csv':
                        break;
                    case 'geojson':
                        callback(geoJSON, geoJSONStr)
                        break;
                    case 'json':
                        callback(geoJSON, geoJSONStr)
                        break;
                    case 'gpx':
                        break;
                    case 'kml':
                        callback(geoJSON, tokml(geoJSON))
                        break;
                    case 'polyline':
                        callback(geoJSON, polyline.fromGeoJSON(geoJSON))
                        break;
                    case 'shp':
                        // shpwrite.download(geoJSON, options);
                        callback(geoJSON)
                        break;
                    case 'topojson':
                        callback(geoJSON, JSON.stringify(topojson.topology(geoJSON)))
                        break;
                    case 'wkt':
                        break;
                    case 'xlsx':
                        break;
                    default:
                }
            } catch (e) {
                console.error(e);
            }
        })
    }
}

export function downloadGeospatialFile(input, output, options = {}) {
    if (URI(input).is('url')) {
        let uri = URI(input),
            url = uri.toString(),
            outputExt = output.split('.')[1]

        toGeospatialFile(input, outputExt, (geoJSON, string) => {
            switch (outputExt) {
                case 'json':
                    FileSaver.saveAs(new Blob([string], {type: "application/json"}), output);
                    break
                case 'shp':
                    shpwrite.download(geoJSON, options);
                    break;
                default:
                    FileSaver.saveAs(new Blob([string]), output);
            }
        }, options)
    }
}


function getParser(url, type = 'file') {
    let uri = URI(url),
        filename = uri.filename(),
        ext = uri.suffix()


    getParserFn(ext)(url).on('data:loaded', layer => {
        let geoJSON = layer.toGeoJSON()
        try {
            // let blob = new Blob([JSON.stringify(geoJSON)], {type: "application/json"});
            // FileSaver.saveAs(blob, "map.geojson");

        } catch (e) {
            console.error(e);
        }

        /*
        geojson => [kml, kmz, csv, xlsx, polyline, shp, wkt, topojson]


         */
    })


    // kml(url)
    // let parser,
    //     ext = name.split('.').pop(),
    //     suffix = (type === 'file') ? 'Parse' : 'Load'
    //
    // switch (ext) {
    //     case 'xlsx':
    //     case 'xls':
    //         parser = 'excel';
    //         break
    //     case 'csv':
    //         parser = 'csv';
    //         break
    //     case 'txt':
    //         break
    //     case 'geojson':
    //     case 'json':
    //         parser = 'geoJSON';
    //         break
    //     case 'zip':
    //         parser = 'shp';
    //         break
    //     case 'kml':
    //         parser = 'kml';
    //         break
    //     case 'gpx':
    //         parser = 'gpx';
    //         break
    //     default:
    //         break
    // }

    // try {
    //     parser = eval(`${parser}${suffix}`)
    //     return {processor: parser, ext}
    // } catch (err) {
    //     return undefined
    // }
}


//

//

//

//


//
// function excelParse(buffer, options, layer) {
//     options = options || {
//         latfield: 'lat',
//         lonfield: 'lng',
//     }
//
//     let arr = new Uint8Array(buffer)
//     let workbook = XLSX.read(arr, {type: 'array'})
//     let sheetName = get(workbook, 'SheetNames.0')
//     let ws = get(workbook, `Sheets.${sheetName}`)
//     if (!ws) return layer.fire('data:error', {error: 'Could not parse Excel'})
//     let obj = XLSX.utils.sheet_to_json(ws, {header: 'A'})
//     // Convert obj to geojson
//     let header = head(obj)
//
//     let geojson = obj.slice(1).map((i, k) => {
//         let defVal = mapValues(invert(header), o => null)
//         let item = {...defVal, ...mapKeys(i, (val, key) => (header[key]))}
//         let coords = [item[options.lonfield], item[options.latfield]].map(v => v ? parseFloat(v) : 0)
//         let props = omit(item, [options.lonfield, options.latfield])
//         return point(coords, props)
//     })
//
//     layer = layer || L.geoJson()
//     addData(layer, geojson)
//     return layer
// }
//
