

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

        var maxRow = 14,
            lineN = 0,
            cellN = 0;
        for (var r = 1; r <= maxRow; r++) {
            lineN = r;
            cellN = r;
            if ((r * r) >= results.length) {
                break;
            }
        }

        var paper = Raphael(container, rect.width, rect.height),
            elems = paper.set(),
            curX = 0,
            curY = 0,
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
                var elem = paper.path(tps);
                elems.push(elem);
                elem.data('bbox', Raphael.pathBBox(tps));
                elem.click(function(){
                    var bb = this.data('bbox');
                    var me = Raphael.matrix(1,0,0,1,0,0);
                    var se = rect.width / bb.width
                    me.translate((-bb.x) * se, (-bb.y) * se);
                    me.scale(se);
                    this.transform(me.toTransformString());
                    this.attr({
                        fill: 'blue'
                    });
                    this.toFront();
                });
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
