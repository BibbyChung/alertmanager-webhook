# Alertmanager Webhook to Line Notify


## docker-compose

```yml

version: "3.3"

services:
  alertmanager-webhook:
    image: bibbynet/alertmanager-webhook:1.0
    restart: always
    ports:
      - "3000:3000"
    environment:
      - LINENOTIFY_ENDPOINT=${LINENOTIFY_ENDPOINT}
      - LINENOTIFY_TOKEN=${LINENOTIFY_TOKEN}
      - TYPE=${TYPE}

```

## testing & development

Run it by docker

```sh
docker run -it \
  -p 3000:3000 \
  -e LINENOTIFY_ENDPOINT=${LINENOTIFY_ENDPOINT} \
  -e LINENOTIFY_TOKEN=${LINENOTIFY_TOKEN} \
  -e TYPE=${TYPE} \
  bibbynet/alertmanager-webhook:1.0
```

Use cURL to test it.

```sh
curl --location --request POST 'http://localhost:3000/api/webhook/alert' \
--header 'Content-Type: application/json' \
--data-raw '{
  "version": "4",
  "alerts": [
    {
      "labels": {
        "alertname": "test-webhook",
        "severity" : "Warning"
      },
      "annotations": {
        "Threshold": "<= 2",
        "dashboard": "test-dashboard",
        "description":"test-description",
        "infoURL":"test-infoURL",
        "summary":"this is a test summary",
        "value":"2"
      }
    }
  ]
}'
```

## line notify

https://notify-bot.line.me/en/


## inspiration

- https://github.com/DRuggeri/alertmanager_gotify_bridge
- https://github.com/nontster/line-notify-gateway

