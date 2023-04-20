function addPressReleaseDate(main, doc) {
  const prHead = main.querySelector('div > div > h1');
  const prDate = doc.querySelector('meta[name="publish-date"]');
  // this should only fire on press-release pages
  if (window.location.href.indexOf('/news-and-stories/press-releases/') !== -1 && prHead && prDate) {
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('prdate');
    dateDiv.innerHTML = prDate.content;
    prHead.insertAdjacentElement('afterend', dateDiv);
  }
}

export default async function decorate(doc) {
  addPressReleaseDate(doc.querySelector('main'), doc);
}
