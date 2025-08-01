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
    const routeKey = event?.requestContext?.routeKey ?? '';
    const params = event.pathParameters ?? {}
    const qs     = event.queryStringParameters ?? {};

    // GET /health
    if (routeKey === 'GET /health') return json(200, { ok: true });

    if (routeKey === 'GET /toons/ids') {
      const q = (qs.q ?? '').trim();
      if (!q) return json(400, { error: 'q is required' });

      const exact = qs.exact === 'true' || qs.exact === '1';
      const payload = await getToonIdsFromPrefixMatch(q, exact);
      return json(200, { ok: true, payload });
    }

    if (routeKey === 'GET /toons/{id}') {
      const idStr = params.id ?? '';
      if (!idStr) return json(400, { error: 'id required' });
      const id = Number(idStr);
      if (!Number.isFinite(id)) return json(400, { error: 'id must be a number' });

      const payload = await getToonInfoFromToonId(id);
      if (!payload) return json(404, { error: 'not found' });
      return json(200, { ok: true, payload });
    }

    return json(404, { error: 'Not found', routeKey });
  } catch (e: any) {
    console.error(e);
    return json(500, { error: 'Server error', message: e?.message ?? String(e) });
  }
};
