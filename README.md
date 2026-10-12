# SpinShare - JavaScript API Wrapper
A simple API wrapper for SpinSha.re.

## Overview
- [Setup](#setup)
- [Usage](#usage)
- [Connect APIs](#connect-apis)
- [Documentation](#documentation)

### Setup
- Install via `npm install @spinshare/api-js`
- The package is ESM-only. CommonJS projects can `require()` it on Node.js 20.19+ / 22.12+.

### Usage
#### Open APIs example
```js
import { SpinShareClient } from "@spinshare/api-js";
const client = new SpinShareClient();

(async () => {
    const userDetail = await client.getUserDetail(10);
    console.log(`A wonderful user: ${userDetail.username}`);
})();
```

#### DLC charts
**Note: This feature is currently in preparation and is not active yet.**
Pass the MD5 hashes of the owned DLCs to the constructor. They are sent when downloading charts:
```js
const client = new SpinShareClient({ dlcHashes: ["monstercat-dlc-hash", "chillhop-dlc-hash"] });
```

#### Connect APIs example
```js
import { SpinShareClient } from "@spinshare/api-js";
const connectApiKey = "85ec933f4978c45a3418268effebd3f6";
const connectApiCode = "18faf7";

const client = new SpinShareClient({ connectApiKey });

(async () => {
    const token = await client.connectGetToken(connectApiCode);
    const profile = await client.connectGetProfile(token);
    console.log(`Authenticated as: ${profile.username}`);
})();
```

#### Error handling
All errors thrown by the client extend `SpinShareError`:
```js
import { NotFoundError, SpinShareClient } from "@spinshare/api-js";
const client = new SpinShareClient();

try {
    await client.getChartDetail(0);
} catch (e) {
    if (e instanceof NotFoundError) console.log("Chart does not exist");
}
```

#### TypeScript
Type declarations are bundled with the package. All response shapes are exported as types:
```ts
import { SpinShareClient, type ChartDetail } from "@spinshare/api-js";
const client = new SpinShareClient();

const chart: ChartDetail = await client.getChartDetail(1904);
console.log(`${chart.title} by ${chart.artist}`);
```

### Connect APIs
Open APIs don't require any type of authentication, these APIs are read-only and only give you publicly accessible data. If you need to modify content and/or want more detailed data (as well as user-private data), you need to use our Connect Authentication system. More information about how to register an app and authenticate it can be found in our API documentation.

### Documentation
The syntax of SpinShare's API can be found in the [API Documentation](https://spinsha.re/api/docs). Join our [Discord](https://spinsha.re/discord) if you want to be updated on API changes.