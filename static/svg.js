

var map;

function getExtent () {
    return map.getBounds();
}

function getSVG () {
    var extent = getExtent(),
        minx = extent.getWest(),
        miny = extent.getSouth(),
        maxx = extent.getEast(),
        maxy = extent.getNorth(),
        url = '/svg/' + [minx, miny,maxx,maxy].join('/');

    $.getJSON(url, function(results) {
        var container = document.getElementById("map-container"),
            rect = container.getBoundingClientRect();
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        var paper = Raphael(container, rect.width, rect.height);
        for(var i = 0; i < results.length; i++) {
            var p = paper.path(results[i].svg);
        }
    });
}


$(document).ready(function(){
     map = L.map('map-container', {
        center: [51.505, -0.09],
        zoom: 13
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
        attribution: 'ATTR',
        maxZoom: 18
    }).addTo(map);
    $('#submit').on('click', getSVG);
});
