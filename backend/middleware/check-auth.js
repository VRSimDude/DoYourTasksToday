const jwt = require("jsonwebtoken");

const environment = require("../environments/environment");

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      environment.production ? environment.jwtKey : environment.dev_jwtKey
    );
    request.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    response.status(401).json({
      message: "You are not authenticated!",
    });
  }
};
