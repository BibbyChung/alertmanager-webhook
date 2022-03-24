import { postByUrlencodedHttpClient } from '@b/lib';
import { alertmanagerWebhookType, lineResultType } from '../common/_types';
import { envConfig } from '../environment';

export const sendMsgByLineNotify = async (info: alertmanagerWebhookType) => {
	const lineInfo = envConfig.lineInfo;
	const url = lineInfo.endPoint;
	const token = lineInfo.token;
	const options = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const { alerts } = info as alertmanagerWebhookType;

	for (const item of alerts) {
		const body = {
			message: `
summary: ${item.annotations.summary}
description: ${item.annotations.description}
`
		};

		await postByUrlencodedHttpClient<lineResultType>(url, body, options, 'json');
		return { successCount: alerts.length };
	}
};
