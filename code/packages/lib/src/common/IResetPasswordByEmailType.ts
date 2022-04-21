import { ICheckValidCode } from './ICheckValidCode';

interface ITmp {
	password: string;
}

export type IResetPasswordByEmailType = ITmp & ICheckValidCode;
