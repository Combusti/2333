/**
 * feature flags for our app
 */
export interface FeatureFlags {
    FEATURE_ROLE_BASED_ACCESS_CONTROLS: boolean;
    FEATURE_SINGLE_SIGN_ON: boolean;
}

/**
 * helper type for our feature toggle keys
 */
 export type FeatureFlagsKeys = keyof FeatureFlags;

/**
 * feature toggles for our app
 * (enum of keys used to check for feature flags against our environment)
 */
 export const FeatureFlag: { [key in FeatureFlagsKeys]: FeatureFlagsKeys } = {
    FEATURE_ROLE_BASED_ACCESS_CONTROLS: 'FEATURE_ROLE_BASED_ACCESS_CONTROLS',
    FEATURE_SINGLE_SIGN_ON: 'FEATURE_SINGLE_SIGN_ON'
};