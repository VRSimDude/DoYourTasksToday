const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/user");
const task = require("../models/task");
const environment = require("../environments/environment");

exports.createUser = (request, response, next) => {
  if (request.body.email.length > 128) {
    response.status(400).json({
      message: "Maximum length of E-Mail is 128!",
    });
    return;
  }
  if (request.body.password.length > 128) {
    response.status(400).json({
      message: "Maximum length of Password is 128!",
    });
    return;
  }
  user.findOne({ email: request.body.email }).then((results) => {
    if (results) {
      response.status(400).json({
        message: "This user already exists!",
      });
    } else {
      bcrypt.hash(request.body.password, 10).then((hash) => {
        const newUser = new user({
          email: request.body.email,
          password: hash,
        });
        newUser
          .save()
          .then(() => {
            response.status(200).json({
              message: "User created",
            });
          })
          .catch((error) => {
            console.log(
              "ERROR:[controllers/user](createUser.user.findOne.bcrypt.hash): error " +
                error
            );
            response.status(500).json({
              message: "Invalid authentication credentials!",
            });
          });
      });
    }
  });
};

exports.loginUser = (request, response, next) => {
  let fetchedUser;
  user
    .findOne({ email: request.body.email })
    .then((userFound) => {
      if (!userFound) {
        return response.status(401).json({
          message: "E-Mail not found!",
        });
      }
      fetchedUser = userFound;
      return bcrypt.compare(request.body.password, fetchedUser.password);
    })
    .then((result) => {
      if (!fetchedUser) {
        return;
      }
      if (!result) {
        return response.status(401).json({
          message: "Password wrong!",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        environment.production ? environment.jwtKey : environment.dev_jwtKey,
        { expiresIn: "1h" }
      );
      response.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((error) => {
      console.log(
        "ERROR:[controllers/user](loginUser.User.findOne): error " + error
      );
      return response.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.changePassword = (request, response, next) => {
  console.log(request.body.newPassword);
  bcrypt
    .hash(request.body.newPassword, 10)
    .then((hash) => {
      const updatedUser = new user({
        _id: request.userData.userId,
        email: request.userData.email,
        password: hash,
      });
      user
        .updateOne({ _id: request.userData.userId }, updatedUser)
        .then((result) => {
          if (result.matchedCount) {
            response.status(200).json({
              message: "Password updated successfully",
            });
          } else {
            response.status(401).json({
              message: "Not authorized!",
            });
          }
        })
        .catch(() => {
          response.status(500).json({
            message: "Couldn't update password!",
          });
        });
    })
    .catch(() => {
      response.status(500).json({
        message: "Couldn't update password!",
      });
    });
};

exports.deleteUser = (request, response, next) => {
  task.find({ userId: request.userData.userId }).then((userTasks) => {
    userTasks.forEach((userTask) => {
      task.deleteOne({ _id: userTask._id }).catch((error) => {
        console.log(
          "ERROR:[controllers/user](loginUser.User.findOne): error " + error
        );
      });
    });
  });

  user
    .deleteOne({ _id: request.userData.userId })
    .then((result) => {
      if (result.deletedCount) {
        response.status(200).json({
          message: "User deleted successfully",
        });
      } else {
        response.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch(() => {
      response.status(500).json({
        message: "Delete User failed!",
      });
    });
};
