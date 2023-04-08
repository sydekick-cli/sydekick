import path from "path";
import fs from "fs/promises";
import { PackageJson } from "./ICommon";
import debugLog from "debug";

/**
 * Reads the contents of a package.json file and returns a PackageJson object.
 *
 * @param packageJsonPath - The path to the package.json file.
 * @returns A Promise that resolves to a PackageJson object or null if an error occurs.
 */
export async function readPackageJson(packageJsonPath: string): Promise<PackageJson | null> {
  const debug = debugLog("@sydekick/support/common/package:readPackageJson");
  debug(`Reading package.json from ${packageJsonPath}`);
  try {
    // Read the contents of the package.json file
    const fileContent = await fs.readFile(path.resolve(packageJsonPath), "utf-8");

    // Parse the contents and cast it to a PackageJson object
    const packageJson = JSON.parse(fileContent) as PackageJson;
    debug(`Read ${packageJsonPath}:`);
    debug(packageJson);
    return packageJson;
  } catch (error) {
    const errorMessage = `Error reading ${packageJsonPath}: ${
      error instanceof Error ? error.message : error
    }`;
    console.error(errorMessage);
    debug(errorMessage);

    return null;
  }
}

/**
 * Updates a package.json file with new content.
 *
 * @param packageJsonPath - The path to the package.json file.
 * @param updatedContent - The updated PackageJson object.
 * @returns A Promise that resolves to true if the update is successful, false otherwise.
 */
export async function writePackageJson(
  packageJsonPath: string,
  updatedContent: PackageJson
): Promise<boolean> {
  const debug = debugLog("@sydekick/support/common/package:writePackageJson");
  debug(`Updating package.json at ${packageJsonPath}`);

  // ensure package.json dependencies are sorted
  const sortedDependencies: Record<string, string> = {};
  Object.keys(updatedContent.dependencies || {})
    .sort()
    .forEach((key) => {
      sortedDependencies[key] = updatedContent.dependencies![key];
    });
  updatedContent.dependencies = sortedDependencies;
  try {
    // Stringify the updated content and write it to the package.json file
    await fs.writeFile(path.resolve(packageJsonPath), JSON.stringify(updatedContent, null, 2));
    debug(`Updated ${packageJsonPath}:`);
    debug(updatedContent);
    return true;
  } catch (error) {
    const errorMessage = `Error updating package.json: ${
      error instanceof Error ? error.message : error
    }`;
    console.error(errorMessage);
    debug(errorMessage);

    return false;
  }
}
