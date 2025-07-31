import { runOnce } from './services/runOnceAWSLambda';

type APIGatewayEventV2 = {
  requestContext?: { http?: { method?: string; path?: string } };
  rawPath?: string;
  httpMethod?: string;
  body?: string | null;
};

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*', // enable CORS if calling from browser
  },
  body: JSON.stringify(body),
});

export const handler = async (event: APIGatewayEventV2 | any = {}) => {
  try {
    // EventBridge cron trigger
    if (event?.source === 'aws.events') {
      await runOnce();
      return json(200, { ok: true, source: 'cron' });
    }

    // API Gateway HTTP API
    const method = event?.requestContext?.http?.method ?? event?.httpMethod ?? 'GET';
    const path   = event?.requestContext?.http?.path   ?? event?.rawPath ?? '/';

    if (method === 'GET' && path === '/health') return json(200, { ok: true });

    if (method === 'POST' && path === '/run') {
      await runOnce();
      return json(200, { ok: true, ran: true });
    }

    return json(404, { error: 'Not found', method, path });
  } catch (e: any) {
    console.error(e);
    return json(500, { error: 'Server error', message: e?.message ?? String(e) });
  }
};
