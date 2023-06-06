// import { PrismaClient, Error } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
// import { main } from '../functions/record_exceptions/handler'
// Replace with the correct path to your function file
// import { mocked } from 'ts-jest/utils';
import { formatJSONResponse } from '../libs/api-gateway';

// Mock the PrismaClient to avoid actual database operations
jest.mock('@prisma/client');

describe('record_exceptions', () => {
  let prismaMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  // afterEach(() => {
  //   jest.mocked(prismaMock.error.create).mockClear();
  // });

  it('should record an error successfully', async () => {
    // const event: BugtrapperAPIGatewayProxyEvent = {
    //   body: {
    //     message: 'Test error message',
    //     error_details: {
    //       backtrace: "/somebacktrace",
    //       environment: {key: "value"}
    //     },
    //     application_id: 'test-application-id',
    //   }),
    //   // Add other required properties as needed
    // };

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Error has been recorded successfully',
        recordedError: expect.any(Object),
      }),
    };

    // const recordedError: Error = {
    //   id: 1,
    //   message: 'Test error message',
    //   error_details: 'Test error details',
    //   application_id: 'test-application-id',
    //   // Add other required properties as needed
    // };

    // jest.mocked(prismaMock.error.create).mockResolvedValueOnce(recordedError);

    // const result = await main(event);

    expect(prismaMock.error.create).toHaveBeenCalledWith({
      data: {
        message: 'Test error message',
        error_details: 'Test error details',
        application_id: 'test-application-id',
      },
    });

    // expect(result).toEqual(expectedResult);

    expect(formatJSONResponse).toHaveBeenCalledWith(expectedResult);
  });

  xit('should handle an error', async () => {
    // const event: BugtrapperAPIGatewayProxyEvent = {
    //   body: JSON.stringify({
    //     message: 'Test error message',
    //     error_details: 'Test error details',
    //     application_id: 'test-application-id',
    //   }),
    //   // Add other required properties as needed
    // };

    // const expectedErrorResult = {
    //   statusCode: 500,
    //   body: JSON.stringify({ error: 'Failed to record error' }),
    // };

    const error = new Error('Test error');

    jest.mocked(prismaMock.error.create).mockRejectedValueOnce(error);

    // const result = await main(event);

    expect(prismaMock.error.create).toHaveBeenCalledWith({
      data: {
        message: 'Test error message',
        error_details: 'Test error details',
        application_id: 'test-application-id',
      },
    });

    // expect(result).toEqual(expectedErrorResult);
  });
});