var path         = require('path');
var fs           = require('fs');

module.exports = function(appdir, verbose) {
  return function (req, res, next) {
		var filesDir = path.join(__dirname, '../../..', appdir,'files');
		var fileName = req.params.name;
		var fullName = path.join(filesDir, fileName);
		try {
			if (fs.statSync(filesDir).isDirectory()) {
				res.sendFile(fullName, function (err) {
					if (err) {
						console.log("Could not send file", "'"+fileName+"'");
						res.status(err.status).end();
					}
					else {
						if (verbose) console.log('Sent:', fileName);
					}
				});
			}
		}
		catch (err) {
			console.log("Warning : you're application's 'files' directory is missing.");
			console.log("Could not send file", "'" + fileName + "'");
			res.status(404).end();
		}
  };
};

