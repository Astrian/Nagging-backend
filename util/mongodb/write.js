const { MongoClient } = require('mongodb')
const client = new MongoClient(`mongodb+srv://${process.env.NG_DBAUTH}@${process.env.NG_DBENDPOINT}`)
module.exports = async (collectName, data) => {
  await client.connect()
  const db = client.db(process.env.NG_DBNAME)
  const collection = db.collection(collectName)
  const insertResult = await collection.insertMany(data)
  client.close()
  return insertResult
}