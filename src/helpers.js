import { isArray, find, get, isObject, isString } from 'lodash'
import { isURL } from '@ttungbmt/validator'
import axios from 'axios'
import * as files from "./types/index"
import URI from "urijs";

export function xhr(request, parseCallback, layer) {
    layer.fire('data:loading')
    axios(request)
        .then(function (resp) {
            layer.fire('data:loaded', parseCallback(resp.request))
        })
        .catch(function (err) {
            return layer.fire('data:error', {error: err})
        })
}

export function getParserFn(input) {
    let url = get(input, 'url', input),
        type = getType(input)

    let parserMap = [
        {type: 'csv', function: 'csv'},
        {type: 'geojson', function: 'geojson'},
        {type: 'json', function: 'geojson'},
        {type: 'gpx', function: 'gpx'},
        {type: 'kml', function: 'kml'},
        {type: 'polyline', function: 'polyline'},
        {type: 'shp', function: 'shp'},
        {type: 'topojson', function: 'topojson'},
        {type: 'wkt', function: 'wkt'},
        {type: 'xlsx', function: 'xlsx'},
    ].map(i => ({type: i.type, function: isURL(url) ? files[i.function] : files[i.function].parse}))


    return get(find(parserMap, {type}), 'function')
}

function getTypeFromUrl(url) {
    let ext = URI(url).suffix()

    // ext: type
    let extensions = {
        csv: 'csv',
        geojson: 'geojson',
        json: 'geojson',
        gpx: 'gpx',
        kml: 'kml',
        kmz: 'kml',
        txt: 'polyline',
        zip: 'shp',
        topojson: 'topojson',
        wkt: 'wkt',
        xlsx: 'xlsx',
        xls: 'xlsx',
    }

    return get(extensions, ext)
}

export function getType(input) {
    if (isObject(input)) {
        let url = get(input, 'url'),
            type = get(input, 'type')
        if (type) return type
        if (url && isURL(url)) return getTypeFromUrl(url)
    }

    if (isString(input) && isURL(input)) {
        return getTypeFromUrl
    }

    return null
}

export function parseJSON(str) {
    if (typeof str === 'string') {
        return JSON.parse(str)
    } else {
        return str
    }
}

export function parseXML(str) {
    if (typeof str === 'string') {
        return (new DOMParser()).parseFromString(str, 'text/xml')
    } else {
        return str
    }
}

export function addData(l, d) {
    if ('setGeoJSON' in l) {
        l.setGeoJSON(d)
    } else if ('addData' in l) {
        l.addData(d)
    }
}

export function geojson2features(geojson) {
    let features = []
    if (isArray(geojson)) {
        geojson.map(i => {
            features = features.concat(i.features)
        })
    } else {
        features = features.concat(geojson)
    }

    return features
}