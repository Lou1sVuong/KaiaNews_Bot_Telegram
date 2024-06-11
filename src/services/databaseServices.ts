import { envConfig } from '~/constants/config'
import { Collection, Db, MongoClient } from 'mongodb'
import { User } from '~/Schemas/userShemas'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@cluster0.ccrzxzj.mongodb.net/`
class DatabaseServices {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error connecting to the database', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }
}
// tạo object từ class DatabaseServices
const databaseServices = new DatabaseServices()
export default databaseServices
