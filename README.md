# Notifhome-api.js

Notifhome-api.js is the nodejs version of Notifhome-api.

This is my very first project using nodejs. Nodejs is popular and I was curious to explore and learn more about it.



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
