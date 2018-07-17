import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as express from 'express';
import * as bodyParser from 'body-parser';

async function run() {
    console.log('Starting');

    const app = express();
    app.use(bodyParser.json());

    const adapter = new FileAsync('./db.json');
    const db = await low(adapter);

    await db.defaults({ weightLog: [] }).write();

    app.get('/weightlog', (req, res) => {
        const post = db.get('weightLog');
        res.send(post);
    });

    app.post('/weightlog', async (req, res) => {
        console.log('Post to weightlog');
        await db.get('weightLog').push(req.body).write();
        res.send('ok');
    });

    await app.listen(3000, () => console.log('Listening on port 3000'));
}

run();
