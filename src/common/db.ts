import mongoose from 'mongoose'
import { ConfigService } from '../config/config-service'

class Database {
   private static _database: Database
   private constructor() {
      const dbUrl = ConfigService.mongoURI
         if(dbUrl) {
            mongoose.connect(dbUrl)
               .then(() => console.log('Connected with database'))
               .catch(() => console.log('Not connected with database'))
         }
   }


   static getInstance() {
      if (!this._database) {
        this._database = new Database()
      }
      return this._database;
   }
}

export default Database