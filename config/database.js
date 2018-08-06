'use strict'

// connect to DB
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://contactoDB:fact-Checking-2018User&DB@ds215172.mlab.com:15172/fact-checking-colcheck'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost:27017/storycheck-dev'
  }
}
