import "./styles.css";
import { formatDistanceToNowStrict } from "date-fns";

const debounce = (func, wait) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

function GithubSearch() {
  var API_PATH = "https://api.github.com/users/{userName}/repos";
  var REPOS = [
    {
      name: "snackbar",
      url: "https://abc.com",
      description: "tiny browser",
      language: "TypeScript",
      stargazers_count: 20,
      updated_at: 1626772852523
    },
    {
      name: "rollup-plugin",
      url: "https://abc.com",
      description: "tiny browser",
      language: "JavaScript",
      stargazers_count: 50,
      updated_at: 1626772812523
    },
    {
      name: "next-fullstack",
      url: "https://abc.com",
      description: "tiny browser",
      language: "JavaScript",
      stargazers_count: 10,
      updated_at: 1626762812523
    }
  ];
  var filteredRepos = [];
  var debounceOnChange = null;
  var searchInput;
  var selectedLanguage = "";
  var selectedSort = "";
  this.init = function () {
    searchInput = document.getElementById("repoSearchInput");
    var btnSearch = document.getElementById("btnSearch");
    btnSearch.addEventListener("click", this.onClick);
    var languageFilter = document.getElementById("languages");
    languageFilter.addEventListener("change", this.onLanguageChange);
    var sortFilter = document.getElementById("sorts");
    sortFilter.addEventListener("change", this.onSort);
    debounceOnChange = debounce(this.fetchData, 400);
    searchInput.addEventListener("change", this.onInputChange);
    filteredRepos = [...REPOS];
    this.showRepoList(filteredRepos);
  }.bind(this);

  this.onSort = function (evt) {
    var value = evt.target.value;
    selectedLanguage = value;
    if (!value) {
      filteredRepos = [...REPOS];
      return;
    }
    console.log(value);
    filteredRepos = REPOS.sort((a, b) => {
      return a[value] < b[value] ? -1 : 1;
    });
    console.log(filteredRepos);
    this.showRepoList(filteredRepos);
  }.bind(this);

  this.onLanguageChange = function (evt) {
    var value = evt.target.value;
    selectedSort = value;
    if (!value) {
      filteredRepos = [...REPOS];
      this.showRepoList(filteredRepos);
      return;
    }
    console.log(value);
    filteredRepos = REPOS.filter((repo) => repo.language === value);
    console.log(filteredRepos);
    this.showRepoList(filteredRepos);
  }.bind(this);

  this.onInputChange = function (evt) {
    const value = evt.target.value;
    console.log(debounceOnChange);
    debounceOnChange(value);
  };

  this.onClick = function (evt) {
    const value = searchInput.value;
    console.log(value);
    if (value) {
      this.fetchData(value);
    }
  }.bind(this);

  this.fetchData = function (value) {
    console.log(value);
    var url = API_PATH.replace("{userName}", value);
    console.log(url);
    fetch(url)
      .then(async (response) => {
        console.log("data", response);
        var data = await response.json();
        console.log("data", data);
        REPOS = [...data];
        filteredRepos = [...data];
        this.showRepoList(filteredRepos);
      })
      .catch((err) => {
        console.log(err);
      });
  }.bind(this);

  this.showRepoList = function (repos) {
    var repoList = document.getElementById("repolist");
    repoList.innerHTML = "";
    repos.map((repo) => {
      var li = document.createElement("li");
      li.classList = "item";
      var header = document.createElement("h4");
      header.classList = "title";
      var anchor = document.createElement("a");
      anchor.setAttribute("href", repo.url);
      anchor.setAttribute("target", "_blank");
      anchor.innerHTML = repo.name;
      header.appendChild(anchor);
      li.appendChild(header);
      var desc = document.createElement("div");
      desc.classList = "desc";
      desc.innerHTML = repo.description;
      li.appendChild(desc);
      var tagContainer = document.createElement("div");
      tagContainer.classList = "tagBox";
      var circleIcon = document.createElement("span");
      circleIcon.classList = "fa fa-circle checked";
      tagContainer.appendChild(circleIcon);
      var lang = document.createElement("span");
      lang.classList = "lang tag";
      lang.innerHTML = repo.language;
      tagContainer.appendChild(lang);
      var starsIcon = document.createElement("span");
      starsIcon.classList = "fa fa-star checked";
      tagContainer.appendChild(starsIcon);
      var stars = document.createElement("span");
      stars.classList = "stars tag";
      stars.innerHTML = repo.stargazers_count;
      tagContainer.appendChild(stars);
      var updatedAt = document.createElement("span");
      updatedAt.classList = "updatedAt tag";
      updatedAt.innerHTML = this.getTime(repo.updated_at);
      tagContainer.appendChild(updatedAt);
      li.appendChild(tagContainer);
      repoList.appendChild(li);
    });
  };

  this.getTime = function (timeStamp) {
    var date = new Date(timeStamp);
    return `${formatDistanceToNowStrict(date)} ago`;
  };
}

var githubSearch = new GithubSearch();
githubSearch.init();
