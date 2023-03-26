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

  const optAuthorWrapper = '.post-author',
    optAuthorSelector = 'data-author',
    optAuthorsSidebarSelector = '.sidebar .authors';

  const optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optCloudElementSelector = '.sidebar .tags';

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

  const generateTitleLinks = (customSelector = '') => {
    let localArticles;

    if (customSelector) {
      localArticles = document.querySelectorAll(optArticleSelector + customSelector);
    } else {
      localArticles = articles;
    }

    const linksListElement = document.querySelector(optTitleListSelector);
    let linksList = '';

    linksListElement.innerHTML = '';

    for (let article of localArticles) {
      linksList = linksList +
        `<li>
          <a href="#${article.getAttribute('id')}">
            <span>${article.querySelector(optTitleSelector).innerHTML}</span>
          </a>
        </li>`;
    }

    linksListElement.innerHTML = linksList;
    addClickListnersToPosts();
    changePost(localArticles[0].getAttribute('id'));
  };

  const calculateTagsParams = (tags) => {
    const counts = [];

    for (let tag in tags) {
      counts.push(tags[tag]);
    }

    return({
      min: Math.min(...counts),
      max: Math.max(...counts)
    });
  };

  const calculateTagClass = (count, params) => {
    const tagNum = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1 );
    return `${optCloudClassPrefix}${tagNum}`;
  };

  const generateTags = () => {
    const allTags = {};
    let tagsCloudHtml = '';

    for (let article of articles) {
      const tagsWrapper = article.querySelector(optPostTagsWrapper);

      let tagsList = '';
      const tags = article.getAttribute(optPostTagsSelector).split(' ');

      for (let tag of tags) {
        if(!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        tagsList +=
          `<li>
            <a href="#tag-${tag}">${tag}</a>
          </li>`;
      }

      tagsWrapper.innerHTML = tagsList;
    }

    const tagParams = calculateTagsParams(allTags);

    for (let tag in allTags) {
      tagsCloudHtml +=
        `<li>
          <a class="${calculateTagClass(allTags[tag], tagParams)}" href="#tag-${tag}">${tag}</a>
        </li>`;
    }

    document.querySelector(optCloudElementSelector).innerHTML = tagsCloudHtml;

  };

  const generateAuthors = () => {
    const allAuthors = {};
    let authorsLinksHtml = '';

    for (let article of articles) {
      let author = article.getAttribute(optAuthorSelector);

      if(!allAuthors[author]) {
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }

      article.querySelector(optAuthorWrapper).innerHTML =
        `<a href="#author-${author.replace(' ', '-')}">
          by ${author}
        </a>`;
    }

    for (let author in allAuthors) {
      authorsLinksHtml +=
      `<li>
        <a href="#author-${author.replace(' ', '-')}">
          <span class="author-name">${author} (${allAuthors[author]})</span>
        </a>
      </li>`;
    }

    document.querySelector(optAuthorsSidebarSelector).innerHTML = authorsLinksHtml;
  };

  const unactiveTagLinks = () => {
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    for (let activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');
    }
  };

  const unactiveAuthorLinks = () => {
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    changeLink(this);
    changePost(this.getAttribute('href').slice(1));
  };

  const tagClickHandler = (event) => {
    event.preventDefault();

    const href = event.target.getAttribute('href');
    const tag = href.replace('#tag-', '');

    const actualTagLinks = document.querySelectorAll(`a[href="${href}"]`);

    unactiveTagLinks();

    for (let actualTagLink of actualTagLinks) {
      actualTagLink.classList.add('active');
    }

    generateTitleLinks(`[data-tags~="${tag}"]`);
  };

  const authorClickHandler = (event) => {
    event.preventDefault();
    unactiveAuthorLinks();

    let authorLink;

    if(event.target.tagName == 'A') {
      authorLink = event.target;
    } else {
      authorLink = event.target.parentNode;
    }

    const actualAuthorLinks = document.querySelectorAll(`a[href="${authorLink.getAttribute('href')}"]`);
    let actualAuthor = '';

    for (let actualAuthorLink of actualAuthorLinks) {
      actualAuthorLink.classList.add('active');
    }

    actualAuthor = authorLink.getAttribute('href').replace('#author-', '').replace('-', ' ');

    generateTitleLinks(`[data-author="${actualAuthor}"]`);
  };

  const allPostsClickHandler = (event) => {
    event.preventDefault();
    unactiveTagLinks();
    unactiveAuthorLinks();
    generateTitleLinks();
  };

  const addClickListnersToPosts = () => {
    const links = document.querySelectorAll(optLinksClass);
    links[0].classList.add(optActiveClass);

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };

  const addClickListenersToTags = () => {
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    const allPostsLink = document.querySelector('#all-posts');

    for (let tagLink of tagLinks) {
      tagLink.addEventListener('click', tagClickHandler);
    }

    allPostsLink.addEventListener('click', allPostsClickHandler);
  };

  const addClickListenersToAuthors = () => {
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');

    for (let authorLink of authorLinks) {
      authorLink.addEventListener('click', authorClickHandler);
    }
  };

  const articles = document.querySelectorAll(optArticleSelector);

  generateTags();
  generateAuthors();
  generateTitleLinks();
  addClickListenersToTags();
  addClickListenersToAuthors();
}
