<a name="readme-top"></a>
# Do Your Tasks Today (MEAN)

<!-- Screenshots -->
<p align="center">
  <img src="/screenshot/screenshot-1.jpg?raw=true" />
  <img src="/screenshot/screenshot-2.jpg?raw=true" />
  <img src="/screenshot/screenshot-3.jpg?raw=true" />
</p>

<!-- TABLE OF CONTENTS -->
<summary>Table of Contents</summary>
<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#description">Description</a></li>
      <li><a href="#built-with">Built With</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
  <li><a href="#how-to-use-the-project">How to Use the Project</a>
    <ul>
      <li><a href="#development">Development</a></li>
      <li><a href="#building">Building</a></li>
      <li><a href="#production">Production</a></li>
      <li><a href="#running-unit-tests">Running unit tests</a></li>
      <li><a href="#running-end-to-end-tests">Running end-to-end tests</a></li>
    </ul>
  </li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>

<!-- ABOUT THE PROJECT -->
## About The Project
This is an App made with the MEAN stack.<br>
The database and the server running on a virtual machine and administrated by me.
You can choose any Mail to signup or login.
It doesn't have to be a real one, because the data is not shared anywhere.
Please be aware that the app uses only HTTP protocol to send and receive data.					

### Description
This project is more a private project for me to learn and practice create Full Stack Web Applications.
You can create an account (can be any mail you want).
Create tasks, change where they are stored (Backlog, Todo, etc.).
Edit and delete tasks.
In the profile page you can delete your account with all tasks.

### Built With
This project was generated using the following:<br>
[MongoDB](https://www.mongodb.com/try/download/community) version 8.0.10<br>
[Express](https://expressjs.com) version 5.1.0<br>
[Angular CLI](https://github.com/angular/angular-cli) version 19.2.7<br>
[NodeJS](https://nodejs.org/en) version 22.14.10

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
In this section is described how to start using this project to develop it and what is required to do so.

### Prerequisites
To edit and build the project install all the software that the projects was built with and all dependecies to run and build it like Node.js.

### Installation
1. Clone the repo
```sh
git clone https://github.com/VRSimDude/ExpenseTracker.git
```
2. open the project<br>
open the project folder with an IDE like Visual Studio Code or edit every file with a text editor

3. install dependenices<br>
run the following command in the main project folder
```sh
npm install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- HOW TO USE THE PROJECT -->
## How to Use the Project
Here is described how you use the projects.

### Development

To start the database, follow the instructions on the website and make sure the database is running.<br><br>
To start the backend server, switch to the backend folder and run:
```bash
node server.js
```
To start a local frontend server, run:
```bash
ng serve
```
Once the everything is running, open your browser and navigate to `http://localhost:4200/`.
The frontend application will automatically reload whenever you modify any of the source files.
The backend server needs to restart on changes.
You can do this manually of use Addons of your IDE.

### Building

To build the frontend run:
```bash
ng build
```
This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Production

To run this project in production you will need to have the database and the backend running on a real server like a virtual machine or in the Cloud.
The frontend can run on the same machine as the backend, but can also be separated.<br><br>
Important:<br>You need to change the URL addresses for the backend server in the frontend in the `environment.ts` file.
You can have different URLs for development or production mode.
Just change the variable `production` to true and rebuild it.<br>
The backend also has the URL for the frontend in `environment.js` in the backend folder.
But you also have to check or change the URL of the MongoDB.
It is in the app.js file in the backend at `mongoose.connect()`.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions to this project can be done by writing me.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

mail: [contact@marcfriedrich.com](mailto:contact@marcfriedrich.com)<br>
project link: [https://github.com/VRSimDude/DoYourTasksToday](https://github.com/VRSimDude/DoYourTasksToday)