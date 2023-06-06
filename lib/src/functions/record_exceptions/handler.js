import { PrismaClient } from '@prisma/client';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
const prisma = new PrismaClient();
const record_exceptions = async (event) => {
    try {
        const { message, error_details, application_id } = event.body;
        const recordedError = await prisma.error.create({
            data: { message, error_details, application_id }
        });
        console.log(`Success log: ${JSON.stringify(recordedError.message)}`);
        return formatJSONResponse({
            message: 'Error has been recorded successfully',
            recordedError,
        });
    }
    catch (error) {
        console.log(`Error log: ${JSON.stringify(error)}`);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};
export const main = middyfy(record_exceptions);
//# sourceMappingURL=handler.js.map