type EnumDictionary<T extends string | symbol | number, U> = {
	[K in T]: U;
};

export enum EnumMyErrorType {
	badRequest,
	forbidden,

	jwtMalformed,

	googleNotProvideEmail,

	notSupportHttpContentType
}

export class MyError extends Error {
	dict: EnumDictionary<EnumMyErrorType, { statusCode: number; message: string }> = {
		[EnumMyErrorType.badRequest]: { statusCode: 400, message: 'badRequest' },
		[EnumMyErrorType.forbidden]: { statusCode: 403, message: 'forbidden' },
		[EnumMyErrorType.jwtMalformed]: { statusCode: 600, message: 'jwtMalformed' },
		[EnumMyErrorType.googleNotProvideEmail]: { statusCode: 999, message: 'googleNotProvideEmail' },
		[EnumMyErrorType.notSupportHttpContentType]: {
			statusCode: 999,
			message: 'notSupportHttpContentType'
		}
	};

	constructor(public type: EnumMyErrorType) {
		super('');
		this.init();
	}

	private init() {
		this.name = `myError`;
		this.message = this.dict[this.type].message;
	}

	get statusCode() {
		return this.dict[this.type].statusCode;
	}
}
