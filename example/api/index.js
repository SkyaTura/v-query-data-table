import Mongoose from 'mongoose'
import Express from 'express'

export default async () => {
  const connection = Mongoose.connect(
    'mongodb://root:example@localhost/admin',
    {
      dbName: 'DataTable',
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  const app = Express()

  app.listen(8081, () => console.log('Listening'))

  return app
}
