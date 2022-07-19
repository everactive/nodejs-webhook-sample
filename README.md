# NodeJS Webhook Sample

Everactive provides near real-time sensor readings via a *webhook subscription*. 
This [Node.js](https://nodejs.org) project is an example webhook implimentation that illustrates how a webhook consumes Everactive webhook messages. 
The sample application stores the messages in an in-memory array, limiting the number of stored messages to the most recent ten messages received.

See the [Everacrtive webhooks API overview](https://everactive-ds-docs.readme.io/reference/webhooks-overview) for details of how to register a webhook subscription with Everactive through the [Data Services API](https://dash.readme.com/project/everactive-ds-docs/v1.0/refs/data-services-api-overview).

## Hosting Options

The sample application can be hosted anywhere a [Node.js](https://nodejs.org) application or [Docker container](https://hub.docker.com) can be run. 
The following are examples of hosting options for testing or deployment.

### Host a Docker container for local testing 

The sample application can be run locally with a tunnel to accept external incoming requests.

1. Use the included Docker file to build and run the sample application locally:

```
docker build . -t everactive/webhook-sample
docker run --env API_KEY=secret_key -p 3005:3000 --name evrac-webhook-sample --rm everactive/webhook-sample
```

2. Check the webhook sample is working properly:

```
curl -v 'http://localhost:3005/healh'
curl -v -X POST 'http://localhost:3005' \
  -H 'x-api-key: secret_key' \
  -H 'Content-Type: application/json' \
  -d '{"keyA": "valueA", "keyB": "valueB"}'
curl -v 'http://localhost:3005' --header 'x-api-key: secret_key'
```

A tunneling solution such as [ngrock](https://ngrock.com) or [localtunnel](https://github.com/localtunnel/localtunnel) can be used to expose the running Docker container to the outside world.

### Digital Ocean Deployment

As a convenience, we have provided a button to deploy this sample project on Digital Ocean. 

- A Digital Ocean account is required.
- When deploying, set the environment variable `API_KEY` to the value of the `x-api-key` header that must be included to authorize requests.

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/everactive/nodejs-webhook-sample.git/tree/main)

## Webhook Registration

Once the application is running, you must register the webhook endpoint with Everactive with a POST request to the [Everactive Data Services API](https://everactive-ds-docs.readme.io/reference/post-webhooks). 

1. To register, send the following request using your own URL and Everactive credentials:

```
curl -v -X POST 'https://api.data.everactive.com/ds/v1/webhooks \
  -H `Authorization: Bearer {{access_token}}' \
  -H 'Content-Type: application/json' \
  -d '{"callbackUrl": "https://[your sample webhook url]", "eventType": "sensor_reading", "enabled": true, "headers": [{"key": "x-api-key", "value": "secret_key"}]}'
```

2. The request returns a webhook object that includes an ID value. Note the ID so you can delete the webhook subscription when done running the sample.

3. Before tearing down the sample webhook, delete the webhook subscription in Everactive:

```
curl -v -X DELETE 'https://api.data.everactive.com/ds/v1/webhooks/{{webhookId}}
```
