# Afeefa -- event-pad API

## About

the new hot shit---seriously

## Installation

`git`, `npm`, ... required

    $ git clone https://github.com/afeefade/event-pad-api
    $ npm install
    $ cd config && cp config.json.example config.json # app server port
    $ cd config && cp database.json.example database.json # db config
    $ npm run dev

## Database migrations
    sequelize db:migrate (defaults to development)
    NODE_ENV=test sequelize db:migrate

## For installation from scratch (express, sequelize)

    # npm install -g express-generator
    $ express -v ejs -f
    remove ejs and serve-favicon from package.json
    $ rm -rf views public
    $ npm install
    remove serve-favicon from app.js
    remove from www.js:
      // view engine setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');
    remove render calls from app.js
    $ npm install --save sequelize mysql2
    $ npm start
    $ npm run test[-(integration|unit)]
    $ npm install -g sequelize-cli
    $ sequelize init
    $ sequelize model:create --name Event --attributes title:string,dateStart:date,description:string,location:string,uri:string
    $ sequelize db:migrate

## Remote Debugging (VSCODE)

    On the host machine
    $ npm run debug

    On the dev machine
    Just start debugger with the port configured that is shown by npm run debug
