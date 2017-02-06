'use strict'

module.exports = class Name {
  constructor (name, abbreviatedName) {
    this.name = name
    this.abbreviatedName = abbreviatedName || name
  }
  toString () {
    return this.abbreviatedName
  }
}
