import { postByUrlencodedHttpClient } from '@b/lib';
import { alertmanagerWebhookType, lineResultType } from '../common/_types';

export const sendMsgByLineNotify = async (info: alertmanagerWebhookType) => {
	const url = process.env['LINEINFO_ENDPOINT'] ?? '';
	const token = process.env['LINEINFO_TOKEN'] ?? '';

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

--- 詳細內容(below) ---
${JSON.stringify(item)}
`
		};

		await postByUrlencodedHttpClient<lineResultType>(url, body, options, 'json');
		return { successCount: alerts.length };
	}
};
