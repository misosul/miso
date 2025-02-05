/** 
 * 1. 네비게이션바 만들기
 *      1. 메뉴바 가져오기
 *      2. 파일구조 딕렉토리 만들기
 *      3. 네비게이션바 완성
 * 2. index.html에 네비게이션바 적용
 * 3. 디렉토리 구조에 맞게 md파일 html로 변환
 * 4. dist에 저장
 */


const fs = require('fs');
const path = require('path');

const currentDir = __dirname+"/menu";
try {
    const files = fs.readdirSync(currentDir);
    console.log('File list:', files);

    // 파일 경로 포함 출력
    const filePaths = files.map(file => path.join(currentDir, file).replace(currentDir+'/',''));
    console.log('File paths:', filePaths);
} catch (err) {
    console.error('Error reading directory:', err);
}


async function renderMenu() {
  /* 
    1. 메인페이지 메뉴 생성 및 메뉴클릭 이벤트 정의
    2. 검색창과 검색 이벤트 정의(검색이 메뉴에 있으므로) - 함수가 커지면 별도 파일로 분리 필요
    */
  blogMenu.forEach((menu) => {
    // 메뉴 링크 생성
    const link = document.createElement("a");

    // (static) index.html: <div id="contents" class="mt-6 grid-cols-3"></div>
    link.classList.add(...menuListStyle.split(" "));
    link.classList.add(`${menu.name}`);

    link.href = menu.download_url;
    // 확장자를 제외하고 이름만 innerText로 사용
    const menuName = menu.name.split(".")[0];
    link.innerText = menuName;

    link.onclick = (event) => {
      // 메뉴 링크 클릭 시 이벤트 중지 후 menu 내용을 읽어와 contents 영역에 렌더링
      event.preventDefault();

      if (menu.name === "projects.md") {
        if (blogList.length === 0) {
          // 블로그 리스트 로딩
          initDataBlogList().then(() => {
            renderBlogList();
          });
        } else {
          renderBlogList();
        }
        const url = new URL(origin);
        url.searchParams.set("menu", menu.name);
        window.history.pushState({}, "", url);
      } else {
        renderOtherContents(menu);
      }
    };
    document.getElementById("menu").appendChild(link);
  });

  if (snsList.length > 0) { 
    const br = document.createElement("hr");

    document.getElementById("menu").appendChild(br);

  }
  snsList.forEach((sns, index) => {
    const link = document.createElement("a");
    link.classList.add(...menuListStyle.split(" "));

    link.target = "_blank";
    link.href = sns.link;
    link.innerText = sns.text
    document.getElementById("menu").appendChild(link);
    
  })



  // 검색 버튼 클릭 시 검색창 출력
  const searchButton = document.getElementById("search-button");
  const searchCont = document.querySelector(".search-cont");

  let searchInputShow = false;

  window.addEventListener("click", (event) => {
    // 화면의 크기가 md 보다 작을 때만 동작
    if (window.innerWidth <= 768) {
      if (event.target == searchButton) {
        searchInputShow = !searchInputShow;
        if (searchInputShow) {
          searchButton.classList.add("active");
          searchCont.classList.remove("hidden");
          searchCont.classList.add("block");
        } else {
          searchButton.classList.remove("active");
          searchCont.classList.add("hidden");
          searchInputShow = false;
        }
      } else if (event.target == searchCont) {
      } else {
        searchButton.classList.remove("active");
        searchCont.classList.add("hidden");
        searchInputShow = false;
      }
    }
  });

  window.addEventListener("resize", (event) => {
    if (window.innerWidth > 768) {
      searchButton.classList.add("active");
      searchCont.classList.remove("hidden");
      searchInputShow = true;
    } else {
      searchButton.classList.remove("active");
      searchCont.classList.add("hidden");
    }
  });

  const searchInput = document.getElementById("search-input");
  searchInput.onkeyup = (event) => {
    if (event.key === "Enter") {
      // 엔터키 입력 시 검색 실행
      search();
    }
  };

  searchInput.onclick = (event) => {
    event.stopPropagation();
  };

  const searchInputButton = document.querySelector(".search-inp-btn");
  searchInputButton.onclick = (event) => {
    event.stopPropagation();
    search();
  };

  const resetInputButton = document.querySelector(".reset-inp-btn");
  searchInput.addEventListener("input", () => {
    // 초기화 버튼 보이기
    if (searchInput.value) {
      resetInputButton.classList.remove("hidden");
    } else {
      resetInputButton.classList.add("hidden");
    }
  });
  resetInputButton.addEventListener("click", (event) => {
    event.stopPropagation();
    searchInput.value = "";
    resetInputButton.classList.add("hidden");
  });
}




// 재귀적으로 디렉토리를 탐색하는 함수
// function getFilesRecursivelySync(dir) {
//     let results = [];

//     // 현재 디렉토리의 파일 및 폴더 읽기
//     const entries = fs.readdirSync(dir, { withFileTypes: true });

//     for (const entry of entries) {
//         const fullPath = path.join(dir, entry.name);

//         if (entry.isDirectory()) {
//             // 디렉토리라면 재귀적으로 탐색
//             const subDirFiles = getFilesRecursivelySync(fullPath);
//             console.log('subDirFiles :>> ', subDirFiles, results);
//             results = results.concat(subDirFiles);
//         } else {
//             // 파일이라면 결과에 추가
//             results.push(fullPath);
//         }
//     }

//     return results;
// }

// function arrayToDirectory(arr) {
//     const result = {};

//     arr.forEach((path) => {
//         const parts = path.split("/"); // 경로를 '/'로 분리
//         let current = result;

//         parts.forEach((part, index) => {
//             if (index === parts.length - 1) {
//                 // 마지막 요소는 파일 이름으로 저장
//                 current[part] = part;
//             } else {
//                 // 중간 요소는 디렉토리 객체로 저장
//                 if (!current[part]) {
//                     current[part] = {};
//                 }
//                 current = current[part];
//             }
//         });
//     });

//     return result;
// }


// // 실행
// // 현재 디렉토리의 경로
// const startDir = __dirname+'/menu'; // 시작 디렉토리
// try {
//     const files = getFilesRecursivelySync(startDir, startDir).map(d => d.replace(startDir+'/', ""));
//     const directory = arrayToDirectory(files)
//     console.log('All Files and Directories:', directory);

//     Object.keys(directory).map(d => d)
// } catch (err) {
//     console.error('Error reading directories:', err);
// }
