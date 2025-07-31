import { runOnce } from './services/runOnceAWSLambda';

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2
} from 'aws-lambda';
import { getToonInfoFromToonId } from './repositories/getToonInfoFromToonId';
import { getToonIdsFromPrefixMatch } from './repositories/getToonIdsFromPrefixMatch';

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*', // enable CORS if calling from browser
    'access-control-allow-methods': 'GET,POST'
  },
  body: JSON.stringify(body),
});

export const handler = async (event: APIGatewayProxyEventV2 | any = {}) => {
  try {
    // EventBridge cron trigger
    if (event?.source === 'aws.events') {
      await runOnce();
      return json(200, { ok: true, source: 'cron' });
    }

    // API Gateway HTTP API
    const method = event?.requestContext?.http?.method ?? event?.httpMethod ?? 'GET';
    const path   = event?.requestContext?.http?.path   ?? event?.rawPath ?? '/';
    const params = event.pathParameters ?? {}
    const qs     = event.queryStringParameters ?? {};

    if (method === 'GET' && path === '/health') return json(200, { ok: true });

    // GET /api/names/{id}
    if (method == 'GET' && /^\/api\/names\/[^/]+$/.test(path)) {
      const idStr = params.id ?? path.split('/')[3];
      if (!idStr) return json(400, { error: 'id required' });
      const id = Number(idStr);
      if (!Number.isFinite(id)) return json(400, { error: 'id must be a number' });

      const payload = await getToonInfoFromToonId(id);
      if (!payload) return json(404, { error: 'not found' });

      return json(200, { ok: true, ran: true, payload})
    }

    // GET /api/names?q=nelly&exact=true
    if (method === 'GET' && path === '/api/names') {
      const q = (qs.q ?? '').trim();
      if (!q) return json(400, { error: 'q is required' });

      const exact = qs.exact === 'true' || qs.exact === '1';
      const payload = await getToonIdsFromPrefixMatch(q, exact);
      return json(200, { ok: true, payload });
    }

    return json(404, { error: 'Not found', method, path });
  } catch (e: any) {
    console.error(e);
    return json(500, { error: 'Server error', message: e?.message ?? String(e) });
  }
};
