Pie = require '../models/pie'

PieFactory =
  # Create two pies in the database.
  #
  # callback: () No params.
  createSeveral: (callback) ->
    # Attributes
    keyLimePie =
      name: 'Key Lime'
      type: 'sweet'
    chickenPie =
      name: 'Chicken'
      type: 'savory'
      state: 'making'
    applePie =
      name: 'Apple'
      type: 'sweet'
    cherryPie =
      name: 'Cherry'
      type: 'sweet'
      state: 'ready'
      stateUpdatedAt: do -> (new Date).getTime() + (1000 * 60 * 60 * 24 * 365 * 1000)
    pieAttributes = [keyLimePie, chickenPie, applePie, cherryPie]
    # Now create them all
    createOne = @createOne
    runSequentially = (item, otherItems...) ->
      createOne item, ->
        if otherItems.length
          runSequentially otherItems...
        else
          callback()
    runSequentially pieAttributes...

  createOne: (attributes, callback) ->
    pie = new Pie attributes
    pie.save (err, pie) ->
      callback err, pie


module.exports = PieFactory
