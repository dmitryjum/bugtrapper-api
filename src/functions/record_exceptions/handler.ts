import { APIGatewayProxyHandler } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const prisma = new PrismaClient();

const record_exceptions: APIGatewayProxyHandler = async (event, _context) => {
  try {
    // Extract the request body from the event
    const { message, error_details, application_id } = event.body;

    // Insert the error data into the errors table using Prisma
    const errorObj = await prisma.error.create({
      data: { message, error_details, application_id }
    });
    // Return a success response
    return formatJSONResponse({
      message: 'Error recorded successfully',
      event,
    })
  } catch (error) {
    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to record error' }),
    };
  }
};

export const main = middyfy(record_exceptions);