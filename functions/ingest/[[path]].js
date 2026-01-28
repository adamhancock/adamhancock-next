// Cloudflare Pages Function to proxy OpenPanel ingest requests
// Routes: /ingest/* → ingest.mailhooks.dev/*

export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Rewrite to OpenPanel ingest endpoint
  const targetUrl = new URL(url.pathname.replace('/ingest', '') || '/', 'https://ingest.mailhooks.dev');
  targetUrl.search = url.search;
  
  // Create new request with correct Host header
  const proxyRequest = new Request(targetUrl, {
    method: context.request.method,
    headers: new Headers(context.request.headers),
    body: context.request.body,
  });
  
  // Override Host header for OpenPanel
  proxyRequest.headers.set('Host', 'ingest.mailhooks.dev');
  
  // Forward the request
  const response = await fetch(proxyRequest);
  
  // Return response with CORS headers for browser requests
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  
  return newResponse;
}
