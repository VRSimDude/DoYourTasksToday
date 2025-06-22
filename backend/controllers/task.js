const task = require("../models/task");

exports.getTask = (request, response, next) => {
  task
    .findById({ _id: request.params.id, userId: request.userData.userId })
    .then((taskData) => {
      if (taskData) {
        response.status(200).json({
          message: "Task found",
          task: taskData,
        });
      } else {
        response.status(404).json({
          message: "Task not found",
        });
      }
    })
    .catch((error) => {
      console.log(
        "ERROR:[controllers/task](createTask.newTask.save): error " + error
      );
      response.status(500).json({
        message: "Fetching task failed!",
      });
    });
};

exports.getTasks = (request, response, next) => {
  task
    .find({ userId: request.userData.userId })
    .then((tasksData) => {
      if (!tasksData) {
        response.status(200).json({
          message: "No Tasks",
          tasks: [],
        });
      } else {
        response.status(200).json({
          message: "Tasks",
          tasks: tasksData,
        });
      }
    })
    .catch((error) => {
      console.log(
        "ERROR:[controllers/task](createTask.newTask.save): error " + error
      );
      response.status(500).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.createTask = (request, response, next) => {
  if (request.body.title.length > 128) {
    response.status(400).json({
      message: "Maximum length of E-Mail is 128!",
    });
    return;
  }
  if (request.body.title.length > 128) {
    response.status(400).json({
      message: "Maximum length of E-Mail is 128!",
    });
    return;
  }
  const newTask = new task({
    title: request.body.title,
    description: request.body.description,
    status: "backlog",
    order: 0,
    priority: request.body.priority,
    dueDate: request.body.dueDate,
    userId: request.userData.userId,
  });

  // increase order of all current tasks by 1
  task
    .find({ userId: request.userData.userId, status: "backlog" })
    .then((userTasks) => {
      if (userTasks) {
        userTasks.forEach((userTask) => {
          const updatedTask = new task({
            _id: userTask._id,
            description: userTask.description,
            status: userTask.status,
            order: Number(userTask.order) + 1,
            priority: userTask.priority,
            dueDate: userTask.dueDate,
            userId: request.userData.userId,
          });
          task
            .updateOne(
              { _id: userTask._id, userId: request.userData.userId },
              updatedTask
            )
            .catch((error) => {
              console.log(
                "ERROR:[controllers/task](createTask.newTask.save.updateOne): error " +
                  error
              );
            });
        });
      }
    });

  newTask
    .save({ userId: request.userData.userId })
    .then(() => {
      response.status(200).json({
        message: "Task created",
      });
    })
    .catch((error) => {
      console.log(
        "ERROR:[controllers/task](createTask.newTask.save): error " + error
      );
      response.status(500).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.updateTask = (request, response, next) => {
  if (request.body.title.length > 128) {
    response.status(400).json({
      message: "Maximum length of E-Mail is 128!",
    });
    return;
  }
  if (request.body.title.length > 128) {
    response.status(400).json({
      message: "Maximum length of E-Mail is 128!",
    });
    return;
  }
  const updatedTask = new task({
    _id: request.body._id,
    title: request.body.title,
    description: request.body.description,
    status: request.body.status,
    order: request.body.order,
    priority: request.body.priority,
    dueDate: request.body.dueDate,
    userId: request.userData.userId,
  });

  task
    .updateOne(
      { _id: request.body._id, userId: request.userData.userId },
      updatedTask
    )
    .then(() => {
      response.status(200).json({
        message: "Task updated",
      });
    })
    .catch((error) => {
      console.log(
        "ERROR:[controllers/task](updateTask.task.updateOne): error " + error
      );
      response.status(500).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.moveTask = (request, response, next) => {
  // find request task and see if status match with database, if so status move is false
  task
    .findOne({
      _id: request.body._id,
      userId: request.userData.userId,
    })
    .then((oldUserTask) => {
      // order move
      if (oldUserTask.status === request.body.status) {
        task
          .findOne({ status: request.body.status, order: request.body.order })
          .then((oldOtherUserTask) => {
            const updatedOldOtherTask = new task({
              _id: oldOtherUserTask._id,
              description: oldOtherUserTask.description,
              status: oldOtherUserTask.status,
              order: oldUserTask.order,
              priority: oldOtherUserTask.priority,
              dueDate: oldOtherUserTask.dueDate,
              userId: request.userData.userId,
            });
            task
              .updateOne(
                { _id: oldOtherUserTask._id, userId: request.userData.userId },
                updatedOldOtherTask
              )
              .catch((error) => {
                console.log(
                  "ERROR:[controllers/task](moveTask.find.updateOne(oldOtherUserTask)): error " +
                    error
                );
              });
            const updatedOldUserTask = new task({
              _id: oldUserTask._id,
              description: oldUserTask.description,
              status: oldUserTask.status,
              order: request.body.order,
              priority: oldUserTask.priority,
              dueDate: oldUserTask.dueDate,
              userId: request.userData.userId,
            });
            task
              .updateOne(
                { _id: oldUserTask._id, userId: request.userData.userId },
                updatedOldUserTask
              )
              .catch((error) => {
                console.log(
                  "ERROR:[controllers/task](moveTask.find.updateOne(updatedOldUserTask)): error " +
                    error
                );
              });
          })
          .catch((error) => {
            console.log(
              "ERROR:[controllers/task](moveTask.find): error " + error
            );
          });
      }
      // status move
      else {
        oldUserTask.status;
        task
          .findOne({
            userId: request.userData.userId,
            status: request.body.status,
            order: 0,
          })
          .then((result) => {
            if (result) {
              task
                .find({
                  userId: request.userData.userId,
                  status: request.body.status,
                })
                .then((userTasks) => {
                  userTasks.forEach((userTask) => {
                    const updatedUserTask = new task({
                      _id: userTask._id,
                      description: userTask.description,
                      status: userTask.status,
                      order: Number(userTask.order) + 1,
                      priority: oldUserTask.priority,
                      dueDate: oldUserTask.dueDate,
                      userId: request.userData.userId,
                    });
                    task
                      .updateOne(
                        { _id: userTask._id, userId: request.userData.userId },
                        updatedUserTask
                      )
                      .catch((error) => {
                        console.log(
                          "ERROR:[controllers/task](moveTask.find.updateOne(updatedUserTask)): error " +
                            error
                        );
                      });
                  });
                })
                .catch((error) => {
                  console.log(
                    "ERROR:[controllers/task](moveTask.task.find): error " +
                      error
                  );
                  response.status(500).json({
                    message: "Fetching posts failed!",
                  });
                });
            }
          })
          .catch((error) => {
            console.log(
              "ERROR:[controllers/task](moveTask.task.findOne): error " + error
            );
            response.status(500).json({
              message: "Fetching posts failed!",
            });
          });

        const updatedMovedTask = new task({
          _id: request.body._id,
          description: request.body.description,
          status: request.body.status,
          order: 0,
          priority: request.body.priority,
          dueDate: request.body.dueDate,
          userId: request.userData.userId,
        });
        task
          .updateOne(
            { _id: request.body._id, userId: request.userData.userId },
            updatedMovedTask
          )
          .catch((error) => {
            console.log(
              "ERROR:[controllers/task](moveTask.find.updateOne(updatedMovedTask)): error " +
                error
            );
          });
      }
    });
};

exports.deleteTask = (request, response, next) => {
  task
    .deleteOne({
      _id: request.params.id,
      userId: request.userData.userId,
    })
    .then((result) => {
      if (result.deletedCount) {
        response.status(200).json({
          message: "Task deleted successfully",
        });
      } else {
        response.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch((error) => {
      console.log(
        "ERROR:[controllers/task](deleteTask.task.updateOne): error " + error
      );
      response.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};
