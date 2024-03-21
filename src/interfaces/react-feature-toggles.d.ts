declare module "react-feature-toggles" {
  import * as React from "react";
  import {
    FeatureToggleProps,
    FeatureToggleProviderProps,
  } from "react-feature-toggles";
  export class FeatureToggle extends React.Component<FeatureToggleProps> {}
  export class FeatureToggleProvider extends React.Component<FeatureToggleProviderProps> {}
}
