import * as fs from "fs";
import path from "path";

const FOLDER_TO_COMPARE_1 = "D:/temp";
const FOLDER_TO_COMPARE_2 = "C:/temp";

function processFolder(folderDir) {
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

    const pathFile2 = itemPath.replace(
      FOLDER_TO_COMPARE_1,
      FOLDER_TO_COMPARE_2
    );

    if (!fs.existsSync(pathFile2)) {
      console.log("NOVO ARQUIVO:", pathFile2);

      const newDir = path.dirname(pathFile2);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
      }

      fs.copyFileSync(itemPath, pathFile2);
      return;
    }

    const statsFile1 = fs.statSync(itemPath);
    const statsFile2 = fs.statSync(pathFile2);
    const lastModifiedDate1 = new Date(statsFile1.mtime);
    const lastModifiedDate2 = new Date(statsFile2.mtime);
    lastModifiedDate1.setSeconds(0);
    lastModifiedDate2.setSeconds(0);

    if (lastModifiedDate1 > lastModifiedDate2) {
      console.log(
        "ARQUIVO MODIFICADO. Data Antiga: " +
          lastModifiedDate2.toLocaleString() +
          ", Nova data: " +
          lastModifiedDate1.toLocaleString()
      );

      const modifiedFilesFolder = `${FOLDER_TO_COMPARE_2}/ARQUIVOS_MODIFICADOS`;

      const newPath = `${modifiedFilesFolder}/${pathFile2
        .replace(FOLDER_TO_COMPARE_2, "")
        .replaceAll("/", "__.__")}`;

      if (!fs.existsSync(modifiedFilesFolder)) {
        fs.mkdirSync(modifiedFilesFolder);
      }

      fs.copyFileSync(itemPath, newPath);
    }

    console.log(
      "ARQUIVO ORIGINAL. Data Antiga: " +
        lastModifiedDate2.toLocaleString() +
        ", Nova data: " +
        lastModifiedDate1.toLocaleString()
    );
  });
}

function main() {
  processFolder(FOLDER_TO_COMPARE_1);
}

main();
