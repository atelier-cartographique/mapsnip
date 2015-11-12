/*
 * app.js
 *
 *
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */


var config = require('../config'),
    db = require('../lib/db'),
    server = require('../lib/server'),
    routes = require('../routes');

// config storage
db.configure(config.pg);

app = server(config.server);
routes(app);

app.start();
