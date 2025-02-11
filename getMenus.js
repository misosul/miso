const fs = require("fs");
const path = require("path");

function getFolderStructure(dirPath, parentPath) {
  const items = fs.readdirSync(dirPath);
  const structure = [];

  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const children = getFolderStructure(fullPath, item + "/"); // 재귀 호출

      structure.push({
        type: "dir",
        name: getName(item),
        priority: getProiority(item),
        children: children.sort(compareEntries), // 재귀적으로 정렬
        download_url: "/menu/" + item,
      });
    } else {
      structure.push({
        type: "file",
        name: getName(item, parentPath),
        priority: getProiority(item),
        download_url: parentPath
          ? "/menu/" + parentPath + item
          : "/menu/" + item,
        folder: parentPath,
      });
    }
  });

  // 현재 level에서도 priority 값 기준으로 정렬
  return structure.sort(compareEntries);
}

function getProiority(filename) {
  const regex = /^\[(.*?)\]_\[(.*?)\](?:_\[(.*?)\])?(?:_\[(.*?)\])?(?:\.md)?$/;
  const matches = filename.match(regex);
  return Number(matches[1] || "9999");
}

function getName(filename, parentPath) {
  if (parentPath) {
    const arr = filename.split("_");
    arr.slice(0, 1);

    return arr.join("_");
  } else {
    const regex =
      /^\[(.*?)\]_\[(.*?)\](?:_\[(.*?)\])?(?:_\[(.*?)\])?(?:\.md)?$/;

    const matches = filename.match(regex);
    return matches[0].includes(".md") ? matches[2] + ".md" : matches[2];
  }
}

function compareEntries(a, b) {
  if (a.priority !== b.priority) {
    return a.priority - b.priority; // priority 기준 정렬 (오름차순)
  }
  return a.name.localeCompare(b.name, "en"); // 이름 기준 정렬 (알파벳순 오름차순)
}

const folderPath = __dirname + "/menu"; // 현재 디렉토리
const folderStructure = getFolderStructure(folderPath);
const filePath = path.join(__dirname, "/data/local_blogMenu.json");

// JSON 데이터를 파일에 저장
fs.writeFile(
  filePath,
  JSON.stringify(folderStructure, null, 2),
  "utf8",
  (err) => {
    if (err) {
      console.error("파일 저장 중 오류 발생:", err);
    } else {
      console.log("JSON 데이터가 저장되었습니다:", filePath);
    }
  }
);
