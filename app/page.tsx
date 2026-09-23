/**
 * Static export has no middleware, so `/` redirects in the browser: Spanish
 * speakers go to /es/, everyone else to /en/. The meta refresh covers visitors
 * (and crawlers) without JavaScript.
 */
export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0; url=/en/" />
        <link rel="canonical" href="/en/" />
        <script
          dangerouslySetInnerHTML={{
            __html: `location.replace((navigator.language||"").toLowerCase().startsWith("es")?"/es/":"/en/")`,
          }}
        />
      </head>
      <body />
    </html>
  );
}
