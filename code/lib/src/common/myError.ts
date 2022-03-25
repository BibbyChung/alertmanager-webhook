type EnumDictionary<T extends string | symbol | number, U> = {
	[K in T]: U;
};

export enum EnumMyErrorType {
	badRequest,
	forbidden,

	jwtMalformed,

	googleNotProvideEmail,

	notSupportHttpContentType,

	plsSetUpType,
	lineNotifyEndpoint,
	lineNotifyToken,
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
		},
		[EnumMyErrorType.plsSetUpType]:{ statusCode: 700, message: 'please set up type'},
		[EnumMyErrorType.lineNotifyEndpoint]:{ statusCode: 701, message: 'please set up line-notify endpoint'},
		[EnumMyErrorType.lineNotifyToken]:{ statusCode: 702, message: 'please set up line-notify token'}
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
