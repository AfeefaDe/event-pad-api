    $ sudo npm install -g express-generator
    $ express -v ejs -f
    $ remove ejs and serve-favicon from package.json
    $ rm -rf views public
    $ npm install
    $ remove serve-favicon from app.js
    $ remove from www.js:
      // view engine setup
      app.set('views', path.join(__dirname, 'views'));
      vapp.set('view engine', 'ejs');
    $ npm install --save sequelize sequelize-cli mysql
    $ npm start
