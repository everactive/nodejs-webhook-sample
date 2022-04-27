const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Use environment var or create a UUID to act as a "key" to prevent
// unauthorized POST / GET requests. To set to a known value
// start the application with the API_KEY environment variable set.
const secret = process.env.API_KEY || uuidv4();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const values = [];

/**
 * GET /health
 * 
 * Use to determine if the webhook server is up and running.
 */
app.get('/health', async (req, res) => {
    res.send();
})

/**
 * GET /
 * 
 * Return an array the last ten messages received via the POST / endpoint.
 */
app.get('/', async (req, res) => {
    const reqSecret = req.header('x-api-key');
    if (reqSecret !== secret) {
        res.sendStatus(401);
        return;
    }
    res.send(values);
})

/**
 * POST /
 * 
 * Store the body in the values array.
 */
app.post('/', async (req, res) => {
    const reqSecret = req.header('x-api-key');
    if (reqSecret !== secret) {
        res.sendStatus(401);
        return;
    }

    const doc = req.body;
    values.unshift(doc);

    if (values.length > 10) {
        values.length = 10;
    }

    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`listening on port ${port}, api-secret: ${secret}`);
})