import * as fs from "fs";
import * as path from "path";

const ensureVersions = async () => {
  const lernaJSONPath = path.resolve(process.cwd(), "lerna.json");
  const packagesDir = path.resolve(process.cwd(), "packages");

  if (!fs.existsSync(lernaJSONPath) || !fs.existsSync(packagesDir)) {
    console.error("Missing lerna.json or packages/ directory");
    process.exit(1);
  }

  const lernaJSON = JSON.parse(fs.readFileSync(lernaJSONPath, "utf-8"));
  const lernaVersion = lernaJSON.version;

  const packageDirs = fs.readdirSync(packagesDir).filter((file) => {
    return fs.statSync(path.join(packagesDir, file)).isDirectory();
  });

  packageDirs.forEach((packageDir) => {
    const packageJSONPath = path.join(packagesDir, packageDir, "package.json");
    const packageLockJSONPath = path.join(packagesDir, packageDir, "package-lock.json");

    if (fs.existsSync(packageJSONPath) && fs.existsSync(packageLockJSONPath)) {
      const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
      const packageLockJSON = JSON.parse(fs.readFileSync(packageLockJSONPath, "utf-8"));

      if (packageJSON.version !== lernaVersion || packageLockJSON.version !== lernaVersion) {
        console.error(
          `Version mismatch in ${packageDir}:\n - package.json: ${packageJSON.version}\n - package-lock.json: ${packageLockJSON.version}\n - lerna.json: ${lernaVersion}`
        );
        process.exit(1);
      }
    } else {
      console.error(`Missing package.json or package-lock.json in ${packageDir}`);
      process.exit(1);
    }
  });

  console.log("All package versions match the lerna.json version");
};

ensureVersions();
