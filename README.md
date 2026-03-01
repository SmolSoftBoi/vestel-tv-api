# Vestel TV API

Node.js API for discovering and controlling Vestel-based TVs.

## ✅ Supported brands and models

| Coverage | Brand/model category | Notes |
| --- | --- | --- |
| Known-compatible | Vestel-based smart TVs that respond to DIAL discovery (`urn:dial-multiscreen-org:service:dial:1`) and identify as `urn:schemas-upnp-org:device:tvdevice:1` | This is the compatibility baseline used by this library. |
| Potentially compatible (unverified) | Vestel-manufactured rebrands (model and firmware dependent), including some regional lines sold under brands such as Toshiba, Hitachi, JVC, Finlux, and Telefunken | Treat as unverified until tested by this library. |
| Not currently supported | Non-Vestel platforms that do not expose the required discovery/capability endpoints | Discovery may return no devices, or control APIs may fail by design. |

## 🔎 How to identify your model

Use at least two of the methods below before integrating:

1. Physical device label: locate the product sticker on the back or side panel and note model number, serial number, and manufacturing info.
2. TV settings menu: open the TV's settings/about/system information page and capture model and firmware version.
3. Discovery metadata from this library: run discovery and read `manufacturer`, `model`, `uuid`, and `host` from `tv.context`.

```ts
import { DiscoverDevices } from 'vestel-tv-api/dist/discoverDevices';

const discover = new DiscoverDevices();

discover.on('response', (tv) => {
  console.log({
    host: tv.context.host,
    uuid: tv.context.uuid,
    manufacturer: tv.context.manufacturer ?? 'unknown',
    model: tv.context.model ?? 'unknown',
    isWakeOnLan: tv.context.isWakeOnLan ?? false
  });
});

discover.search();
setTimeout(() => process.exit(0), 5000);
```

## 🧰 Prerequisites

- Node.js `20` or `>=22` (from `package.json` engines)
- Package manager support for installing this package (examples below use Yarn)
- TV and controlling host on the same local network segment
- Local network allows SSDP/multicast discovery traffic
- For wake workflows: device supports Wake-on-LAN metadata/exposure

## ⚡ Quick start and examples

Install:

```bash
yarn add vestel-tv-api
```

### Discover devices

```ts
import { DiscoverDevices } from 'vestel-tv-api/dist/discoverDevices';

const discover = new DiscoverDevices();

discover.on('response', (tv) => {
  console.log('Discovered TV:', {
    host: tv.context.host,
    uuid: tv.context.uuid,
    manufacturer: tv.context.manufacturer,
    model: tv.context.model
  });
});

discover.search();
```

### Example control workflow: wake a discovered TV

```ts
import { DiscoverDevices } from 'vestel-tv-api/dist/discoverDevices';

const discover = new DiscoverDevices();

discover.on('response', async (tv) => {
  if (!tv.context.isWakeOnLan) {
    console.log('Skipping wake: Wake-on-LAN is not available for this TV.');
    return;
  }

  await tv.setActive();
  console.log('Wake signal sent to', tv.context.host);
});

discover.search();
```

### Example control workflow: wake a known TV directly

```ts
import { VestelTv } from 'vestel-tv-api';

const tv = new VestelTv({
  uuid: 'replace-with-tv-uuid',
  host: '192.168.1.50',
  isWakeOnLan: true,
  mac: 'AA:BB:CC:DD:EE:FF'
});

await tv.setActive();
```

## 🛠️ Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No devices discovered | TV or host not on same network, discovery traffic blocked, TV does not expose required DIAL endpoint | Confirm both devices are on the same LAN, run discovery for longer, check router/AP multicast settings, verify the TV is a Vestel-based model. |
| `Network remote is not enabled.` | Called `getActive()` without `context.isNetworkRemote = true` | Enable `isNetworkRemote` in context and ensure the remote endpoint is reachable. |
| `DIAL smart center app is not enabled.` | Called DIAL-dependent methods on a TV/context without Smart Center app capability | Use capabilities exposed in `tv.context` to gate method calls, or avoid DIAL-specific methods on unsupported devices. |
| `Error finding Mac address.` or `Error waking TV.` | Missing/incorrect MAC address or Wake-on-LAN unsupported | Capture MAC from discovery or local network tools, verify WOL support, and ensure the TV can receive WOL packets in standby. |

### Collect diagnostics for issue reports

Use the GitHub issue template so diagnostics are captured in a consistent format:

- [Open diagnostics issue template](https://github.com/SmolSoftBoi/vestel-tv-api/issues/new?template=vestel-tv-diagnostics.yml)
- Template source: `.github/ISSUE_TEMPLATE/vestel-tv-diagnostics.yml`
