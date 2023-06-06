import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { formatJSONResponse } from '@libs/api-gateway';
jest.mock('@prisma/client');
describe('record_exceptions', () => {
    let prismaMock;
    beforeEach(() => {
        prismaMock = new PrismaClient();
    });
    afterEach(() => {
        mocked(prismaMock.error.create).mockClear();
    });
    it('should record an error successfully', async () => {
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Error has been recorded successfully',
                recordedError: expect.any(Object),
            }),
        };
        const recordedError = {
            id: 1,
            message: 'Test error message',
            error_details: 'Test error details',
            application_id: 'test-application-id',
        };
        mocked(prismaMock.error.create).mockResolvedValueOnce(recordedError);
        expect(prismaMock.error.create).toHaveBeenCalledWith({
            data: {
                message: 'Test error message',
                error_details: 'Test error details',
                application_id: 'test-application-id',
            },
        });
        expect(formatJSONResponse).toHaveBeenCalledWith(expectedResult);
    });
    xit('should handle an error', async () => {
        const error = new Error('Test error');
        mocked(prismaMock.error.create).mockRejectedValueOnce(error);
        expect(prismaMock.error.create).toHaveBeenCalledWith({
            data: {
                message: 'Test error message',
                error_details: 'Test error details',
                application_id: 'test-application-id',
            },
        });
    });
});
//# sourceMappingURL=record_exceptions.test.js.map