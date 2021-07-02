let ajax = new XMLHttpRequest();
const NEWSURL = "https://api.hnpwa.com/v0/news/1.json";
ajax.open("GET", NEWSURL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

const ul = document.createElement("ul");

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  //   a.innerHTML = newsFeed[i].title + " (" + newsFeed[i].comments_count + ")";
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;
  a.href = newsFeed[i].url;

  li.appendChild(a);
  ul.appendChild(li);
}
document.getElementById("root").appendChild(ul);
