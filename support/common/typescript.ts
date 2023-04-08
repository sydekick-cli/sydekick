import debugLog from "debug";
import fs from "fs/promises";
import path, { dirname, resolve } from "path";
import { PackageJson, TSConfigJson, TypeScriptProject } from "./ICommon";
import { writePackageJson } from "./package";
import glob from "glob";
import { Project, SyntaxKind } from "ts-morph";

// todo: will also have to add a layer to this to ensure that all versions of @sydekick/* are the same
/**
 * Validates if any source file within the project contains an import path that
 * starts with "@sydekick/". If found, ensures that the corresponding package
 * "@sydekick/_" is also included within the package.json file.
 *
 * @param project - The TypeScriptProject object to validate.
 * @param otherProjects - A map of all other TypeScriptProject objects where the key is the name of the npm package.
 * @returns A Promise that resolves when the validation is complete.
 * @throws An error if an import path is not included in the package.json file.
 */
export async function validateSydekickImports(
  project: TypeScriptProject,
  otherProjects: Record<string, TypeScriptProject>
): Promise<void> {
  const debug = debugLog("@sydekick/support/common/typescript:validateSydekickImports");
  debug(`Validating Sydekick imports for ${project.name}`);
  const tsconfigRootDir = project.tsconfig.compilerOptions?.rootDir || ".";
  const projectRootDir = dirname(project.packageJsonPath);
  debug(`Project root directory: ${projectRootDir}`);
  debug(`tsconfig.json rootDir: ${tsconfigRootDir}`);
  const resolvedTsconfigRootDir = path.resolve(projectRootDir, tsconfigRootDir);
  debug(`Resolved tsconfig.json rootDir: ${resolvedTsconfigRootDir}`);
  const requiredPrefix = "@sydekick/";

  // Create a ts-morph project and add the TypeScript source files
  const tsMorphProject = new Project({
    tsConfigFilePath: project.tsConfigPath,
  });
  tsMorphProject.addSourceFilesAtPaths(`${resolvedTsconfigRootDir}/**/*.ts`);
  debug(`Found ${tsMorphProject.getSourceFiles().length} source files`);

  // Iterate over each source file and search for import declarations
  const importPaths: { importPath: string; file: string; lineno: number }[] = [];
  for (const sourceFile of tsMorphProject.getSourceFiles()) {
    debug(`Processing source file: ${sourceFile.getFilePath()}`);
    for (const importDeclaration of sourceFile.getImportDeclarations()) {
      const importPath = importDeclaration.getModuleSpecifierValue();
      if (importPath.startsWith(requiredPrefix)) {
        debug(`Found Sydekick import: ${importPath}`);
        importPaths.push({
          importPath,
          file: sourceFile.getFilePath(),
          lineno: importDeclaration.getStartLineNumber(),
        });
      }
    }
  }
  // parse package names from the import paths
  const packageNames = [
    ...new Set(
      importPaths
        .map(({ importPath, file, lineno }) => {
          const splitPath = importPath.split("/");
          if (splitPath.length !== 2) {
            console.error(
              `Invalid @sydekick import found! Import: '${importPath}' File: '${file}:${lineno}'`
            );
          }
          return `${splitPath[0]}/${splitPath[1]}`;
        })
        .filter((packageName) => packageName !== project.name)
    ),
  ];
  debug(`Found ${packageNames.length} required @sydekick packages: ${packageNames.join(", ")}`);

  const missingTsconfigReferences: { path: string }[] = [];
  const missingPackageJsonDependencies: { name: string; version: string }[] = [];
  for (const packageName of packageNames) {
    const otherProject = otherProjects[packageName];
    if (!otherProject) {
      throw new Error(`Unable to find project for package: ${packageName}`);
    }
    // check to see if the current project tsconfig.json references the other project
    const tsconfigReferencePathToOtherProject = path.relative(
      path.dirname(project.tsConfigPath),
      path.dirname(otherProject.tsConfigPath)
    );
    if (
      !project.tsconfig.references?.some(
        (ref) => resolve(ref.path) === resolve(tsconfigReferencePathToOtherProject)
      )
    ) {
      missingTsconfigReferences.push({ path: tsconfigReferencePathToOtherProject });
    }
    // check to see if the current project package.json has the other project as a dependency
    if (!project.packageJson.dependencies?.[packageName]) {
      missingPackageJsonDependencies.push({
        name: packageName,
        version: otherProject.packageJson.version,
      });
    }
  }

  // add missing references to the current project tsconfig.json
  if (missingTsconfigReferences.length > 0) {
    debug(`Adding ${missingTsconfigReferences.length} missing tsconfig.json references`);
    project.tsconfig.references = [
      ...(project.tsconfig.references || []),
      ...missingTsconfigReferences,
    ];
    debug(`New tsconfig.json references: ${JSON.stringify(project.tsconfig.references)}`);
  } else {
    console.log(`${project.name} has all required tsconfig.json references.`);
  }
  // add missing dependencies to the current project package.json
  if (missingPackageJsonDependencies.length > 0) {
    debug(`Adding ${missingPackageJsonDependencies.length} missing package.json dependencies`);
    for (const { name, version } of missingPackageJsonDependencies) {
      console.log(`Adding dependency: ${name}@${version}`);
      project.packageJson.dependencies![name] = version;
    }
  } else {
    console.log(`${project.name} has all required dependencies.`);
  }
}

