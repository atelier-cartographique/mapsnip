

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
                var m1 = Raphael.matrix(1,0,0,1,0,0);

                var s = cellWidth / bbox.width;
                if (bbox.height > bbox.width) {
                    s = lineHeight / bbox.height;
                }
                m.translate((-bbox.x) * s, (-bbox.y) * s);
                m.scale(s);
                m.translate(curX / s, curY / s);

                var tps = Raphael.mapPath(ps, m);
                var elem = paper.path(tps);
                elems.push(elem);

                var bbox1 = elem.getBBox();
                var s1 = rect.width / bbox1.width;
                m1.translate((-bbox1.x) * s1, (-bbox1.y) * s1);
                m1.scale(s1);
                m1.translate(0, 0);
                // elem.transform(m.toTransformString());
                //
                // var dr = paper.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                // dr.transform(m.toTransformString());

                elem.data('mat', Raphael.matrix(1,0,0,1,0,0));
                elem.data('mat1', m1);
                elem.data('layer', 'back');

                elem.click(function(){
                    var layer = this.data('layer'),
                        mat = this.data('mat'),
                        mat1 = this.data('mat1');
                    if ('back' === layer) {
                        this.transform(mat1.toTransformString());
                        this.attr({
                            fill: '#DD0014',
                            stroke: 'none'
                        });
                        this.toFront();
                        this.data('layer', 'fore');
                    }
                    else if ('fore' === layer) {
                        this.transform(mat.toTransformString());
                        this.attr({
                            fill: 'grey'
                        });
                        this.toBack();
                        this.data('layer', 'back');
                    }
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
