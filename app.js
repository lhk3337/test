const container = document.getElementById("root");
let ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWSURL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const newsFeed = getData(NEWSURL);
const ul = document.createElement("ul");

window.addEventListener("hashchange", () => {
  const id = location.hash.substr(1);

  const newsContent = getData(CONTENT_URL.replace("@id", id));
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div><a href="#">목록으로</a></div>
  `;
});


const newsList = [];
newsList.push('<ul>');

for (let i = 0; i < newsFeed.length; i++) {
  // 메인 화면 리스트
  newsList.push(`
  <li>
    <a href = "#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
    </a>
  </li>
  `)
}
newsList.push("</ul>")
container.innerHTML=newsList.join('');
