module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).send('Autenticación requerida');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Reemplaza estos valores con los que tú quieras
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || '1234';

  if (username === validUser && password === validPass) {
    next();
  } else {
    res.status(403).send('Credenciales inválidas');
  }
};
