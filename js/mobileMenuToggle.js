const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");

/*
모바일 환경에서 menu, 이 menu는 이벤트 위임으로 최적화하면 불필요한 코드가 많은 함수입니다. 시간상 최적화하지 않고 넘깁니다.
*/
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("click", (event) => {
    if (event.target === menuButton) {
        if (mobileMenu.innerHTML === "") {
            mobileMenu.innerHTML = menu.innerHTML;
            const menuItems = mobileMenu.querySelectorAll("a");
            menuItems.forEach((item, index) => {
                item.classList.add(...mobileMenuStyle.split(" "));
                if (index == 0) {
                    item.classList.add("mt-1.5");
                }
                item.style.animation = `slideDown forwards ${index * 0.2}s`;
            });
        } else {
            mobileMenu.innerHTML = "";
        }
    } else if (event.target.parentNode === mobileMenu) {
        event.preventDefault();
        const target = event.target.innerText
        const folder = blogMenu.find(b => b.name.split('.')[0].toLowerCase() == target.toLowerCase())
        if (folder.type === "dir") {
            if (blogList.length === 0) {
                // 블로그 리스트 로딩
                initDataBlogList().then(() => {
                    renderBlogList(folder.children);
                });
            } else {
                renderBlogList(folder.children);
            }
            // console.log(origin)
            const url = new URL(origin);
            url.searchParams.set("menu", event.target.innerText);
            window.history.pushState({}, "", url);
            mobileMenu.innerHTML = "";
        } else {
            renderOtherContents(folder.name);
            mobileMenu.innerHTML = "";
        }
    } else {
        mobileMenu.innerHTML = "";
    }
});
