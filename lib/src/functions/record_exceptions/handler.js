import { PrismaClient } from '@prisma/client';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const prisma = new PrismaClient();
const record_exceptions = async (event, _context) => {
    try {
        const { message, error_details, application_id } = JSON.parse(event.body);
        const errorObj = await prisma.error.create({
            data: { message, error_details, application_id }
        });
        console.log(errorObj);
        return formatJSONResponse({
            message: 'Error recorded successfully',
            event,
        });
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to record error' }),
        };
    }
};
export const main = middyfy(record_exceptions);
//# sourceMappingURL=handler.js.map