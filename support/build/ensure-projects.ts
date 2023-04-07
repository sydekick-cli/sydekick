import debugLog from "debug";
import path from "path";
import {
  ensureBaseTSConfigHasReferenceToThisProject,
  ensureTSConfigExtendsRootBaseTSConfig,
  loadAllTSConfigProjectsInPackagesDirectory,
  loadTypeScriptProject,
  saveTypeScriptProject,
  validateSydekickImports,
} from "../common/typescript";
import { TypeScriptProject } from "../common/ICommon";

const debug = debugLog("@sydekick/support/build:ensure-projects");
const rootDir = process.cwd();
const rootTsConfigPath = path.join(rootDir, "tsconfig.json");
const rootTsConfigBasePath = path.join(rootDir, "tsconfig.base.json");

void (async () => {
  // read tsconfig.json
  debug(`Loading root TypeScript project from ${rootTsConfigPath}`);
  const rootTsconfigProject = await loadTypeScriptProject(rootTsConfigPath);
  // find all tsconfig.json files in packages/
  const tsconfigProjects = await loadAllTSConfigProjectsInPackagesDirectory();
  const typescriptProjectMap: Record<string, TypeScriptProject> = {};
  for (const tsconfigProject of tsconfigProjects) {
    typescriptProjectMap[tsconfigProject.name] = tsconfigProject;
  }

  // check if reference already exists in root tsconfig.json
  for (const tsconfigProject of tsconfigProjects) {
    debug(
      `Processing ${tsconfigProject.name} (tsconfig.json: ${tsconfigProject.tsConfigPath}, package.json: ${tsconfigProject.packageJsonPath})`
    );
    ensureBaseTSConfigHasReferenceToThisProject(tsconfigProject, rootTsconfigProject);
    // ensure tsconfig.json extends tsconfig.base.json
    ensureTSConfigExtendsRootBaseTSConfig(tsconfigProject, rootTsConfigBasePath);
    // ensure that the package.json has all necessary @sydekick/* dependencies
    await validateSydekickImports(tsconfigProject, typescriptProjectMap);
    // write tsconfig and package.json
    await saveTypeScriptProject(tsconfigProject);
  }

  // Write updated root tsconfig.json
  await saveTypeScriptProject(rootTsconfigProject);
})();
