var pg = require('pg');

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
  pg.connect(this.connectionString, function(error, client, done) {
    client.query(request, params, function(error, result) {
      done();
      if (result) {
				callback(error, result.rows);
			}
			else {
				callback(error, []);
			}
    });
  });
};

module.exports = pg;

