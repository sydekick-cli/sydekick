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
    // ensure the package.json is targeting node16
    tsconfigProject.packageJson.engines = tsconfigProject.packageJson.engines || {};
    if (!tsconfigProject.packageJson.engines.node) {
      tsconfigProject.packageJson.engines.node = ">=16";
    }
    // ensure the package.json is of type module
    tsconfigProject.packageJson.type = tsconfigProject.packageJson.type || "module";
    // ensure the package.json has a main entry point
    tsconfigProject.packageJson.main = tsconfigProject.packageJson.main || "dist/index.js";
    // ensure the package.json has a types entry point
    tsconfigProject.packageJson.types = tsconfigProject.packageJson.types || "dist/index.d.ts";
    // ensure the homepage is set
    tsconfigProject.packageJson.homepage =
      tsconfigProject.packageJson.homepage || "https://github.com/feedmefries/sydekick";
    // ensure the repository is set
    tsconfigProject.packageJson.repository = tsconfigProject.packageJson.repository || {
      type: "git",
      url: "git+https://github.com/feedmefries/sydekick.git",
    };
    // ensure the bugs url is set
    tsconfigProject.packageJson.bugs = tsconfigProject.packageJson.bugs || {
      url: "https://github.com/feedmefries/sydekick/issues",
    };
    // ensure the license is set
    tsconfigProject.packageJson.license = tsconfigProject.packageJson.license || "MIT";
    // ensure the author is set
    tsconfigProject.packageJson.author =
      tsconfigProject.packageJson.author || "Seth Lessard <sethlessard@outlook.com>";
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
