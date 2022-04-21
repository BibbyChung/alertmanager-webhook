import { EnumMyErrorType, MyError, postByUrlencodedHttpClient } from '@b/lib';
import { alertmanagerWebhookType, lineResultType } from '../common/_types';

export const sendMsgByLineNotify = async (info: alertmanagerWebhookType) => {
	const url = process.env['LINENOTIFY_ENDPOINT'];
	const token = process.env['LINENOTIFY_TOKEN'];

	if (!url) {
		throw new MyError(EnumMyErrorType.lineNotifyEndpoint);
	}

	if (!token) {
		throw new MyError(EnumMyErrorType.lineNotifyEndpoint);
	}

	const options = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const { alerts } = info as alertmanagerWebhookType;

	for (const item of alerts) {
		const body = {
			message: `
status: ${item.status ?? '-'}
summary: ${item.annotations.summary}
description: ${item.annotations.description}

==== detail (below) ====

${JSON.stringify(item)}
`
		};

		await postByUrlencodedHttpClient<lineResultType>(url, body, options, 'json');
		return { successCount: alerts.length };
	}
};
