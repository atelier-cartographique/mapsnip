

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
        var paper = Raphael(container, rect.width, rect.height),
            elems = paper.set(),
            curX = 0,
            curY = 0,
            lastHeight = 0,
            lineN = 4,
            rLen = Math.min(results.length, 200),
            cellN = Math.ceil(rLen / lineN),
            lineHeight = rect.height / lineN,
            cellWidth = rect.width / cellN;
        for (var l = 0; l < lineN; l++) {
            curY = l * lineHeight;
            for (var c = 0; c < cellN; c++) {
                curX = c * cellWidth;
                var i = (l * cellN) + c;
                if (i > (results.length - 1)) {
                    break;
                }
                var ps = results[i].svg;
                var bbox = Raphael.pathBBox(ps);
                var m = Raphael.matrix(1,0,0,1,0,0);
                var s = cellWidth / bbox.width
                m.translate((-bbox.x) * s, (-bbox.y) * s);
                m.scale(s);
                m.translate(curX / s, curY / s);
                var tps = Raphael.mapPath(ps, m);
                // console.log(Raphael.pathBBox(tps));
                elems.push( paper.path(tps) );
            }
        }
        elems.attr({
            fill: 'black'
        });
    });
}


$(document).ready(function(){
     map = L.map('map-container', {
        center: [50.850431249042046, 4.048461914062501],
        zoom: 13
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
        attribution: 'ATTR',
        maxZoom: 18
    }).addTo(map);
    $('#submit').on('click', getSVG);
});
