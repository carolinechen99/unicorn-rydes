"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

// This is used to mimic poison pill messages
const errorString = "error";

// Entrypoint for Lambda Function
exports.handler = function (event, context, callback) {
    console.log(
        "Number of Records sent for each invocation of Lambda function = ",
        event.Records.length
    );
    const requestItems = buildRequestItems(event.Records);
    const requests = buildRequests(requestItems);

    Promise.all(requests)
        .then(() =>
            callback(null, `Delivered ${event.Records.length} records`)
        )
        .catch(callback);
};

// Build DynamoDB request payload
function buildRequestItems(records) {
    return records.map((record) => {
        const json = Buffer.from(record.kinesis.data, "base64").toString(
            "ascii"
        );
        const item = JSON.parse(json);
        //Check for error and throw the error. This is more like a validation in your usecase
        if (item.InputData.toLowerCase().includes(errorString)) {
            console.log("Error record is = ", item);
            throw new Error("kaboom");
        }
        return {
            PutRequest: {
                Item: item,
            },
        };
    });
}

function buildRequests(requestItems) {
    const requests = [];
    // Batch Write 25 request items from the beginning of the list at a time
    while (requestItems.length > 0) {
        const request = batchWrite(requestItems.splice(0, 25));

        requests.push(request);
    }

    return requests;
}

// Batch write items into DynamoDB table using DynamoDB API
function batchWrite(requestItems, attempt = 0) {
    const params = {
        RequestItems: {
            [tableName]: requestItems,
        },
    };

    let delay = 0;

    if (attempt > 0) {
        delay = 50 * Math.pow(2, attempt);
    }

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            dynamoDB
                .batchWrite(params)
                .promise()
                .then(function (data) {
                    if (data.UnprocessedItems.hasOwnProperty(tableName)) {
                        return batchWrite(
                            data.UnprocessedItems[tableName],
                            attempt + 1
                        );
                    }
                })
                .then(resolve)
                .catch(reject);
        }, delay);
    });
}
