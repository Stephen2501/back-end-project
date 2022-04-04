# Northcoders News API

https://steves-nc-news.herokuapp.com/

## About

This project is an API that has a database with various tables linking to articles, comments, users and topics. This project was written in JavaScript

The now hosted website has many endpoints for navigating around the database to help manipulate the data within table, this can be in the form of a GET, POST, PATCH or DELETE request. Aswell as these; the ability to query the data within the tables has been added to help make the data more readable.

### Set-Up

To start, fork this project and then clone it down to your machine using the terminal, enter the neccesary directory and then use the below code inputting the actual url instead of the current placeholder:

```
$ git clone /github-url-of-project/
```

You must create a .env.test and .env.development files in the main folder which then connect the databases, each user must do this as the files are git ignored and therefore only exist locally.


You will need to install the below packages for using this project using the below command lines in the terminal of this project:

``` 
$ npm i jest
$ npm i jest-sorted
$ npm i express
$ npm i supertest
$ npm i pg
$ npm i dotenv
```

Once these are installed, you can test the current testsuite by running:
```
$ npm test
```

This will reseed the database and then run the tests and will reseed before every test, thus stopping any test outcome from effecting the next test.


### Technology

This project was created using:
```
node: 16.13.1
postgres: 14.1
```

Thank you for taking the time to read over this, i hope you enjoy the playing around with the project as there are many more API pathways that will included and tested to make a more verbose website.
