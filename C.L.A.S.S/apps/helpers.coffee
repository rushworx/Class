
helpers = (app) ->

  app.dynamicHelpers
    flash: (req, res) -> req.flash()

module.exports = helpers