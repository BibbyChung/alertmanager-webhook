import { EnumMyLoggerLevel } from '../enum/EnumMyLoggerLevel';

export interface IMyLogger {
	log(level: EnumMyLoggerLevel, obj: Record<string, string>): void;
}
