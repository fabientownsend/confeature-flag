interface FeatureFlagsConfiguration {
  [featureName: string]: SingleFeatureFlag;
}
interface SingleFeatureFlag {
  release_for: string[];
}

type FnUsingInitialContext = () => boolean;
type FnUsingNewContext = (context?: string) => boolean;
type FunctionsGenerated = FnUsingInitialContext | FnUsingNewContext;
interface ConfeatureFlags {
  [fn: string]: FunctionsGenerated;
}

function isString(s: unknown): s is string {
  return typeof s === "string";
}

function buildFunctionName(featureName: string): string {
  const functionName = ["is"];
  for (const e of featureName.split("_")) {
    const [firstLater, ...rest] = Array.from(e);
    functionName.push(firstLater.toUpperCase());
    functionName.push(rest.join(""));
  }
  functionName.push("Released");
  return functionName.join("");
}

function buildFunctionNameWithArgument(featureName: string): string {
  return buildFunctionName(featureName) + "For";
}

function configurationParser(
  configuration: unknown | FeatureFlagsConfiguration
): FeatureFlagsConfiguration {
  const flagsConfiguration = isString(configuration)
    ? JSON.parse(configuration)
    : configuration;

  for (const featureName of Object.keys(flagsConfiguration)) {
    if (!("release_for" in flagsConfiguration[featureName])) {
      throw new TypeError(`${featureName} is missing "release_for"`);
    }

    if (!Array.isArray(flagsConfiguration[featureName].release_for)) {
      throw new TypeError(
        `release_for in ${featureName} is expecting an array`
      );
    }
  }
  return flagsConfiguration as FeatureFlagsConfiguration;
}

export function newConfeatureFlag(
  flagsConfiguration: unknown | FeatureFlagsConfiguration,
  initialContext: string
): ConfeatureFlags {
  const confeatureFlags: ConfeatureFlags = {};
  const parsedFlagsConfiguration: FeatureFlagsConfiguration = configurationParser(
    flagsConfiguration
  );

  for (const featureName of Object.keys(parsedFlagsConfiguration)) {
    const withoutContext: string = buildFunctionName(featureName);
    confeatureFlags[withoutContext] = (): boolean => {
      return parsedFlagsConfiguration[featureName].release_for.includes(
        initialContext
      );
    };

    const contextExpected: string = buildFunctionNameWithArgument(featureName);
    confeatureFlags[contextExpected] = (newContest = ""): boolean => {
      return parsedFlagsConfiguration[featureName].release_for.includes(
        newContest
      );
    };
  }

  return confeatureFlags;
}
