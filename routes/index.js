/*
 * routes/index.js
 *
 *
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */

var _ = require('underscore'),
    express = require('express'),
    db = require('../lib/db');



function makeSVG (request, response){
    var client = db.client();
    var params = [
        request.params.minx,
        request.params.miny,
        request.params.maxx,
        request.params.maxy
    ];
    client.query('getSVG', params)
        .then(function(rows){
            response.send(rows);
        })
        .catch(function(err){
            response.end('PgError');
        });
}


module.exports = exports = function(app){

    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('mapsnip');
    });

    router.get('/svg/:minx/:miny/:maxx/:maxy', makeSVG);

    app.use('/', router);

};
