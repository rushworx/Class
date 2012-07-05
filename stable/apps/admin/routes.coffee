Pie = require '../../models/pie'
_   = require 'underscore'

routes = (app) ->
  app.namespace '/admin', ->

    # Authentication check
    app.all '/*', (req, res, next) ->
      if not (req.session.currentUser)
        req.flash 'error', 'Please login.'
        res.redirect '/login'
        return
      next()

    app.get '/', (req, res) ->
      res.redirect '/admin/menu/stage'

    app.namespace '/pies', ->

      # List all pies.
      app.get '/', (req, res) ->
        pie = new Pie {}
        Pie.all (err, pies) ->
          res.render "#{__dirname}/views/pies/all",
            title: 'View All Pies'
            stylesheet: 'admin'
            pie: pie
            pies: pies

      # Create a pie.
      app.post '/', (req, res) ->
        attributes =
          name: req.body.name
          type: req.body.type
        pie = new Pie attributes
        pie.save () ->
          req.flash 'info', "Pie '#{pie.name}' was saved."
          res.redirect '/admin/pies'

      app.put '/:id', (req, res) ->
        Pie.getById req.params.id, (err, pie) ->
          if _.include(Pie.states, req.body.state)
            pie[req.body.state] ->
              if socketIO = app.settings.socketIO
                socketIO.sockets.emit "pie:changed", pie
              # Send plain text reply with default success statusCode of 200.
              res.send "/admin/pies/#{req.params.id}"
          else
            res.render 'error',
              status: 403,
              message: "Incorrect Pie state: #{req.body.state} is not a recognized state."
              title: "Incorrect Pie state"
              stylesheet: 'admin'

    app.namespace '/menu', ->

      app.get '/stage', (req, res) ->
        Pie.all (err, pies) ->
          res.render "#{__dirname}/views/menu/stage",
            title: 'Pie Status'
            stylesheet: 'admin'
            pies: pies

module.exports = routes