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
      // Use openpanel-client-ip as it's the first header OpenPanel checks
      const clientIP = request.headers.get('CF-Connecting-IP');
      if (clientIP) {
        proxyRequest.headers.set('openpanel-client-ip', clientIP);
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
    
    // Redirects — old Ghost-era URLs (blog.adamhancock.co.uk/<slug>/) now 404
    // once the subdomain redirect lands on apex, so map them to /blog/<slug>.
    const redirects: Record<string, string> = {
      '/blog/clawdbot-mailhooks-integration': '/blog/openclaw-mailhooks-integration',
      '/backing-up-mysql-to-azure': '/blog/backing-up-mysql-to-azure',
      '/backing-up-mysql-to-azure/': '/blog/backing-up-mysql-to-azure',
      '/deploying-unifi-on-kubernetes': '/blog/deploying-unifi-on-kubernetes',
      '/deploying-unifi-on-kubernetes/': '/blog/deploying-unifi-on-kubernetes',
      '/devctl-multi-worktree-development': '/blog/devctl-multi-worktree-development',
      '/devctl-multi-worktree-development/': '/blog/devctl-multi-worktree-development',
      '/email-alerts-to-webhooks-mailhooks': '/blog/email-alerts-to-webhooks-mailhooks',
      '/email-alerts-to-webhooks-mailhooks/': '/blog/email-alerts-to-webhooks-mailhooks',
      '/email-to-notion-mailhooks': '/blog/email-to-notion-mailhooks',
      '/email-to-notion-mailhooks/': '/blog/email-to-notion-mailhooks',
      '/ghost-on-kubernetes': '/blog/ghost-on-kubernetes',
      '/ghost-on-kubernetes/': '/blog/ghost-on-kubernetes',
      '/how-to-install-prometheus-and-alertmanager': '/blog/how-to-install-prometheus-and-alertmanager',
      '/how-to-install-prometheus-and-alertmanager/': '/blog/how-to-install-prometheus-and-alertmanager',
      '/imagepull-secrets-with-kubernetes': '/blog/imagepull-secrets-with-kubernetes',
      '/imagepull-secrets-with-kubernetes/': '/blog/imagepull-secrets-with-kubernetes',
      '/install-helm-on-wsl': '/blog/install-helm-on-wsl',
      '/install-helm-on-wsl/': '/blog/install-helm-on-wsl',
      '/k3s-on-digitalocean': '/blog/k3s-on-digitalocean',
      '/k3s-on-digitalocean/': '/blog/k3s-on-digitalocean',
      '/kubernetes-cli-tools': '/blog/kubernetes-cli-tools',
      '/kubernetes-cli-tools/': '/blog/kubernetes-cli-tools',
      '/kubernetes-with-raspberry-pis': '/blog/kubernetes-with-raspberry-pis',
      '/kubernetes-with-raspberry-pis/': '/blog/kubernetes-with-raspberry-pis',
      '/monitoring-kubernetes-with-statuscake': '/blog/monitoring-kubernetes-with-statuscake',
      '/monitoring-kubernetes-with-statuscake/': '/blog/monitoring-kubernetes-with-statuscake',
      '/nodered-on-kubernetes': '/blog/nodered-on-kubernetes',
      '/nodered-on-kubernetes/': '/blog/nodered-on-kubernetes',
      '/openclaw-mailhooks-integration': '/blog/openclaw-mailhooks-integration',
      '/openclaw-mailhooks-integration/': '/blog/openclaw-mailhooks-integration',
      '/portx': '/blog/portx',
      '/portx/': '/blog/portx',
      '/setting-up-fluxcd-on-wsl': '/blog/setting-up-fluxcd-on-wsl',
      '/setting-up-fluxcd-on-wsl/': '/blog/setting-up-fluxcd-on-wsl',
    };
    
    if (redirects[url.pathname]) {
      return Response.redirect(new URL(redirects[url.pathname], url.origin).toString(), 301);
    }
    
    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};
