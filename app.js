const container = document.getElementById("root");

let ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWSURL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/$id.json";

const store = {
  currentPage: 1,
};

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const newsFeed = () => {
  const newsList = [];
  const newsFeed = getData(NEWSURL);
  newsList.push("<ul>");

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 메인 화면 리스트
    newsList.push(`
    <li>
      <a href = "#/show/${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
    `);
  }

  newsList.push("</ul>");
  newsList.push(`
    <div>
      <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
      <a href="#/page/${
        store.currentPage < newsFeed.length / 10 ? store.currentPage + 1 : store.currentPage
      }">다음 페이지</a>
    </div>

  `);
  container.innerHTML = newsList.join("");
};

const newsDetail = () => {
  const id = location.hash.substr(7); // location.hash -> #/show/28004707 | location.hash.substr(7) ->28004707
  const newsContent = getData(CONTENT_URL.replace("$id", id));
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div><a href="#/page/${store.currentPage}">목록으로</a></div>
  `;
};

const router = () => {
  const routePath = location.hash;
  if (routePath === "") {
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7)); // routePath -> #/page/2 | routePath.substr(7) -> 2
    newsFeed();
  } else {
    newsDetail();
  }
};

window.addEventListener("hashchange", router);

router();
