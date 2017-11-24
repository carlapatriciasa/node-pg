const Pool = require('pg').Pool

const dbConfig = {
  host: 'ec2-184-73-189-221.compute-1.amazonaws.com',
  database: 'd6v251dd6h30k5',
  user: 'oihuilbggeklny',
  password: '0de8b502d574fbf5ec2b6351d23d7af95c0e30b71ca8af34672fc6accc3393c8',
  port: 5432,
  ssl:true
}

const pool = new Pool(dbConfig)

module.exports = {
  pool,
  query: (text, params = []) => {
    return pool.query(text, params)
  }
}
