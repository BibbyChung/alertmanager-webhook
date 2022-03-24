import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const addInputValidate = z.object({
	x: z
		.number({ required_error: 'value is required', invalid_type_error: 'value must be a boolean' })
		.int({ message: 'value must be an integer' })
		.positive({ message: 'value must be positive' })
		.lte(10, { message: 'value must be less equal 10' }),
	y: z
		.number({ required_error: 'value is required', invalid_type_error: 'value must be a boolean' })
		.int({ message: 'value must be an integer' })
		.positive({ message: 'value must be positive' })
		.lte(10, { message: 'value must be less equal 10' })
});

export type addInputType = z.infer<typeof addInputValidate>;

export const addInputJsonSchema = zodToJsonSchema(addInputValidate, 'addInputJsonSchema');
