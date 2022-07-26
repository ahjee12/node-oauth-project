// @ts-check
const mongo = require('mongodb')

// @ts-ignore
const { MongoClient } = mongo

const { MONGO_PASSWORD, MONGO_CLUSTER, MONGO_USER } = process.env

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const DB = 'oauthdb'

let didConnect = false

/**
 * @param {string} name
 */
async function getCollection(name) {
  if (!didConnect) {
    await client.connect()
    didConnect = true
  }
  return client.db(DB).collection(name)
}

async function getUsersCollection() {
  return getCollection('users')
}

async function getPostsCollection() {
  return getCollection('posts')
}

module.exports = {
  getUsersCollection,
  getPostsCollection,
}
