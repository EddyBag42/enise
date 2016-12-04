function isNotEmpty(obj) {
  for (var i in obj) { return true; }
  return false;
}
JSON.stringifyAligned = require('json-align');

module.exports = function (req, res, next) {
  // middleware de retour console
  // sur les requetes GET et POST
  console.log('________________________________________________________________________________\n\nHttp ' + req.method +
							(req.method=='GET'?' ':'') + ' request on ' + req.path);
  switch (req.method) {
  case 'GET':
		if (isNotEmpty(req.query)) { console.log('GET  arguments :\n' + JSON.stringifyAligned(req.query,null,2)); }
    break;
  case 'POST':
		if (isNotEmpty(req.body)) { console.log('POST arguments :\n' + JSON.stringifyAligned(req.body,null,2));	}
    break;
  }
  if (isNotEmpty(req.cookies)) { console.log('Cookies :\n' + JSON.stringifyAligned(req.cookies,null,2)); }
  next();
};
