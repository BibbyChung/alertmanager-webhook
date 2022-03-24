import { postByUrlencodedHttpClient } from '@b/lib';
import { FastifyPluginAsync } from 'fastify';
import { firstValueFrom } from 'rxjs';
import { envConfig } from '../environment';

type lineResultType = {
	status: string;
};

type alertmanagerWebhookType = {
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

const lineNotifyController: FastifyPluginAsync = async (server, options) => {
	server.post(
		`/webhook`,
		// {
		// 	schema: {
		// 		body: addInputJsonSchema
		// 	}
		// },
		async (req, res) => {
			const { alerts } = req.body as alertmanagerWebhookType;

			console.log(req.body);

			const lineInfo = envConfig.lineInfo;
			const url = lineInfo.endPoint;
			const token = lineInfo.token;
			const options = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			};

			for (const item of alerts) {
				const body = {
					message: `
summary: ${item.annotations.summary}
description: ${item.annotations.description}
`
				};

				const rr = await firstValueFrom(
					postByUrlencodedHttpClient<lineResultType>(url, body, options, 'json')
				);
			}

			return { result: `${alerts.length} sent...` };
		}
	);
};

export default lineNotifyController;

// # _token=aLsgYZxdgDcbnnnkx3v3JYJIjYPfuXylR9MgOL18d5I
// # msg="
// # 我我
// # 哪哪哪eee1111
// # "
// # curl -X POST \
// #   https://notify-api.line.me/api/notify \
// #   -H "Authorization: Bearer ${_token}" \
// #   -H "Content-Type: application/x-www-form-urlencoded" \
// #   -d "message=${msg}"

// {
// 	"version": "4",
// 	"groupKey": <string>,              // key identifying the group of alerts (e.g. to deduplicate)
// 	"truncatedAlerts": <int>,          // how many alerts have been truncated due to "max_alerts"
// 	"status": "<resolved|firing>",
// 	"receiver": <string>,
// 	"groupLabels": <object>,
// 	"commonLabels": <object>,
// 	"commonAnnotations": <object>,
// 	"externalURL": <string>,           // backlink to the Alertmanager.
// 	"alerts": [
// 		{
// 			"status": "<resolved|firing>",
// 			"labels": <object>,
// 			"annotations": <object>,
// 			"startsAt": "<rfc3339>",
// 			"endsAt": "<rfc3339>",
// 			"generatorURL": <string>,      // identifies the entity that caused the alert
// 			"fingerprint": <string>        // fingerprint to identify the alert
// 		},
// 		...
// 	]
// }



// alerts1='[
//   {
//     "labels": {
//        "alertname": "test name",
//        "severity" : "Warning"
//      },
//      "annotations": {
//         "Threshold": "<= 2",
//         "dashboard": "test",
//         "description":"test",
//         "infoURL":"test",
//         "summary":"this is a test mail",
//         "value":"2"
//       }
//   }
// ]'


// ## Line Notify template for Firing Alert
//
// Alert {{groupLabels.alertname}} is {{status}}
// Severity {{commonLabels.severity}}
//
// Affected nodes,
//
// {{#alerts}}
//   - {{labels.instance}}
// {{/alerts}}

// ## Line Notify template for Resolved Alert
//
// Alert {{groupLabels.alertname}} for nodes below has been {{status}}
// {{#alerts}}
//     - {{labels.instance}}
// {{/alerts}}



// alert='{
//   "version": "4",
//   "alerts": [
//     {
//       "labels": {
//         "alertname": "test name11133443",
//         "severity" : "Warning"
//       },
//       "annotations": {
//         "Threshold": "<= 2",
//         "dashboard": "test",
//         "description":"test",
//         "infoURL":"test",
//         "summary":"this is a test mail",
//         "value":"2"
//       }
//     }
//   ]
// }'

// server=localhost:3000
// curl -H "Content-Type: application/json" -X POST -d "${alert}" http://${server}/api/line-notify/webhook