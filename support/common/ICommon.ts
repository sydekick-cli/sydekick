export interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: {
    url?: string;
    email?: string;
  };
  license?: string;
  author?:
    | {
        name?: string;
        email?: string;
        url?: string;
      }
    | string;
  contributors?: Array<
    | {
        name?: string;
        email?: string;
        url?: string;
      }
    | string
  >;
  files?: string[];
  main?: string;
  types?: string;
  browser?: string;
  bin?: { [key: string]: string } | string;
  man?: string[];
  directories?: {
    lib?: string;
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
    test?: string;
  };
  repository?:
    | {
        type?: string;
        url?: string;
        directory?: string;
      }
    | string;
  scripts?: { [key: string]: string };
  config?: { [key: string]: any };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  optionalDependencies?: { [key: string]: string };
  bundledDependencies?: string[];
  engines?: {
    node?: string;
    npm?: string;
    yarn?: string;
  };
  os?: string[];
  cpu?: string[];
  preferGlobal?: boolean;
  publishConfig?: {
    registry?: string;
    access?: "public" | "restricted";
    tag?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface TSConfigJson {
  compilerOptions: {
    target?: string;
    module?: string;
    lib?: string[];
    allowJs?: boolean;
    checkJs?: boolean;
    jsx?: string;
    declaration?: boolean;
    declarationMap?: boolean;
    sourceMap?: boolean;
    outFile?: string;
    outDir?: string;
    rootDir?: string;
    composite?: boolean;
    removeComments?: boolean;
    noEmit?: boolean;
    importHelpers?: boolean;
    downlevelIteration?: boolean;
    isolatedModules?: boolean;
    strict?: boolean;
    noImplicitAny?: boolean;
    strictNullChecks?: boolean;
    strictFunctionTypes?: boolean;
    strictBindCallApply?: boolean;
    strictPropertyInitialization?: boolean;
    noImplicitThis?: boolean;
    alwaysStrict?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noImplicitReturns?: boolean;
    noFallthroughCasesInSwitch?: boolean;
    moduleResolution?: string;
    baseUrl?: string;
    paths?: { [key: string]: string[] };
    rootDirs?: string[];
    typeRoots?: string[];
    types?: string[];
    allowSyntheticDefaultImports?: boolean;
    esModuleInterop?: boolean;
    preserveSymlinks?: boolean;
    allowUmdGlobalAccess?: boolean;
    forceConsistentCasingInFileNames?: boolean;
    incremental?: boolean;
    tsBuildInfoFile?: string;
    traceResolution?: boolean;
    listEmittedFiles?: boolean;
    listFiles?: boolean;
    disableSolutionSearching?: boolean;
    configFile?: string;
    noErrorTruncation?: boolean;
    noStrictGenericChecks?: boolean;
    useUnknownInCatchVariables?: boolean;
    plugins?: { name: string; [option: string]: any }[];
    enableIvy?: boolean;
  };
  files?: string[];
  include?: string[];
  exclude?: string[];
  extends?: string;
  references?: { path: string }[];
}

export interface TypeScriptProject {
  packageJsonPath: string;
  packageJsonRaw: string;
  packageJson: PackageJson;
  name: string;
  tsConfigPath: string;
  tsConfigRaw: string;
  tsconfig: TSConfigJson;
}
