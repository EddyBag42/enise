var pg = require('pg');

// encapsulation des 3 appels pg.connect() / client.query() / done()
// en une méthode unique pg.execute(config de connexion, [ parametres ], callback)
// ajoutée au driver du module pg
// rq : il reste donc possible d'utiliser le module pg comme ses concepteurs l'ont prévu

pg.execute = function(request, arg1, arg2) {
    var params, callback;
    if (arg2 == undefined) {
	params   = [];
	callback = arg1;
    }
    else {
	params   = arg1;
	callback = arg2;
    }
    pg.connect(this.connectionConfig, function(error, client, done) {
	if (error) console.log(error);
	else {
	    client.query(request, params, function(error, result) {
		done();
		if (result) {
		    callback(error, result.rows);
		}
		else {
		    callback(error, []);
		}
	    });
	}
    });
};

module.exports = pg;

