/**
 * Simple SPA router for Cloudflare Worker
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // If the request is for an asset (has a file extension), serve it directly
  if (url.pathname.includes('.') && !url.pathname.endsWith('.html')) {
    // Try to fetch the asset from the origin
    const response = await fetch(request);
    if (response.status === 200) {
      return response;
    }
  }
  
  // For all other requests, serve index.html
  try {
    const response = await fetch(`${url.origin}/index.html`);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error('Error fetching index.html:', error);
  }
  
  // Fallback - return a simple HTML page that redirects to the homepage
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0;url=/">
        <title>Redirecting...</title>
      </head>
      <body>
        <script>
          window.location.href = "/";
        </script>
        <p>Redirecting to homepage...</p>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}