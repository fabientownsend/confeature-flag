<h1 align="center">Confeature Flag 🍯</h1>

<h2 align="center">A sweet feature flag for JavaScript & TypeScript.</h2>

**🚀 Easy to use**: Declare the lists of your feature and for which context they are released.

**😻 Fast feedback from users**: By avoiding long-lived Git branches, you can get feedback faster from your users.

**🚦 Flexibility of release**: Be empowered by continuously deploying your code and deciding when/where and for who your features are released.

## Getting Started

**1** - Install Confeature Flag using `yarn`:

`yarn add confeature-flag`

Or `npm`:

`npm install confeature-flag`

**2** - Import the dependency

```javascript
const { newConfeatureFlag } = require("confeature-flag");

or

import { newConfeatureFlag } from "confeature-flag";
```

**3** - Create the configuration which lists the features and the contexts for which they are released. This will work with a json or JavaScript object.

```javascript
const configuration = `{
  "my_super_feature": {
    "release_for": ["dev", "qa", "betaTesterUser"]
  }
}`;
```

**4** - Then create a feature flag that contains the configuration plus the initial context. This will return an object with functions generated based on the list of the features provided.

```javascript
const context = "dev";
const confeatureFlag = newConfeatureFlag(configuration, context);
```

**5.a** - The feature `my_super_feature` will generate `isMySuperFeatureReleased()` function and will return its result based on the initial context.

```javascript
if (confeatureFlag.isMySuperFeatureReleased()) {
  // path if the feature is released for the initial context
}
```

**5.b** - A second function is also generated for each feature which allows you to set a different context on the fly. The feature `my_super_feature` will generated `isMySuperFeareReleasedFor(yourDifferentContext)` and will return its result based on this new context.

```javascript
if (confeatureFlag.isMySuperFeatureReleasedFor("betaTesterUser")) {
  // path if the feature is released for a new context
}
```
