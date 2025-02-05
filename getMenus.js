const fs = require('fs');
const path = require('path');

function getFolderStructure(dirPath, parentPath) {
  const items = fs.readdirSync(dirPath);
  const structure = [];

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      structure.push({
        type: 'dir',
        name: item,
        children: getFolderStructure(fullPath,item+'/'), // 재귀 호출
        download_url: '/menu/'+item

      });
    } else {
      structure.push({
        type: 'file',
        name: item,
        download_url: parentPath ? '/menu/' + parentPath + item : '/menu/' + item,
        folder : parentPath
      });
    }
  });

  return structure;
}

const folderPath = __dirname+'/menu'; // 현재 디렉토리
const folderStructure = getFolderStructure(folderPath);
console.log(JSON.stringify(folderStructure, null, 2));
const filePath = path.join(__dirname, '/data/local_blogMenu.json');

// JSON 데이터를 파일에 저장
fs.writeFile(filePath, JSON.stringify(folderStructure, null, 2), 'utf8', (err) => {
  if (err) {
    console.error('파일 저장 중 오류 발생:', err);
  } else {
    console.log('JSON 데이터가 저장되었습니다:', filePath);
  }
});