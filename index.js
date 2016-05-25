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
// on crée l'app express
var app           = express();

/**
 * Module exports.
 * @public
 */

module.exports = {
	// the server is down at this stage
	up: false,
	// méthode d'initialisation du web server
	// -> placement des routes prédéfinies
  server: function(cfg) {
		// on ne place les routes sur l'app express que lors du premier appel
		// les fois suivantes (s'il y en a ...) on renvoie juste l'app
    if (cfg !== undefined && !this.up) {
			// redéfinition du header express
			// Enise power !
			app.use(function(req,res,next){
				res.setHeader('X-Powered-By', 'Enise');
				next();
			});
			// parsing des variables POST
			// pour peupler req.body
      app.use(bodyParser.urlencoded({ extended: true }));
      if (cfg.verbose) app.use(debug);
			// parsing des COOKIES
			// pour peupler req.cookies
      app.use(cookieParser());
			// utilisation du routeur principal de l'application
			// i.e. 'monapp/routes/index.js'
			var routes_path = path.join(__dirname,'../..',cfg.appdir,'routes');
			try {
				// if faudrait tester ici si le fichier 'index.js' est absent
				// pour envoyer un warning dans la console
				if (fs.statSync(routes_path).isDirectory()) app.use(require(routes_path));
			}
			// warning si l'application n'a pas de dossier 'routes'
			catch (e) {
				console.log("Warning : you're application's 'routes' directory is missing.");
			}
			// définition du serveur statique
			// il sert le répertoire 'monapp/public'
			var public_path = path.join(__dirname, '../..', cfg.appdir,'public');
			try {
				if (fs.statSync(public_path).isDirectory()) app.use(express.static(public_path));
			}
			// warning si l'application n'a pas de dossier 'public'
			catch (e) {
				console.log("Warning : you're application's 'public' directory is missing.");
			}
			// traitement des requetes POST de type '/files/*' pour servir
			// les fichiers du dossier 'monapp/files'
			app.post('/files/:name', send(cfg.appdir, cfg.verbose));
			// on peut maintenant accepter les connexions sur le port choisi
      app.listen(cfg.port, function(){
				this.up = true;
				console.log('Server is up on port',cfg.port);
      });
    }
    return app;
  },
  router: express.Router,
	// méthode d'initialisation du driver postgresql
  pg: function(cfg) {
		// memorisation de la chaine de connexion
    if (cfg !== undefined) {
      pg.connectionString = 'postgres://'+cfg.user+':'+cfg.password
				+'@'+cfg.host+':5432/'+cfg.database;
    }
    return pg;
  }
};
