import { FastifyPluginAsync } from 'fastify';
import { alertmanagerWebhookType } from '../common/_types';
import { sendMsgByLineNotify } from '../services/line-notify.service';

const lineNotifyController: FastifyPluginAsync = async (server, options) => {
	server.post(
		`/webhook`,
		// {
		// 	schema: {
		// 		body: addInputJsonSchema
		// 	}
		// },
		async (req, res) => {
			const info = req.body as alertmanagerWebhookType;
			const rtnInfo = await sendMsgByLineNotify(info);
			return { result: `${rtnInfo?.successCount} sent...` };
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

// curl --location --request POST 'http://localhost:3000/api/line-notify/webhook' \
// 	--header 'Content-Type: application/json' \
// 	--data-raw '{
// 		"version": "4",
// 		"alerts": [
// 			{
// 				"labels": {
// 					"alertname": "test name11133443",
// 					"severity" : "Warning"
// 				},
// 				"annotations": {
// 					"Threshold": "<= 2",
// 					"dashboard": "test",
// 					"description":"test",
// 					"infoURL":"test",
// 					"summary":"this is a test mail",
// 					"value":"2"
// 				}
// 			}
// 		]
// 	}'
