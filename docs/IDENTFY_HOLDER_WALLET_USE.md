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

#  identfy Holder Wallet - How to use 📚

## Create Wallet

In the registration process, a main Wallet will be created from the seed phrase and then a derive HD Wallet wil be also created. The PIN code is used to protect the keys.. The derivation path schemas we use are the ones defined for Alastria Epic - AlastriaID 3.0. The security phrase will be created and showed to the user so it can be stored securely for its recovery in the future. Security phrase and Derivation Path used to create the "Identity wallet" (The wallet we are going to use) are shown only once to the user and NEVER stored in the wallet for security and privacy purposes.

## Create DID

The wallet will ask you to create a DID for the following networks: Alastria, Lacchain and Ebsi. A DID is neccesary to operate in these networks and request credentials issuance and present credentials to third parties. Right now the wallet has met all the requirements for EBSI Conformance program which follows OpenID protocols.

## Request, get and store Credentials

The process of saving a credential can start with a Cross-device flow (for with we should scan a QR code) or a Same-device flow (where we navigate with our mobile device and tap a link to start the flow - this uses deep linking). In both flows the the user gets it is a credential offer, which is processed to start the OpenID4VCI protocol. As a result of this process, the Holder Wallet receives and stores the credentials duly encrypted in the device.

In the case of LACChain, it is used mailbox for the exchange of VC.

## Share Presentations

The process of sharing a presentation starts reading a QR code. It is implemented the OpenID4VP protocol and executes a VP Token Request with the credential(s) we want to present.

## Revoke Presentations

When storing the presentation an additional field is added to the object wich define the presentation as "active", the process of revoking consists (for the moment) of marking this field as "revoked". This of course in the future will have more steps to interact with third parties.

## Code of contribution

Read please the [contribution documentation](../CONTRIBUTING.md)