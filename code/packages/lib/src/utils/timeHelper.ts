import {
	isToday,
	startOfDay,
	endOfDay,
	addSeconds,
	formatISO,
	fromUnixTime,
	getTime,
	getUnixTime,
	format,
	parseISO,
	parse,
	isValid
} from 'date-fns';

// https://date-fns.org/docs/Getting-Started
// https://date-fns.org/v2.15.0/docs/lightFormat
// ISO8601 => 2020-08-21T14:58:09+08:00
// 2021-03-18T03:10:51.000Z

// https://github.com/apache/echarts/issues/14453
// https://date-fns.org/v2.21.3/docs/Time-Zones
// https://stackoverflow.com/questions/58561169/date-fns-how-do-i-format-to-utc

export type TimeFormatType =
	| 'yyyy-MM-dd HH:mm:ss'
	| 'yyyy-MM-dd HH:mm'
	| 'yyyy-MM-dd'
	| 'yyyy/MM/dd'
	| 'HH:mm'
	| 'HH:mm:ss'
	| 'MMM ddd, yyyy';

export const getIsToday = (date: Date | number) => {
	return isToday(date);
};

// please use it in client side(check timezone)
export const getStartEndDayInfo = (timestamp: number) => {
	const date = getTimestampToDate(timestamp);
	return {
		startOfDay: getDateToTimestamp(startOfDay(date)),
		endOfDay: getDateToTimestamp(endOfDay(date))
	};
};

export const getDateToTimestamp = (date: Date) => {
	return getUnixTime(date);
};

export const getDateToDateStrByCustomFormat = (date: Date, formatStr: string) => {
	return format(date, formatStr);
};

export const getDateToDateStr = (date: Date, formatStr: TimeFormatType) => {
	return format(date, formatStr);
};

export const getNowTimeStamp = (seconds = 0) => {
	const now = new Date();
	const newDate = addSeconds(now, seconds);
	return getDateToTimestamp(newDate);
};

export const getNowTimeStampMilliseconds = (seconds = 0) => {
	const now = new Date();
	const newDate = addSeconds(now, seconds);
	return getTime(newDate);
};

export const getTimestampToDate = (timestamp: number) => {
	// 10 digit seconds
	// 13 digit miliseconds
	let tt = timestamp;
	if (timestamp.toString().length > 11) {
		tt = timestamp / 1000;
	}
	return fromUnixTime(tt);
};

export const getTimestampToDateStr = (timestamp: number, formatStr: TimeFormatType) => {
	return getDateToDateStr(getTimestampToDate(timestamp), formatStr);
};

export const getTimestampToDateStrByCustomFormat = (timestamp: number, formatStr: string) => {
	return getDateToDateStrByCustomFormat(getTimestampToDate(timestamp), formatStr);
};

export const getISODateStrToTimestamp = (isoDateStr: string, seconds = 0) => {
	const date = parseISO(isoDateStr);
	const newDate = addSeconds(date, seconds);
	return getDateToTimestamp(newDate);
};

export const getISODateStrToDateStr = (isoDateStr: string, formatStr: TimeFormatType) => {
	const ts = getISODateStrToTimestamp(isoDateStr);
	return getTimestampToDateStr(ts, formatStr);
};

export const getDateStrToTimestamp = (dateStr: string, formate: TimeFormatType, seconds = 0) => {
	const date = parse(dateStr, formate, getNowTimeStamp());
	const newDate = addSeconds(date, seconds);
	return getDateToTimestamp(newDate);
};

export const getTimestampToISOString = (timestamp: number, seconds = 0) => {
	const d = getTimestampToDate(timestamp);
	const newD = addSeconds(d, seconds);
	return formatISO(newD);
};

export const isValidDateStr = (dateStr: string, format: TimeFormatType) => {
	const date = parse(dateStr, format, new Date());
	return isValid(date);
};
