import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';
import { main } from '../functions/record_exceptions/handler'
// Replace with the correct path to your function file
import { mocked } from 'ts-jest/utils';
import { formatJSONResponse } from '@libs/api-gateway';

// Mock the PrismaClient to avoid actual database operations
jest.mock('@prisma/client');

describe('record_exceptions', () => {
  let prismaMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    // Create a mock instance of PrismaClient
    prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  afterEach(() => {
    // Clear all mock calls after each test
    mocked(prismaMock.error.create).mockClear();
  });

  it('should record an error successfully', async () => {
    const event: APIGatewayProxyEvent = {
      // Provide the necessary properties for the event
      body: JSON.stringify({
        message: 'Test error message',
        error_details: 'Test error details',
        application_id: 'test-application-id',
      }),
      // Add other required properties as needed
    };

    const context = {};

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Error recorded successfully',
        event,
      }),
    };

    // Mock the PrismaClient error.create method to return a resolved promise
    mocked(prismaMock.error.create).mockResolvedValueOnce({});

    // Call the function with the event and context
    const result = await main(event, context);

    // Assert that the PrismaClient error.create method was called with the expected data
    expect(prismaMock.error.create).toHaveBeenCalledWith({
      data: {
        message: 'Test error message',
        error_details: 'Test error details',
        application_id: 'test-application-id',
      },
    });

    // Assert that the result matches the expected result
    expect(result).toEqual(expectedResult);

    // Assert that the formatJSONResponse function was called with the expected parameters
    expect(formatJSONResponse).toHaveBeenCalledWith(expectedResult);
  });
});