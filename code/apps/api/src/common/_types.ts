export type alertmanagerWebhookType = {
	alerts: [
		{
			status: 'resolved' | 'firing';
			labels: object;
			annotations: {
				description: string;
				summary: string;
			};
			startsAt: string; //rfc3339
			endsAt: string; // rfc3339
			generatorURL: string; // identifies the entity that caused the alert
			fingerprint: string; // fingerprint to identify the alert
		}
	];
};

export type lineResultType = {
	status: string;
};

export type webhookType = 'lineNotify' | 'telegramBot';