// Live currency exchange rates for exchange.html.
// Proxies a free, key-less rates API and caches the result on Netlify's CDN
// so visitors get fast responses and the upstream API isn't hit on every page view.
export default async (req: Request) => {
  const base = (new URL(req.url).searchParams.get('base') || 'USD').toUpperCase()
  if (!/^[A-Z]{3}$/.test(base)) {
    return Response.json({ error: 'Invalid base currency' }, { status: 400 })
  }

  try {
    const upstream = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    const data = await upstream.json()
    if (!upstream.ok || data.result !== 'success') {
      return Response.json({ error: 'Rates unavailable' }, { status: 502 })
    }

    return Response.json(
      { base: data.base_code, updated: data.time_last_update_utc, rates: data.rates },
      {
        headers: {
          'Cache-Control': 'public, max-age=600',
          'Netlify-CDN-Cache-Control': 'public, durable, max-age=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch {
    return Response.json({ error: 'Rates unavailable' }, { status: 502 })
  }
}

export const config = {
  path: '/api/exchange-rates',
  method: 'GET',
}
