/**
 * Module dependencies.
 * @private
 */

var express       = require('express');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var path          = require('path');

var pg            = require('enise-pg');
var debug         = require('enise-debug');
var send          = require('enise-send');
var app           = express();

/**
 * Module exports.
 * @public
 */

module.exports = {
  server: function(cfg) {
    if (cfg !== undefined) {
      app.listen(cfg.port, function(){
				console.log('Server is up on port',cfg.port);
      });
      app.use(bodyParser.urlencoded({ extended: true }));
      if (cfg.verbose) app.use(debug);
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, '../..', cfg.appdir,'public')));
      app.post('/files/:name', send(cfg.appdir, cfg.verbose));
    }
    return app;
  },
  router: express.Router,
  pg: function(cfg) {
    if (cfg !== undefined) {
      pg.connectionString = 'postgres://'+cfg.user+':'+cfg.password
				+'@'+cfg.host+':5432/'+cfg.database;
    }
    return pg;
  }
};
