# SpinShare - JavaScript API Wrapper
A simple API wrapper for SpinSha.re.

## Overview
- [Setup](#setup)
- [Usage](#usage)
- [Connect APIs](#connect-apis)
- [Documentation](#documentation)

### Setup
- Install via `npm install @spinshare/api-js`

### Usage
#### Open APIs example
```js
import SpinShareClient from "@spinshare/api-js";
const client = new SpinShareClient();

(async () => {
    const userDetail = await client.getUserDetail(10);
    console.log(`A wonderful user: ${userDetail.username}`);
})();
```

#### DLC charts
Pass a DLC hash to the constructor to send it as `SPSH-DLC-Hash` for downloading DLC charts:
```js
const client = new SpinShareClient({ dlcHash: "your-dlc-hash" });
```

#### Connect APIs example
```js
import SpinShareClient from "@spinshare/api-js";
const connectApiKey = "85ec933f4978c45a3418268effebd3f6";
const connectApiCode = "18faf7";

const client = new SpinShareClient(connectApiKey);

(async () => {
    const token = await client.connectGetToken(connectApiCode);
    const profile = await client.connectGetProfile(token);
    console.log(`Authenticated as: ${profile.username}`);
})();
```

### Connect APIs
Open APIs don't require any type of authentication, these APIs are read-only and only give you publicly accessible data. If you need to modify content and/or want more detailled data (as well as user-private data), you need to use our Connect Authentication system. More information about how to register an app and authenticate it can be found in our API documentation.

### Documentation
The syntax of SpinShare's API can be found in the [API Documentation](https://spinsha.re/api/docs). Join our [Discord](https://spinsha.re/discord) if you want to be updated on API changes.