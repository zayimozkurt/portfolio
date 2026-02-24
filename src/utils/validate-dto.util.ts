import { ValidateDtoResponse } from '@/types/response/validate-dto.response';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

export async function validateDto<T extends object>(dtoClass: new () => T, body: any): Promise<ValidateDtoResponse<T>> {
    const dtoInstance = plainToClass(dtoClass, body);

    try {
        const errors: ValidationError[] = await validate(dtoInstance, {
            whitelist: true,
        } as ValidatorOptions);

        if (errors.length > 0) {
            const formattedErrors = errors.map((error) => ({
                field: error.property,
                errors: Object.values(error.constraints || {}),
            }));

            const errorMessage = formattedErrors
                .map((error) => `${error.field}: \n${error.errors.map((e) => `* ${e}`).join('\n')}`)
                .join('\n');

            return {
                isSuccess: false,
                message: `input validation failed, problematic fields: \n${errorMessage}`,
                statusCode: 400,
            };
        }

        return {
            isSuccess: true,
            message: 'input validation success',
            statusCode: 200,
            body: dtoInstance
        };
    } catch(error) {
        console.error(error);
        return {
            isSuccess: false,
            message: `internal server error thrown from validateDto`,
            statusCode: 500,
        };
    }
};
