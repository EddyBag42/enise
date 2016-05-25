/**
 * Module dependencies.
 * @private
 */
// npm modules
var express       = require('express');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var path          = require('path');
var fs            = require('fs');
// local modules
var pg            = require('./lib/pg');
var debug         = require('./lib/debug');
var send          = require('./lib/send');

var app           = express();

/**
 * Module exports.
 * @public
 */

module.exports = {
	up: false,
  server: function(cfg) {
    if (cfg !== undefined && !this.up) {
      app.listen(cfg.port, function(){
				this.up = true;
				console.log('Server is up on port',cfg.port);
      });
      app.use(bodyParser.urlencoded({ extended: true }));
      if (cfg.verbose) app.use(debug);
      app.use(cookieParser());
			var routes_path = path.join(__dirname,'../..',cfg.appdir,'routes');
			try {
				if (fs.statSync(routes_path).isDirectory()) app.use(require(routes_path));
			}
			catch (e) {
				console.log("Warning : you're application's 'routes' directory is missing.");
			}
			var public_path = path.join(__dirname, '../..', cfg.appdir,'public');
			try {
				if (fs.statSync(public_path).isDirectory()) app.use(express.static(public_path));
			}
			catch (e) {
				console.log("Warning : you're application's 'public' directory is missing.");
			}
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
