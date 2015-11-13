/*
 * lib/queries.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */



module.exports = function (options) {
    'use strict';

    var schema = options.schema || 'public';
    var prefix = options.prefix || '';

    function tableName(name) {
        return '"' + schema + '"."' + prefix + name + '"';
    }

    var queries = {
        getSVG: {
            params: ['minx', 'miny', 'maxx', 'maxy'],
            sql: "SELECT ST_AsSVG(ST_Transform(geom, 3857), 0, 8) as svg FROM " +
                 tableName(options.table) +
                 " WHERE ST_Intersects(geom, ST_SetSRID( ST_MakeBox2D(ST_Point($1, $2), ST_Point($3, $4)), 4326 ) );"
        }
    };
    return queries;
};
