module.exports = {
  forceDefaultAttributes (Model) {
    Model.$get = Model.prototype.get
    Model.prototype.get = function (key, options) {
      // return $get if queried for a specific field
      if (options) {
        return Model.$get.call(this, key, options)
      }

      options = key
      if (!options) {
        options = {}
      }

      // return $get if raw model is requested
      if (options.raw === true) {
        return Model.$get.call(this, options)
      }

      const values = Model.$get.call(this, options)
      for (let key in values) {
        if (Model.rawAttributes[key] && !Model.defaultAttributes.includes(key)) {
          values[key] = undefined
        }
      }

      return values
    }
  }
}
