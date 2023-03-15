const changeLink = (clickedElement) => {
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');
};

const changePost = (postID) => {
    const activeArticles = document.querySelectorAll('.post.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    document.getElementById(postID).classList.add('active');;
};

const titleClickHandler = function(event) {
    event.preventDefault();
    changeLink(this);
    changePost(this.getAttribute("href").slice(1));
  }

const links = document.querySelectorAll('.titles a');

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}