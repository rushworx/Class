Pie = require '../../models/pie'

routes = (app) ->
  
  
  
  
  app.get '/create', (req, res) ->
    res.render "#{__dirname}/views/class/create.jade",
      title: "Create Problem"
      stylesheet: 'create'
           
  app.namespace '/dash', ->


    app.all '/*', (req, res, next) ->
      if not (req.session.currentUser)
        req.flash 'error', 'Please login.'
        res.redirect '/login'
        return
      next()

    app.namespace '/class', ->
        
      app.get '/', (req, res) ->
        pie = new Pie {}
        Pie.all (err, pies) ->
          res.render "#{__dirname}/views/class/dash.jade",
            title: "Dashboard"
            stylesheet: 'admin'
            pie: pie
            pies: pies
            
      
          
      app.post '/', (req, res) ->
        attributes =
          name: req.body.name
          type: req.body.type
        pie = new Pie attributes
        pie.save (err, pie) ->
          req.flash 'info', "Problem #{pie.name} was saved."
          res.redirect '/dash/class'
    
module.exports = routes