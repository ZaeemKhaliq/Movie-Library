const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET_KEY;
  const API_URL = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: `${API_URL}/movies`, methods: ["GET", "OPTIONS"] },
      {
        url: /\/api\/v1\/comments\/get-comments\/(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      `${API_URL}/auth/login`,
      `${API_URL}/auth/signup`,
    ],
  });
}

module.exports = authJwt;
