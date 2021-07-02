const container = document.getElementById("root");
let ajax = new XMLHttpRequest();
const content = document.createElement('div')
const NEWSURL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
ajax.open("GET", NEWSURL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement("ul");


window.addEventListener("hashchange", () => {
  const id = location.hash.substr(1);

  ajax.open("GET", CONTENT_URL.replace('@id', id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title;

  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  //   a.innerHTML = newsFeed[i].title + " (" + newsFeed[i].comments_count + ")";

  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;
  a.href = `#${newsFeed[i].id}`;

  li.appendChild(a);
  ul.appendChild(li);
}
container.appendChild(ul);
container.appendChild(content);
