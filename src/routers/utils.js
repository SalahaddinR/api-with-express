import tasksJson from "../data/taskStorage.json";
import itemsJson from "../data/itemStorage.json";

export function jsonMessage(msgType, msgContent) {
    return ({
        type: msgType,
        msg: msgContent
    });
}

export function verifyData(data, expectedFields) {
    for (const expectedField of expectedFields) {
        if (!data.hasOwnProperty(expectedField)) {
            return false;
        }
    }
    return true;
}

export function constructData(dataType, dataContent) {
    switch (dataType) {
        case 'task':
            const tasks = tasksJson.tasks;
            const lastTaskId = tasks.length != 0 ? tasks[tasks.length - 1].id + 1: 1;
            return ({
                id: lastTaskId,
                ...dataContent,
                completed: false
            })
        case 'item': 
            const items = itemsJson.items;
            const lastItemId = items.length != 0 ? items[items.length - 1].id + 1: 1;
            return ({
                id: lastItemId,
                ...dataContent,
                completed: false
            })
        default:
            return ({
                id: 1,
                ...dataContent
            })
    }
}

export function preventDublication(dataType, dataContent) {
    switch(dataType) {
        case 'task':
            const tasks = tasksJson.tasks;
            const taskExists = tasks.some(task => task.title === dataContent.title && task.description === dataContent.description);
            if (!taskExists) {
                return true;
            }
            return false;
        case 'item':
            const items = itemsJson.items;
            const itemExists = items.some(item => item.task_id == dataContent.task_id && item.step === dataContent.step);
            if (!itemExists) {
                return true;
            }
            return false;
        default:
            return false;
    }
}

export function updateData(dataType, dataId, updatingData) {
    switch(dataType) {
        case 'task':
            const tasks = tasksJson.tasks;
            for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
                if (tasks[taskIndex].id == dataId) {
                    for (const dataKey in updatingData) {
                        if (updatingData[dataKey] !== undefined) {
                            tasks[taskIndex][dataKey] = updatingData[dataKey];
                        }
                    }
                }
            }
            return true;
        case 'item':
            const items = itemsJson.items;
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                if (items[itemIndex].id == dataId) {
                    for (const dataKey in updatingData) {
                        if (updatingData[dataKey] !== undefined) {
                            items[itemIndex][dataKey] = updatingData[dataKey];
                        }
                    }
                }
            }
            return true;
        default:
            return false
    }
}