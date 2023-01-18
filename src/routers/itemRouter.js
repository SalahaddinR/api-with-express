import { Router } from "express";
import itemsJson from "../data/itemStorage.json";
import {
    jsonMessage, constructData,
    verifyData, preventDublication, updateData
} from "./utils";

const itemRouter = Router();

itemRouter.get('/', (req, res) => {
    res.json(itemsJson.items);
})

itemRouter.get('/:id', (req, res) => {
    const find = itemsJson.items.some(item => item.id == req.params.id);

    if (find) {
        res.json(itemsJson.items.filter(item => item.id == req.params.id));
    }
    else {
        res.status(404);
        res.json(jsonMessage('warning', "'item' object with such 'id' not found!"))
    }
})

itemRouter.post('/', (req, res) => {
    if (req.body) {
        if (verifyData(req.body, ["task_id", "step"])) {
            if (preventDublication('item', req.body)) {
                const item = constructData('item', req.body);
                itemsJson.items.push(item);
                res.json(item);
            }
            else {
                res.json(jsonMessage('warning', "'body' content for 'item' object has repetitive values, hence dublication was prevented!"))
            }
        }
        else {
            res.json(jsonMessage('error', "'body' content for 'item' object has invalid or insufficient fields!"))
        }
    }
    else {
        res.json(jsonMessage('error', "'body' content cannot be empty!"));
    }
})

itemRouter.put('/:id', (req, res) => {
    const find = itemsJson.items.some(item => item.id == req.params.id);
    if (find) {
        if (req.body) {
            if (req.body.task_id || req.body.step || req.body.completed) {
                updateData('item', req.params.id, {
                    task_id: req.body.task_id,
                    step: req.body.step,
                    completed: req.body.completed
                })
                res.json(itemsJson.items.filter(item => item.id == req.params.id))
            }
            else {
                res.json(jsonMessage('warning', "'body' content has unrecongnized field to update!"))
            }
        }
        else {
            res.json(jsonMessage('warning', "'body' content is empty nothing to update!"));
        }
    }
    else {
        res.json(jsonMessage('warning', "'item' object with such 'id' not found!"))
    }
})

itemRouter.delete('/:id', (req, res) => {
    const find = itemsJson.items.some(item => item.id == req.params.id);
    if (find) {
        itemsJson.items = itemsJson.items.filter(
            item => item.id != req.params.id
        )
        res.json(jsonMessage('info', "'item' object deleted"));
    }
    else {
        res.status(404);
        res.json(jsonMessage('warning', "'item' object with such 'id' not found!"))
    }
})

itemRouter.get('/of-task/:id', (req, res) => {
    const find = itemsJson.items.some(item => item.task_id == req.params.id);
    if (find) {
        res.json(itemsJson.items.filter(item => item.task_id == req.params.id));
    }
    else {
        res.status(404);
        res.json(jsonMessage('warning', "'item' objects with such 'task-id' not found!"))
    }
})

itemRouter.delete('/of-task/:id', (req, res) => {
    const find = itemsJson.items.filter(item => item.task_id == req.params.id);
    if (find) {
        itemsJson.items = itemsJson.items.filter(
            item => item.task_id != req.params.id
        )
        res.json(jsonMessage('info', "'item' objects of 'task' object deleted"));
    }
    else {
        res.status(404);
        res.json(jsonMessage('warning', "'item' objects with such 'task-id' not found!"))
    }
})

export default itemRouter;