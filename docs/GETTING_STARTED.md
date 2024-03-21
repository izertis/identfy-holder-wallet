<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./img/identfy-logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./img/identfy-logo-light.svg">
      <img alt="identfy" src="./img/identfy.png" width="350" style="max-width: 100%;">
    </picture>
</p>

<p align="center">
  <h4>
    An all-in-one solution to take control of your digital identity
  </h4>
</p>

<br/>

#  identfy Holder Wallet

## Build

### Prerequisites

- Node.js 16+
- Yarn
- Android Studio / xCode (IOS)

### Installation 🔧

```bash
yarn install
```

### Additional Configuration

Certain variables that are used in the code come from ENVs. this is an example of the ones used.

```
NODE_IP=****      // This variable represents the IP of the blockchain node that we are going to use at LACChain
LINK_URL=************ // This variable represents the URL that bring deep linking
```

## Usage

### Run app in android

```bash
yarn android
```

### Run app in iOS

```bash
yarn ios
```

### Run Jest tests

```bash
yarn test
```

### Generate Android release app

#### To generate index.android.bundle (complete compilation file)

```bash
yarn build:android
```

The file can be found in

```bash
android/app/src/main/assets/index.android.bundle
```

#### To generate AAB (recommended way to upload apps to Google Play)

```bash
cd android
./gradlew bundleRelease
```

The app can be found in

```bash
android/app/build/outputs/bundle/release/app-release.aab
```

#### To generate APK

```bash
cd android
./gradlew assembleRelease
```

The app can be found in
or

```bash
android/app/build/outputs/apk/release/app-release.apk
```


## Code of contribution

Read please the [contribution documentation](../CONTRIBUTING.md)