/**
 * Saves a TypeScript project to disk.
 *
 * @param project - The TypeScriptProject object to save.
 * @returns A Promise that resolves to true if the project is saved successfully, false otherwise.
 */
export async function saveTypeScriptProject(project: TypeScriptProject): Promise<boolean> {
  const debug = debugLog("@sydekick/support/common/typescript:saveTypeScriptProject");
  debug("Saving TypeScript project:", project);
  try {
    // Write the updated package.json file
    writePackageJson(project.packageJsonPath, project.packageJson);

    // ensure references are unique
    project.tsconfig.references = project.tsconfig.references?.filter(
      (ref, index, self) => self.findIndex((r) => r.path === ref.path) === index
    );
    // Write the updated tsconfig.json file
    const tsconfigRaw = JSON.stringify(project.tsconfig, null, 2);
    debug(`Writing ${project.tsConfigPath}:`);
    debug(tsconfigRaw);
    await fs.writeFile(project.tsConfigPath, tsconfigRaw, "utf-8");

    return true;
  } catch (error) {
    console.error(
      `Error saving TypeScript project: ${error instanceof Error ? error.message : error}`
    );
    return false;
  }
}

/**
 * Loads a TypeScript project given a path to a tsconfig.json file.
 *
 * @param tsConfigPath - The path to the tsconfig.json file.
 * @returns A Promise that resolves to a TypeScriptProject object.
 */
export async function loadTypeScriptProject(tsConfigPath: string): Promise<TypeScriptProject> {
  // Create a debug logger for this function
  const debug = debugLog("@sydekick/support/common/typescript:loadTypeScriptProject");

  debug(`Loading TypeScript project from ${tsConfigPath}`);

  // Get the directory of the tsconfig.json file
  const tsConfigDir = path.dirname(tsConfigPath);
  debug(`TypeScript project directory: ${tsConfigDir}`);

  // Get the path to the package.json file in the same directory as tsconfig.json
  const packageJsonPath = path.join(tsConfigDir, "package.json");
  debug(`package.json path: ${packageJsonPath}`);

  // Read the contents of the tsconfig.json and package.json files
  const [tsConfigRaw, packageJsonRaw] = await Promise.all([
    fs.readFile(tsConfigPath, "utf-8"),
    fs.readFile(packageJsonPath, "utf-8"),
  ]);
  debug(`Read tsconfig.json:`);
  debug(tsConfigRaw);
  debug(`Read package.json:`);
  debug(packageJsonRaw);

  // Parse the contents of both files
  const tsconfig = JSON.parse(tsConfigRaw) as TSConfigJson;
  const packageJson = JSON.parse(packageJsonRaw) as PackageJson;

  // Extract the name from the package.json object
  const name = packageJson.name;

  // Construct the TypeScriptProject object
  const typeScriptProject: TypeScriptProject = {
    packageJsonPath,
    packageJsonRaw,
    packageJson,
    name,
    tsConfigPath,
    tsConfigRaw,
    tsconfig,
  };
  debug(`Loaded TypeScript project:`);
  debug(typeScriptProject);

  return typeScriptProject;
}

/**
 * Asynchronously loads all TypeScript configuration (tsconfig.json) files found in the packages directory
 * and its subdirectories, excluding those within node_modules subdirectories.
 *
 * This function is useful for multi-package repositories that need to find and load all
 * TypeScript projects within a monorepo.
 *
 * @returns {Promise<Array<TypeScriptProject>>} A Promise that resolves to an array of TypeScript projects
 *                                              loaded from the tsconfig.json files.
 */
