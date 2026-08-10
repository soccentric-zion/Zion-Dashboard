# Zion IV&V Web Console Next.js operator console for the SiliconCentric IV&V platform. The UI talks to the Zion Server REST API and documented run/log SSE streams only. ## Features - Frosted desktop shell with module navigation, mode switcher, global Start/Stop, connection status, and keyboard shortcuts.
- Server-discovered module pages with mode-specific configuration sections, live/current results, rolling charts for streaming modes, event/result tables, and previous run review.
- Logs page with server-side history filters and active-run live tail.
- Settings area with General, OTA Host, and OTA Device tabs.
- Honest offline, empty, deferred, and OTA-not-yet-triggered states.
- Light/dark/system theme preference stored locally. ## Environment Set the Zion Server base URL if it is not running on the default local address: ```bash
NEXT_PUBLIC_PLATFORM_SERVER=http://localhost:8080
``` ## Development ```bash
npm install
npm run dev
``` Open `http://localhost:3000` unless Next.js reports a different port. From the repository root you can also use: ```bash
make install
make dev
``` ## Validation ```bash
npm run lint
npm run build
``` The production build statically prerenders the shell routes and keeps `/modules/[moduleId]` dynamic for server-provided module IDs. ## API Notes The API inventory and source-code findings are documented in `../docs/WEB_FINDINGS.md`. Where UI behavior depends on backend support, the interface stays explicit: device OTA upload lands the image in `/tmp`, and the future update trigger step remains disabled until the server/client command exists.
