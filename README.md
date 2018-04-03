# YelpCamp

**YelpCamp** is a web application built using NodeJS, ExpressJS, REpresentational State Transfer (REST), Embedded JavaScript (EJS) with a few more frameworks and middle-wares used as the application is developed. It is made while pursuing [The Web Developer Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) course on [Udemy](https://www.udemy.com/). This 40+ hour course covers HTML, CSS, Javascript, Node, Express, MongoDB, Git, and a bunch of other smaller topics along the way.

## Course Instructor: [Colt Steele](https://www.linkedin.com/in/coltsteele/)

## Description

### Frameworks & Middlewares

* **[ExpressJS](https://expressjs.com/)** is used for Server Side Routing applications.
* **[MongooseJS](http://mongoosejs.com/)** is used for Back-End Database operations with MongoDB NoSQL Database.
* **[Body-Parser](https://github.com/expressjs/body-parser/)** is used to Parse the data that was received as a result of HTTP POST request.
* **[Express.Static()](https://expressjs.com/en/starter/static-files.html)** is used to serve the Static files CSS, JS, etc. in the directory as specified.
* **[Embedded JavaScript]()** is used to embed the JavaScript within the HTML tags to implement the logic.
* **[PassportJS](www.passportjs.org/)** is used to provide user authentication to the application.
	* **passport-local**
	* **passport-local-mongoose**
* Using **Module.Exports** the app.js file was refactored into multiple sub-files.
* Some other self-defined middlewares to improve the application such as:
	* to prevent unauthorised access to POST routes.
	* to check whether a user has logged in or not.

### Development Stages

Following `versions` correspond to the different stages in the development of the YelpCamp application.

* `v1`  Initial Routes and building blocks of YelpCamp application.
* `v2`  Data Persistence with application of MongooseJS using MongoDB. 
* `v3`  app.js file refactored with application of **module.exports**.
* `v4`  Data Persistence and user associativity for Comments.
* `v5`  Campground show page styled using Bootstrap3 and custom CSS.
* `v6`  Added User authentication with application of PassportJS.
* `v7`  Refactored app.js where, Route definitions are now shifted to separate directory: **routes**, thereby improving readability.
* `v8`  Database associativity updated between **Users + Comments**, updated form page for adding a new comment.
* `v9`  Database associativity updated between ""Users + Campgrounds**, updated form page for adding a new campground.

### NOTE:

* The term **Campground** refers to a blog or an article that someone can add to the YelpCamp application.
* The application is hosted on [Cloud9 IDE](https://aws.amazon.com/cloud9/), an open-source Cloud Service provided by Amazon Web Services (AWS) for developing web applications.