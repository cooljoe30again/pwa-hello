# PWA Hello World — run it

## Start the server

```bash
cd ~/workspace/pwa-hello
python3 -m http.server 8080
```

Then open **http://localhost:8080** in Chrome (desktop).

(`localhost` counts as a secure context, so service workers work. Plain
`http://` on a LAN IP does not — see "phone testing" below.)

## What to observe (all in desktop Chrome)

1. **DevTools → Application tab** — three panels tell the whole story:
   - *Manifest*: the parsed name, icons, colors, display mode.
   - *Service Workers*: shows `sw.js` as activated and running.
   - *Cache Storage*: open `pwa-hello-v1` — the app shell files, sitting
     on disk, ready for offline.
2. **Go offline**: DevTools → Network tab → check *Offline*, reload the page.
   It still renders. The badge flips to red. That is the service worker
   serving the cache — the entire offline mechanic in one reload.
3. **Install it**: Chrome menu → *Install "PWA Hello"* (or the install icon in
   the address bar). It opens in its own window, no browser chrome, with your
   icon. The page's "Launch mode" badge flips to *standalone*.

## Phone testing

Service workers need a secure context, and `http://192.168.x.x` isn't one.
Easiest path: USB-cable the phone, open `chrome://inspect` on desktop,
enable **port forwarding** (8080 → localhost:8080), then open
`http://localhost:8080` in the phone's Chrome. Install via the ⋮ menu.

## The three mechanics, once more

- **Manifest** = identity + installability (name, icons, launch mode).
- **Service worker** = background proxy that makes offline work.
- **Secure context** = the gatekeeper (HTTPS in production, localhost for dev).
