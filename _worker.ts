/// <reference types="@cloudflare/workers-types" />

export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(request.url);
    
    // Proxy /ingest/* to OpenPanel
    if (url.pathname.startsWith('/ingest')) {
      const targetPath = url.pathname.replace('/ingest', '') || '/';
      const targetUrl = new URL(targetPath, 'https://ingest.mailhooks.dev');
      targetUrl.search = url.search;
      
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
      });
      
      // Forward the real client IP to OpenPanel for geolocation
      const clientIP = request.headers.get('CF-Connecting-IP');
      if (clientIP) {
        proxyRequest.headers.set('X-Forwarded-For', clientIP);
        proxyRequest.headers.set('X-Real-IP', clientIP);
      }
      proxyRequest.headers.set('Host', 'ingest.mailhooks.dev');
      
      const response = await fetch(proxyRequest);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', '*');
      
      return newResponse;
    }
    
    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};
