const Pool = require('pg').Pool
const pool = new Pool({
  user: 'kimjin',
  host: 'localhost',
  database: 'myserver',
  password: 'W!ndows7',
  port: 5432,
})
const redis = require("redis");
const redisPort = 6379;
const client = redis.createClient(redisPort);

//log error to the console if any occurs
client.on("error", (err) => {
    console.log(err);
});


const getUsers = (request, response) => {
    // check cache
    let key = request.body.key;
    let field = request.body.field;
    client.hmget(key, field, function(err, results) {
        if (results[0] != null) {
            // cache hit
            console.log("CACHE HIT")
            response.status(200).json(JSON.parse(results))
        } else {
            // cache miss
            console.log("CACHE MISS")
            // query db for data
            pool.query('SELECT * FROM posts ORDER BY id ASC', (error, results) => {
                if (error) {
                    throw error
                }
                // store data in cache
                client.hset(key, field,JSON.stringify(results.rows));
                // return db result
                response.status(200).json(results.rows)
            })
        }
    })
}

module.exports = {
    getUsers
}  