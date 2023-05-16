import { APIGatewayProxyEvent } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import Error from '../../models/Error';

const prisma = new PrismaClient();
interface BugtrapperAPIGatewayProxyEvent extends Omit<APIGatewayProxyEvent, 'body'> {
  body: Error
}
const record_exceptions = async (event: BugtrapperAPIGatewayProxyEvent) => {
  try {
    const { message, error_details, application_id } = event.body;

    await prisma.error.create({
      data: { message, error_details, application_id }
    });
    return formatJSONResponse({
      message: 'Error recorded successfully',
      event,
    })
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const main = middyfy(record_exceptions);