Pie = require '../../models/pie'

routes = (app) ->
  app.get '/', (req, res) ->
    Pie.active (err, pies) ->
      res.render "#{__dirname}/views/index",
        title: "What's Warm"
        stylesheet: 'sidewalk'
        pies: pies

module.exports = routes
