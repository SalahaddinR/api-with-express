import express from "express";
import path from "path";
import { engine } from "express-handlebars"

import taskRouter from "./src/routers/taskRouter";
import itemRouter from "./src/routers/itemRouter";

export const app = express();
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.engine('handlebars', engine({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'static/views'));

app.use('/api/tasks', taskRouter);
app.use('/api/items', itemRouter);

app.get('/', (req, res) => {
    res.render('main.hbs');
})

const server = app.listen(8888, () => {
    console.log(`Server running on http://localhost:${server.address().port}/`)
})
