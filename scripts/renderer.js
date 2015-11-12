/*
 * renderer.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */


var config = require('../config'),
    db = require('../lib/db'),
    cache = require('../lib/cache'),
    server = require('../renderer/server');

// config storage
db.configure(config.pg);
cache.configure(config.cache);

app = server(config.server);
app.start();
