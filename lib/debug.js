function isNotEmpty(obj) {
  for (var i in obj) { return true; }
  return false;
}

module.exports = function (req, res, next) {
  // middleware de retour console
  // sur les requetes GET et POST
  console.log('Http ', req.method, req.method=='GET' ? ' ':'', ' request on ', req.path);
  switch (req.method) {
  case 'GET':
		if (isNotEmpty(req.query)) { console.log('GET variables : ', req.query); }
    break;
  case 'POST':
		if (isNotEmpty(req.body)) { console.log('POST variables : ', req.body);	}
    break;
  }
  if (isNotEmpty(req.cookies)) { console.log('Cookies :', req.cookies);	}
  next();
};
