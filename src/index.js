import { isString, get, isPlainObject, omit, includes, upperFirst, map } from 'lodash'
import { parseJSON, orValue, uniqid, slugify, getOrValue } from '@ttungbmt/utils'
import { isJSONStr } from '@ttungbmt/validator'
import { toGeoJSON } from "./url2geojson";
import L from 'leaflet'

const optionKeys = ['popupTemplate', 'style']

 /*
Supported:
+ Raster: wms, wtms, tile, image (png, geotiff), video
+ Vector:
    marker, polygon, polyline, rectangle, cirlce, circleMarker
    geojson, csv, gpx, kml, kmz, polyline, shp, topojson, wkt, xlsx, xls
*/

const supportedFiles = ['geojson', 'json', 'csv', 'gpx', 'kml', 'kmz', 'polyline', 'shp', 'topojson', 'wkt', 'xlsx', 'xls']

class Source {
    // id: string
    // type: string
    // data: Object | Array | string
    // options: Object = {}
    // _layer: Object

    constructor(id, data, options = {}) {
        this.id = orValue(id, uniqid('source_'))
        this.type = this.getType(data)
        this.data = this.formatData(data) || {}
        this.options = this.getOptions(data, options)

        if (this.data) this.setLayer(this.data)
    }

    setLayer(data) {
        switch (this.type){
            case 'wms':
                this._layer = L.tileLayer.wms(this.data.options.url, this.data.options)
                break
            case 'wmts':
                break
            case 'tile':
                this._layer = L.tileLayer(this.data.options.url, this.data.options)
                break
            case 'wfs':
                break
            case 'marker':
            case 'circleMarker':
            case 'circle':
            case 'polyline':
            case 'polygon':
            case 'rectangle':
            case 'video':
            case 'image':
            case 'svg':
            case 'layerGroup':
            case 'featureGroup':
                this._layer = this[`_add${upperFirst(this.type)}`](data)
                break
            default:
                if(includes(supportedFiles, this.type)){
                    let geoJSON = L.geoJSON.style(null, this.options)
                    this._layer = toGeoJSON(data, {}, geoJSON)
                }

                break
        }
    }

    getLayer(){
        return this._layer
    }

    _addMarker(data){
        return L.marker(data.data || data.latlng, data.options || {})
    }

    _addCircleMarker(data){
        return L.circleMarker(data.data || data.latlng, data.options || {})
    }

    _addCircle(data){
        return L.circle(data.data || data.latlng, data.options || {})
    }

    _addPolyline(data){
        return L.polyline(data.data || data.latlngs, data.options || {})
    }

    _addPolygon(data){
        return L.polygon(data.data || data.latlngs, data.options || {})
    }

    _addRectangle(data){
        return L.rectangle(data.data || data.latLngBounds, data.options || {})
    }

    _addVideo(data){
        return L.videoOverlay(getOrValue(data, ['video', 'url', 'data']), data.bounds, data.options || {})
    }

    _addImage(data){
        let options = Object.assign({
            opacity: 1,
            bounds: [
                [-256, 0],
                [0, 256]
            ]
        }, data.options)

        return L.videoOverlay(getOrValue(data, ['imageUrl', 'url', 'data']), data.bounds, options)
    }

    _addSvg(data){
        return L.svgOverlay(data.svg || data.data, data.bounds, data.options || {})
    }

    _addFeatureGroup(data){
        let featureGroup = L.featureGroup();

        map(getOrValue(data, ['layers', 'data'], []), (layer) => {
            let source = new Source(null, layer)
            featureGroup.addLayer(source.getLayer())
        })

        return featureGroup
    }

    _addLayerGroup(data){
        let layerGroup = L.featureGroup();

        map(getOrValue(data, ['layers', 'data'], []), (layer) => {
            let source = new Source(null, layer)
            layerGroup.addLayer(source.getLayer())
        })

        return layerGroup
    }

    addTo(map) {
        if (this._layer) map.addLayer(this._layer)
        return this._layer
    }

    removeFrom(map){
        if (this._layer) map.removeLayer(this._layer)
        return this._layer
    }

    getOptions(data, options){
        return Object.assign({}, this.options, _.pick(data, optionKeys), options)
    }

    getType(data){
        return get(data, 'type')
    }

    formatData(data) {
        if (isJSONStr(data)) return data = parseJSON(data)
        if(isPlainObject(data)) return omit(data, optionKeys)

        return data
    }
}

export default Source