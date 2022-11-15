import * as fs from "fs";

function processFolder(folderDir) {
  folderDir = folderDir.replaceAll("\\", "/");
  if (!fs.existsSync(folderDir)) {
    console.log("A PASTA NÃO EXISTE: ", folderDir);
    return;
  }

  var list = [];
  list = fs.readdirSync(folderDir);
  list.forEach((item) => {
    const itemPath = `${folderDir}/${item}`;

    console.log("\n\n\n");
    console.log("Processando item:", itemPath);

    const isFile = fs.existsSync(itemPath) && fs.lstatSync(itemPath).isFile();

    if (!isFile) {
      console.log("O item é uma pasta.");
      processFolder(itemPath);
      return;
    }

    const newPath = itemPath
      .replace("ARQUIVOS_MODIFICADOS", "")
      .replaceAll("__.__", "/");

    fs.renameSync(itemPath, newPath);
  });
}

function main() {
  const folder = process.argv[2];

  processFolder(folder);
}

main();
