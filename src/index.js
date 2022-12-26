import * as fs from "fs";
import * as os from "os";

const FOLDER_TO_COMPARE_1 = "C:/temp";
const FOLDER_TO_COMPARE_2 = "D:/temp";

const RESULT_FILE = `${os.homedir()}\\ARQUIVOS_NAO_COPIADOS_${getCurrentDateTimeStr()}.txt`;

function processFolder(folderDir) {
  var list = [];
  list = fs.readdirSync(folderDir);
  list.forEach((item) => {
    const itemPath = `${folderDir}/${item}`;

    console.log("\n");
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
      console.log("ARQUIVO NÃO ENCONTRADO:", pathFile2);

      fs.appendFileSync(RESULT_FILE, `${pathFile2}${os.EOL}`);
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
