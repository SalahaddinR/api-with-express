import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import { verifyData } from "../routers/utils";

describe("GET request testing for TASK API", () => {
    test("testing endpoint /api/tasks/", async () => {
        const response = await request(app).get("/api/tasks/");
        
        expect(response.statusCode).toBe(200);
        const body = response.body;
        body.forEach(
            task => {
                expect(verifyData(task, ["id", "title", "description", "deadline", "completed"])).toBe(true);
            }
        )
    });

    test("testing endpoint /api/tasks/:id", async () => {
        const existingTaskID = 1; const nonExistingTaskID = 9999;

        const responseExpectingSuccess = await request(app).get(`/api/tasks/${existingTaskID}`);
        const responseExpectingFailure = await request(app).get(`/api/tasks/${nonExistingTaskID}`);

        expect(responseExpectingSuccess.status).toBe(200);
        expect(responseExpectingFailure.status).toBe(400);

        expect(responseExpectingSuccess.body[0].id).toBe(existingTaskID);
        expect(responseExpectingFailure.body.type).toBe('warning');
    })
});

describe("POST request testing for TASK API", () => {
    test("testing endpoint /api/tasks/ with valid data", async () => {
        const postData = {
            title: "Jest Testing Title",
            description: "Jest Testing Description",
            deadline: {
                day: 1,
                month: 1,
                year: 2023
            }
        };

        const response = await request(app).post('/api/tasks').send(postData);

        expect(response.statusCode).toBe(201);
        expect(verifyData(response.body, ["id", "title", "description", "deadline", "completed"])).toBe(true);
    });

    test("testing endpoint /api/tasks with invalid data", async () => {
        const postData = {
            invalidField: "invalid"
        }

        const response = await request(app).post('/api/tasks').send(postData);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.type).toBe("error");
    })

    test("testing endpoint /api/tasks with empty data", async () => {
        const postData = {};

        const response = await request(app).post('/api/tasks').send(postData);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.type).toBe("error");
    })

    test("testing endpoint /api/tasks with repetitive data", async () => {
        const postData = {
            title: "Jest Testing Title",
            description: "Jest Testing Description",
            deadline: {
                day: 1,
                month: 1,
                year: 2023
            }
        };

        const response = await request(app).post('/api/tasks').send(postData);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.type).toBe("warning");
    })
})

describe("PUT request testing for TASK API", () => {
    test("testing endpoint /api/tasks/:id with valid and invalid ID", async () => {
        const existingTaskID = 1; const nonExistingTaskID = 9999;
        const putData = {
            title: "Changed Title",
            description: "Changed Description",
            deadline: {
                day: 1,
                month: 5,
                year: 2023
            }
        }

        const responseExpectingSuccess = await request(app).put(`/api/tasks/${existingTaskID}`).send(putData);
        const responseExpectingFailure = await request(app).put(`/api/tasks/${nonExistingTaskID}`).send(putData);

        expect(responseExpectingSuccess.status).toBe(200);
        expect(responseExpectingFailure.status).toBe(400);

        expect(responseExpectingSuccess.body[0].title).toBe(putData.title);
        expect(responseExpectingSuccess.body[0].description).toBe(putData.description);
        expect(responseExpectingSuccess.body[0].deadline.day).toBe(putData.deadline.day);
        expect(responseExpectingSuccess.body[0].deadline.month).toBe(putData.deadline.month);
        expect(responseExpectingSuccess.body[0].deadline.year).toBe(putData.deadline.year)

        expect(responseExpectingFailure.body.type).toBe('warning');
    })

    test("testing endpoint /api/tasks/:id with and without data", async () => {
        const putData = {
            title: "Changed Title",
            description: "Changed Description",
            deadline: {
                day: 1,
                month: 5,
                year: 2023
            }
        }

        const responseExpectingSuccess = await request(app).put('/api/tasks/1').send(putData);
        const responseExpectingFailure = await request(app).put('/api/tasks/1').send({});

        expect(responseExpectingSuccess.status).toBe(200);
        expect(responseExpectingFailure.status).toBe(400);

        expect(responseExpectingSuccess.body[0].title).toBe(putData.title);
        expect(responseExpectingSuccess.body[0].description).toBe(putData.description);
        expect(responseExpectingSuccess.body[0].deadline.day).toBe(putData.deadline.day);
        expect(responseExpectingSuccess.body[0].deadline.month).toBe(putData.deadline.month);
        expect(responseExpectingSuccess.body[0].deadline.year).toBe(putData.deadline.year)

        expect(responseExpectingFailure.body.type).toBe('warning');
    })
})

describe('DELETE request testing for TASK API', () => {
    test("testing enpoint /api/tasks/:id deleting withItems", async () => {
        const existingIDOne= 1; const existingIDTwo = 2;
        const responseWithItems = await request(app).delete(`/api/tasks/${existingIDOne}`).send({
            withItems: true
        });

        const responseWithoutItems = await request(app).delete(`/api/tasks/${existingIDTwo}`).send({
            withItems: false
        })

        expect(responseWithItems.status).toBe(201);
        expect(responseWithoutItems.status).toBe(202);

        const verificationResponse = await request(app).get(`/api/items/of-task/${existingIDOne}`);
        expect(verificationResponse.status).toBe(404);
    })

    test("testing endpoint /api/tasks/:id deleting with existing and nonexisting ID", async () => {
        const existingID = 3; const nonExistingID = 9999;

        const responseSuccess = await request(app).delete(`/api/tasks/${existingID}`);
        const responseFail = await request(app).delete(`/api/tasks/${nonExistingID}`);

        expect(responseSuccess.status).toBe(202);
        expect(responseFail.status).toBe(404);
    })
})