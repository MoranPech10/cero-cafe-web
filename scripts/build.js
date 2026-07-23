"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.resolve(projectRoot, "dist");

if (path.dirname(outputRoot) !== projectRoot || path.basename(outputRoot) !== "dist") {
  throw new Error("La carpeta de salida no es segura.");
}

const publicEntries = [
  "index.html",
  "productos.html",
  "css",
  "js",
  "data",
  "assets",
];

for (const relativePath of publicEntries) {
  const sourcePath = path.resolve(projectRoot, relativePath);

  if (!sourcePath.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(sourcePath)) {
    throw new Error(`Falta un recurso público requerido: ${relativePath}`);
  }
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

for (const relativePath of publicEntries) {
  const sourcePath = path.resolve(projectRoot, relativePath);
  const destinationPath = path.resolve(outputRoot, relativePath);

  if (!destinationPath.startsWith(`${outputRoot}${path.sep}`)) {
    throw new Error(`Ruta de salida inválida: ${relativePath}`);
  }

  fs.cpSync(sourcePath, destinationPath, { recursive: true });
}

function inventoryFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? inventoryFiles(entryPath) : [entryPath];
  });
}

const outputFiles = inventoryFiles(outputRoot);
const totalBytes = outputFiles.reduce((total, filePath) => total + fs.statSync(filePath).size, 0);

console.log(
  `Sitio generado en dist: ${outputFiles.length} archivos, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB.`,
);
