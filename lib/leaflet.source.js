import Source from '../src/index'

/**
 * Leaflet.Source
 * @author Trương Thanh Tùng
 * @license MIT
 */
(function (window, document, undefined) {
    if ( !window.L) {
        return;
    }

    L.source = function (id, data, options) {
        return new Source(id, data, options);
    };
})(window, document);