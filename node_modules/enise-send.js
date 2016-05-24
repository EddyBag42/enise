var path         = require('path');

module.exports = function(appdir, verbose) {
  return function (req, res, next) {
    var filesDir = path.join(__dirname, '../../..', appdir, 'files');
    var fileName = req.params.name;
    var fullName = path.join(filesDir, fileName);
    res.sendFile(fullName, function (err) {
      if (err) {
	console.log(err);
	res.status(err.status).end();
      }
      else {
	if (verbose) console.log('Sent:', fileName);
      }
    });
  };
};

