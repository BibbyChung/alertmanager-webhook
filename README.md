# Alertmanager Webhook to Line Notify

<img width="423" alt="image" src="https://user-images.githubusercontent.com/8520661/160547320-95cedbc7-4030-4998-8669-62bdedcba8ec.png">

## how to use

Run it by docker

```sh
docker run \
  -p 3000:3000 \
  -e LINENOTIFY_ENDPOINT=${LINENOTIFY_ENDPOINT} \
  -e LINENOTIFY_TOKEN=${LINENOTIFY_TOKEN} \
  -e TYPE=lineNotify \
  bibbynet/alertmanager-webhook:1.0
```

Test it with cURL.

```sh
curl --location --request POST 'http://localhost:3000/api/webhook/alert' \
--header 'Content-Type: application/json' \
--data-raw '{
    "version": "4",
    "alerts": [
        {
            "status": "firing",
            "labels": {
                "alertname": "test-webhook",
                "severity": "Warning"
            },
            "annotations": {
                "Threshold": "<= 2",
                "dashboard": "test-dashboard",
                "description": "test description",
                "infoURL": "test-infoURL",
                "summary": "this is a test summary",
                "value": "2"
            }
        }
    ]
}'
```

## docker compose setting

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
      - TYPE=lineNotify
```

## kubernetes setting

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    ann: alertmanager-webhook-ann
  labels:
    app: api-lab
    lab: alertmanager-webhook-lab
  name: prod-api-deployment
  namespace: alertmanager-webhook-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-pod
      lab: alertmanager-webhook-lab
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      annotations:
        ann: alertmanager-webhook-ann
      labels:
        app: api-pod
        lab: alertmanager-webhook-lab
    spec:
      containers:
        - env:
            - name: TYPE
              value: lineNotify
            - name: LINENOTIFY_ENDPOINT
              value: ${LINENOTIFY_ENDPOINT}
            - name: LINENOTIFY_TOKEN
              value: ${LINENOTIFY_TOKEN}
          image: bibbynet/alertmanager-webhook:1.0
          imagePullPolicy: Always
          livenessProbe:
            failureThreshold: 10
            httpGet:
              path: /api/a/healthz
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 20
            successThreshold: 1
            timeoutSeconds: 10
          name: app
          ports:
            - containerPort: 3000
              name: app3000
          readinessProbe:
            failureThreshold: 10
            httpGet:
              path: /api/a/healthz
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 20
            successThreshold: 1
            timeoutSeconds: 10
          resources:
            limits:
              cpu: 256m
              memory: 256Mi
            requests:
              cpu: 128m
              memory: 128Mi
      restartPolicy: Always
```

## line notify

https://notify-bot.line.me/en/

## inspiration

https://github.com/DRuggeri/alertmanager_gotify_bridge

https://github.com/nontster/line-notify-gateway
