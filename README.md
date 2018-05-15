# Notifhome-api.js

Notifhome-api.js is the nodejs version of [Notifhome-api](https://github.com/aklein-dex/notifhome-api) (rails).

This is my very first project using nodejs. Nodejs is popular and I was curious to explore and learn more about it.

So far I'm plannig to work more on the rails version and update this repo when I have time.

Some plugins used:

* express
* mocha
* chai
* mongoose


## How to install mongodb

````
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ sudo service mongod start
$ mongo --host 127.0.0.1:27017
> use notifhome
> db.createCollection('users')
````

## How to start the server

Run the following command to start the server:
````
$ nodemon
````

If you don't have nodemon installed then install it:
````
$ npm install -g nodemon
````

See the project [Notifhome-api](https://github.com/aklein-dex/notifhome-api) for the API. 
The routes are the same but the responses are a little bit different. Also you only need
to provide the header **access-token**.

## How to run the tests

Run the following command to run the tests:
````
$ npm test
# or to test a single file
$ npm test test/devicesControllerTest.js
````