export async function loadAllTSConfigProjectsInPackagesDirectory() {
  // Initialize a debug log for this function
  const debug = debugLog(
    "@sydekick/support/common/typescript:loadAllTSConfigProjectsInPackagesDirectory"
  );

  // Log the start of the search process for tsconfig.json files
  debug("Searching for tsconfig.json files in packages/");

  // Find all tsconfig.json files in the packages directory and its subdirectories,
  // excluding those within node_modules subdirectories
  const tsconfigFiles = glob.sync("packages/**/tsconfig.json", {
    ignore: "packages/**/node_modules/**",
  });

  // Log the found tsconfig.json files
  debug(`Found tsconfig.json files:`);
  debug(JSON.stringify(tsconfigFiles, null, 2));

  // Load each tsconfig.json file as a TypeScript project
  const tsconfigProjects = await Promise.all(
    tsconfigFiles.map((tsconfigPath) => loadTypeScriptProject(tsconfigPath))
  );

  // Return the loaded TypeScript projects
  return tsconfigProjects;
}

/**
 * Ensures that the provided TypeScript project's tsconfig.json file extends the root base tsconfig.json file.
 * If it doesn't, this function updates the tsconfig.json's "extends" property with the root base tsconfig path.
 *
 * @param {TypeScriptProject} tsconfigProject - The TypeScript project to ensure the "extends" property for.
 * @param {string} rootTsConfigBasePath - The path to the root base tsconfig.json file.
 */
export function ensureTSConfigExtendsRootBaseTSConfig(
  tsconfigProject: TypeScriptProject,
  rootTsConfigBasePath: string
) {
  const debug = debugLog(
    "@sydekick/support/common/typescript:ensureTSConfigExtendsRootBaseTSConfig"
  );

  // Check if the project's tsconfig.json file extends the root base tsconfig.json file
  if (
    !tsconfigProject.tsconfig.extends ||
    tsconfigProject.tsconfig.extends !== rootTsConfigBasePath
  ) {
    debug(`Adding extends to ${tsconfigProject.tsConfigPath}: ${rootTsConfigBasePath}`);

    // Use a relative path to the root base tsconfig.json file and update the "extends" property
    tsconfigProject.tsconfig.extends = path.relative(
      path.dirname(tsconfigProject.tsConfigPath),
      rootTsConfigBasePath
    );
  }
}

/**
 * Ensures that the root base tsconfig.json file contains a reference to the provided TypeScript project.
 * If it doesn't, this function adds the reference to the "references" array in the root base tsconfig.json file.
 *
 * @param {TypeScriptProject} tsconfigProject - The TypeScript project to ensure the reference for.
 * @param {TypeScriptProject} rootTsconfigProject - The root TypeScript project with the base tsconfig.json file.
 */
export function ensureBaseTSConfigHasReferenceToThisProject(
  tsconfigProject: TypeScriptProject,
  rootTsconfigProject: TypeScriptProject
) {
  const debug = debugLog(
    "@sydekick/support/common/typescript:ensureBaseTSConfigHasReferenceToThisProject"
  );

  // Ensure the root base tsconfig.json file has a "references" array
  if (!rootTsconfigProject.tsconfig.references) {
    debug("Creating references array in root tsconfig.json");
    rootTsconfigProject.tsconfig.references = [];
  } else {
    debug("Root tsconfig.json already contains references array. Adding to it.");
  }

  // Calculate the relative path to the project's tsconfig.json file
  const rootDir = path.dirname(rootTsconfigProject.tsConfigPath);
  debug(`Root directory: ${rootDir}`);
  const referencePath = path.relative(rootDir, path.dirname(tsconfigProject.tsConfigPath));
  debug(`Checking if reference already exists in root tsconfig.json: ${referencePath}`);

  // Check if the reference already exists in the root base tsconfig.json file
  const referenceExists = tsconfigProject.tsconfig.references?.some(
    (ref: { path: string }) => ref.path === referencePath
  );

  // If the reference doesn't exist, add it to the "references" array
  if (!referenceExists) {
    debug(`Adding reference to root tsconfig.json: ${referencePath}`);
    rootTsconfigProject.tsconfig.references.push({ path: referencePath });
  }
}
