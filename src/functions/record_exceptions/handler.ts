import { APIGatewayProxyHandler } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const record_exceptions: APIGatewayProxyHandler = async (event, _context) => {
  try {
    // Extract the request body from the event
    const { message, error_details, application_id } = JSON.parse(event.body);

    // Insert the error data into the errors table using Prisma
    await prisma.error.create({
      data: { message, error_details, application_id }
    });

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Error recorded successfully' }),
    };
  } catch (error) {
    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to record error' }),
    };
  }
};