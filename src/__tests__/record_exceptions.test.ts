// import axios from "axios";

// describe("record_exceptions", () => {
//     it("successfuly records an error object", async () => {
//         const query = {
//           "message": "Runtime Error",
//           "error_details": {
//               "backtrace": ["/app/controllers/schools_contrloller.rb"]
//           },
//           "application_id": "asdllfkjsl333"
//         };
//         const response = await axios.post("http://localhost:3002/dev/record-exceptions", {
//             params: query
//         });

//         expect(response.status).toEqual(200);
//         // expect(response.data).toEqual(`Queries: ${JSON.stringify(query)}`);
//     });
// });

import { PrismaClient } from '@prisma/client';
import { main } from '../functions/record_exceptions/handler';
import { Context } from 'aws-lambda'
// import { BugtrapperAPIGatewayProxyEvent } from '../../src/libs/api-gateway';
import Error from '../models/Error'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    error: {
      create: jest.fn().mockResolvedValue({ id: 1, message: 'Test Error' }),
    },
  })),
}));

describe('Lambda Handler', () => {
  let event: any;
  let body: Error;
  let defaultContext: Context;

  beforeEach(() => {
    body = {
      message: 'Test message',
      error_details: {
        backtrace: 'Test backtrace',
        environment: 'Test environment',
      },
      application_id: 'Test application ID',
    };

    defaultContext = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'test',
      functionVersion: '1',
      invokedFunctionArn: 'arn',
      memoryLimitInMB: '1',
      awsRequestId: 'aws',
      logGroupName: 'log',
      logStreamName: 'stream',
      getRemainingTimeInMillis: () => 0,
      done: () => {
      },
        fail: () => {
      },
        succeed: () => {
      }
    };

    event = {
      httpMethod: 'post',
      headers: {Authorization: "dummyToken"},
      body: body,
      rawBody: 'exampleRawBody',
      isBase64Encoded: false,
      path: '/change-expiry-elapsed-days',
      multiValueQueryStringParameters: null,
      multiValueHeaders: null,
      pathParameters: null,
      queryStringParameters: null,
      stageVariables: null,
      requestContext: null,
      resource: ''
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should record the error and return a success response', async () => {
    const response = await main(event, defaultContext);

    expect(PrismaClient.prototype.error.create).toHaveBeenCalledWith({
      data: {
        message: 'Test message',
        error_details: {
          backtrace: 'Test backtrace',
          environment: 'Test environment',
        },
        application_id: 'Test application ID',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      JSON.stringify({
        message: 'Error has been recorded successfully',
        recordedError: { id: 1, message: 'Test Error' },
      })
    );
  });

  it('should handle errors and return a 500 response', async () => {
    PrismaClient.prototype.error.create.mockRejectedValue(new Error('Test Error'));

    const response = await main(event, defaultContext);

    expect(PrismaClient.prototype.error.create).toHaveBeenCalledWith({
      data: {
        message: 'Test message',
        error_details: {
          backtrace: 'Test backtrace',
          environment: 'Test environment',
        },
        application_id: 'Test application ID',
      },
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify(new Error('Test Error')));
  });
});