const jsonwebtoken = require('jsonwebtoken');

const SECRET = 'mysecretsshhh';//Set the secret in a json secret file

const withAuth = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
    
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jsonwebtoken.verify(token, SECRET, function(err, decoded) {
      if (err) {
        res.sendStatus(401);
       // res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.login = decoded.login;
        next();
      }
    });
  }
}
module.exports = withAuth;