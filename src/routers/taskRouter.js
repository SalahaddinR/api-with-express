import { Router } from "express";
import tasksJson from "../data/taskStorage.json";
import itemsJson from "../data/itemStorage.json";
import { 
    verifyData, constructData, 
    jsonMessage, preventDublication,
    updateData
} from "./utils";

const taskRouter = Router();

taskRouter.get('/', (req, res) => {
    res.status(200);
    res.json(tasksJson.tasks);
})

taskRouter.get('/:id', (req, res) => {
    const find = tasksJson.tasks.some(task => task.id == req.params.id);
    if (find) {
        res.status(200);
        res.json(tasksJson.tasks.filter(task => task.id == req.params.id));
    }
    else {
        res.status(400);
        res.json(jsonMessage('warning', "'task' object with such 'id' not found!"))
    }
})

taskRouter.post('/', (req, res) => {
    if (req.body) {
        if (verifyData(req.body, ["title", "deadline", "description"])) {
            if (preventDublication('task', req.body)) {
                const task = constructData('task', req.body);
                tasksJson.tasks.push(task);
                res.status(201);
                res.json(task);
            }
            else {
                res.status(400);
                res.json(jsonMessage('warning', "'body' content for 'task' object has repetitive values, hence dublication was prevented!"))
            }
        }
        else {
            res.status(400);
            res.json(jsonMessage('error', "'body' content for 'task' object has invalid or insufficient fields!"))
        }
    }
    else {
        res.status(400);
        res.json(jsonMessage('error', "'body' content cannot be empty!"));
    }
})

taskRouter.put('/:id', (req, res) => {
    const find = tasksJson.tasks.some(task => task.id == req.params.id);
    if (find) {
        if (req.body) {
            if (req.body.title || req.body.description || req.body.deadline || req.body.completed) {
                updateData('task', req.params.id, {
                    title: req.body.title,
                    description: req.body.description,
                    deadline: req.body.deadline,
                    completed: req.body.completed
                })
                res.status(200);
                res.json(tasksJson.tasks.filter(task => task.id == req.params.id))
            }
            else {
                res.status(400);
                res.json(jsonMessage('warning', "'body' content has unrecongnized field to update!"))
            }
        }
        else {
            res.status(400);
            res.json(jsonMessage('warning', "'body' content is empty nothing to update!")); 
        }
    }
    else {
        res.status(400);
        res.json(jsonMessage('warning', "'task' object with such 'id' not found!"))
    }
})

taskRouter.delete('/:id', (req, res) => {
    const find = tasksJson.tasks.some(task => task.id == req.params.id);
    if (find) {
        tasksJson.tasks = tasksJson.tasks.filter(
            task => task.id != req.params.id
        )   

        if (req.body.withItems) {
            itemsJson.items = itemsJson.items.filter(
                item => item.task_id != req.params.id
            )
            res.status(201);
            res.json(jsonMessage('info', "'task' with 'items' object deleted"));
        }
        else {
            res.status(202);
            res.json(jsonMessage('info', "'task' object deleted"));
        }
    }
    else {
        res.status(404);
        res.json(jsonMessage('warning', "'task' object with such 'id' not found!"))
    }
})

export default taskRouter;