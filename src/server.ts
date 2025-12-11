// server.ts

import app from './app.js'
import config from './config/index.js'
import './utils/autoReturn.js'
const port = process.env.PORT || config.port || 5000;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})