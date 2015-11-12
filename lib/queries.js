/*
 * lib/queries.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */



module.exports = function (prefix, schema) {
    'use strict';

    schema = schema || 'public';
    prefix = prefix || '';

    function tableName(name) {
        return '"'+schema+'"."'+prefix+name+'"';
    }

    var queries = {
        getSVG: {
            params: ['minx', 'miny', 'maxx', 'maxy'],
            sql: "SELECT ST_AsSVG(geom, 0, 8) as svg FROM " +
                 tableName('spreads') +
                 " WHERE geom && ST_MakeBox2D(ST_Point($1, $2), ST_Point($3, $4));"
        }
    };
    return queries;
};
