import * as fs from "fs";
import * as os from "os";
import path from "path";

const FOLDER_TO_COMPARE_1 = "C:/temp";
const FOLDER_TO_COMPARE_2 = "D:/temp";

const RESULT_FILE = `${os.homedir()}\\ARQUIVOS_NAO_COPIADOS_${getCurrentDateTimeStr()}.txt`;
const RESULT_FILE_COMMANDS = `${os.homedir()}\\ARQUIVOS_NAO_COPIADOS_${getCurrentDateTimeStr()}_COMANDOS.txt`;

function processFolder(folderDir) {
  var list = [];
  list = fs.readdirSync(folderDir);
  list.forEach((item) => {
    const itemPath = `${folderDir}/${item}`;

    console.log("\n");
    console.log("Processando item:", itemPath);

    const exists = fs.existsSync(itemPath);

    if (!exists) {
      console.log("ARQUIVO OU PASTA NÃO ENCONTRADO(A).");
      fs.appendFileSync(RESULT_FILE, `${itemPath}${os.EOL}`);

      const dirName = path.dirname(itemPath);
      const fileName = path.basename(itemPath);

      fs.appendFileSync(
        RESULT_FILE_COMMANDS,
        `robocopy "${dirName}" "${dirName.replace(
          FOLDER_TO_COMPARE_1,
          FOLDER_TO_COMPARE_2
        )}" "${fileName}"${os.EOL}`
      );
      return;
    }

    const isDirectory = fs.lstatSync(itemPath).isDirectory();

    if (isDirectory) {
      console.log("O item é uma pasta.");
      processFolder(itemPath);
      return;
    }

    const pathFile2 = itemPath.replace(
      FOLDER_TO_COMPARE_1,
      FOLDER_TO_COMPARE_2
    );

    if (!fs.existsSync(pathFile2)) {
      console.log("ARQUIVO NÃO ENCONTRADO:", pathFile2);

      fs.appendFileSync(RESULT_FILE, `${itemPath}${os.EOL}`);

      const dirName = path.dirname(itemPath);
      const fileName = path.basename(itemPath);

      fs.appendFileSync(
        RESULT_FILE_COMMANDS,
        `robocopy "${dirName}" "${dirName.replace(
          FOLDER_TO_COMPARE_1,
          FOLDER_TO_COMPARE_2
        )}" "${fileName}"${os.EOL}`
      );
      return;
    }
  });
}

function getCurrentDateTimeStr() {
  const now = new Date();

  const day = String(now.getDay()).padStart(2, "0");
  const month = String(now.getMonth()).padStart(2, "0");
  const year = String(now.getFullYear()).padStart(4, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year}_${hour}-${minutes}-${seconds}`;
}

function main() {
  processFolder(FOLDER_TO_COMPARE_1);
}

main();
