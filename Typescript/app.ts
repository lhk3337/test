type Store = {
  currentPage: number;
  feeds: NewsFeed[];
};

type NewsFeed = {
  id: number;
  title: string;
  comments_count: string;
  read?: boolean;
  user: string;
  points: number;
  time_ago: string;
};

const container: HTMLElement | null = document.getElementById("root");
let ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/$id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const makeFeeds = (feeds) => {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }
  return feeds;
};

const updateView = (html: string) => {
  if (container != null) {
    container.innerHTML = html;
  } else {
    console.error("최상위 데이터가 없어 UI를 진행하지 못합니다.");
  }
};

const newsFeed = () => {
  const newsList = [];
  let newsFeed: NewsFeed[] = store.feeds;
  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(getData(NEWS_URL));
  }
  let templete = `
    <div class="bg-gray-600 min-h-screen ">
      <div class="bg-white text-xl sticky top-0 w-full">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6 ">
            <div class="flex justify-start">
              <a href="#/page/1"><h1 class="font-extrabold">Hacker News</h1></a>
            </div>
            <div class="items-center justify-end">
              <a class="text-gray-500 " href="#/page/{{__prev_page__}}">Previous</a>
              <a class="text-gray-500 ml-4" href="#/page/{{__next_page__}}">Next</a>        
            </div>
          </div>
        </div>
      </div>
      <div class="pt-0 p-4 text-2xl text-gray-700">
        {{__news_feed__}}
      <div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 메인 화면 리스트
    newsList.push(`
      <div class="p-6 ${
        newsFeed[i].read ? "bg-yellow-100" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href = "#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="fas fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>
        </div>
      </div>
    `);
  }

  templete = templete.replace("{{__news_feed__}}", newsList.join(""));
  templete = templete.replace("{{__prev_page__}}", store.currentPage > 1 ? store.currentPage - 1 : 1);
  templete = templete.replace(
    "{{__next_page__}}",
    store.currentPage < newsFeed.length / 10 ? store.currentPage + 1 : store.currentPage
  );

  updateView(templete);
};

const newsDetail = () => {
  const id = location.hash.substr(7); // location.hash -> #/show/28004707 | location.hash.substr(7) ->28004707
  const newsContent = getData(CONTENT_URL.replace("$id", id));
  let templete = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">${newsContent.content}</div>
        {{__comments__}} 
      </div>
    </div>
  `;

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  const makeComment = (comments, called = 0) => {
    const commentString = [];
    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left:${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>
      `);

      if (comments[i]) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }
    return commentString.join("");
  };
  updateView(templete.replace("{{__comments__}}", makeComment(newsContent.comments)));
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
