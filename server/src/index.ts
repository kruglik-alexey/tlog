import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

async function run() {
    console.log('Starting');

    const app = express();
    app.use(bodyParser.json());
    app.use(cors({
        origin: (origin, callback) => callback(null, true)
    }));

    const adapter = new FileAsync('./db.json');
    const db = await low(adapter);

    await db.defaults({ weightLog: [] }).write();

    app.options('*', cors());

    app.get('/data', (req, res) => {
        const data = db.getState();
        res.send(data);
    });

    app.post('/weightlog', async (req, res) => {
        console.log('Post to weightlog');
        await db.get('weightLog').push(req.body).write();
        res.send('ok');
    });

    app.delete('/weightLog/:id', async (req, res) => {
        console.log('Delete from weightlog');
        await db.get('weightLog').remove({id: req.params.id}).write();
        res.send('ok');
    });

    await app.listen(3000, () => console.log('Listening on port 3000'));
}

run();
