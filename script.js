const API_KEY="f9873291fc0a4a88b493edb6e9056e15";
const url="https://newsapi.org/v2/everything?q=";

window.addEventListener('load', ()=>fetchNews("news"));

function reload(){
    window.location.reload();
}

async function fetchNews (query)
{
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data=await res.json();
    bindData(data.articles);
}

const MAX_ARTICLES = 12;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    const noNewsMessage = document.getElementById('no-news-message');
    
    cardsContainer.innerHTML = '';

    const filteredArticles = articles.filter(article => article.urlToImage);

    shuffleArray(filteredArticles);

    const limitedArticles = filteredArticles.slice(0, MAX_ARTICLES);
        if (limitedArticles.length === 0) {
            noNewsMessage.style.display = 'block';
            return;
        } else {
            noNewsMessage.style.display = 'none';
        }

    limitedArticles.forEach(article => {
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}


function fillDataInCard(cardClone,article)
{
    const newsImg=cardClone.querySelector('#news-img');
    const newsTitle=cardClone.querySelector('#news-title');
    const newsSource=cardClone.querySelector('#news-source');
    const newsDesc=cardClone.querySelector('#news-desc');

    newsImg.src=article.urlToImage;
    newsTitle.innerHTML=article.title;
    newsDesc.innerHTML=article.description;

    const  date=new Date(article.publishedAt).toLocaleString("en-US",{
        timeZone:"Asia/Jakarta"
    });

    newsSource.innerHTML=`${article.source.name}·${date}`;

    cardClone.firstElementChild.addEventListener('click',()=>{
        window.open(article.url ,"_blank");
    });
}

let curSelectedNav=null;
function onNavItemClick(id){
        fetchNews(id);
        const navItem=document.getElementById(id);
        if (curSelectedNav) curSelectedNav.classList.remove('active');
        curSelectedNav=navItem;
        curSelectedNav.classList.add('active');
}

const searchButton=document.getElementById('search-button');
const searchText=document.getElementById('search-text');
searchButton.addEventListener('click',()=>{
    const query=searchText.value;
    if(!query) return;
    fetchNews(query);
     if (curSelectedNav) curSelectedNav.classList.remove('active');
      curSelectedNav=null;
})

searchText.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        const query = searchText.value.trim();
        if (!query) return;
        fetchNews(query);
        if (curSelectedNav) curSelectedNav.classList.remove('active');
        curSelectedNav = null;
    }
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
