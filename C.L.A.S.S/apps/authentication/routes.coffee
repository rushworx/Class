(->
  routes = undefined
  mongoose = require("mongoose")
  connection = mongoose.createConnection("mongodb://localhost/newpla2")
  Schema = mongoose.Schema
  ObjectId = Schema.ObjectId
  User = new Schema(
    login: String
    password: String
  )
  UserModel = connection.model("users", User)
  user = new UserModel()
  UserModel.findOne
    login: "ryan"
  , (err, doc) ->
    console.log doc

  makeNewUser = (login, pass) ->
    user.login = login
    user.password = pass

  makeNewUser "dude", "dude$1234"
  routes = (app) ->

    app.get '/login', (req, res) ->
      res.render "#{__dirname}/views/login",
        title: 'Login'
        stylesheet: 'login'

    app.post '/sessions', (req, res) ->
      UserModel.findOne
        login: req.body.user
      , (err, doc) ->
        if err
          req.flash "error", "The username " + req.body.user + " is incorrect."
          res.redirect '/login'
        else
          if doc.password is req.body.password
            req.session.currentUser = req.body.user
            req.flash 'info', "You are now logged in as " + req.session.currentUser + "."
            res.redirect '/dash/class'
            return
          else
            req.flash 'error', 'The password was incorrect. Please login again.'
            res.redirect '/login'


    app.del '/sessions', (req, res) ->
      req.session.regenerate (err) ->
        req.flash 'info', 'you have been logged out.'
        res.redirect '/login'

  module.exports = routes
).call this