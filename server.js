const dotEnv = require("dotenv");
dotEnv.config({ path: `${__dirname}/config.env` })
const app = require('./app');

const port = process.env.PORT * 1;
//Start server
app.listen(port, () => {
    console.log(`app is running on port:${port}`)
});