'use strict';
{
  const optActiveClass = 'active',
    optLinksClass = '.titles a',
    optActiveLinksClass = '.titles a.active',
    optPostClass = '.post.active';

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';

  const optPostTagsWrapper = '.post-tags .list',
    optPostTagsSelector = 'data-tags';

  const changeLink = (clickedElement) => {
    const activeLinks = document.querySelectorAll(optActiveLinksClass);

    for (let activeLink of activeLinks) {
      activeLink.classList.remove(optActiveClass);
    }

    clickedElement.classList.add(optActiveClass);
  };

  const changePost = (postID) => {
    const activeArticles = document.querySelectorAll(optPostClass);

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove(optActiveClass);
    }

    document.getElementById(postID).classList.add(optActiveClass);
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    changeLink(this);
    changePost(this.getAttribute('href').slice(1));
  };

  const generateTitleLinks = () => {
    const linksListElement = document.querySelector(optTitleListSelector);
    let linksList = '';

    linksListElement.innerHTML = '';

    for (let article of articles) {
      linksList = linksList +
        `<li>
          <a href="#${article.getAttribute('id')}">
            <span>${article.querySelector(optTitleSelector).innerHTML}</span>
          </a>
        </li>`;
    }

    linksListElement.innerHTML = linksList;
  };

  const generateTags = () => {
    for (let article of articles) {
      const tagsWrapper = article.querySelector(optPostTagsWrapper);

      let tagsList = '';
      const tags = article.getAttribute(optPostTagsSelector).split(' ');

      for (let tag of tags) {
        tagsList = `${tagsList}
          <li>
            <a href="#tag-${tag}">${tag}</a>
          </li>`
      }

      tagsWrapper.innerHTML = tagsList;
    }
  }
  const articles = document.querySelectorAll(optArticleSelector);

  generateTags();

  generateTitleLinks();

  const links = document.querySelectorAll(optLinksClass);
  links[0].classList.add(optActiveClass);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}