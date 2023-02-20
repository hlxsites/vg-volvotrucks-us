export default function decorate(block) {
    // go through all teasers
    [...block.children[0].children].forEach(elem => {
        // add teaser class for each entry 
        elem.classList.add('teaser')
        // give p containing the image a specific class
        elem.querySelector('picture').parentElement.classList.add('image');
        // give all the other p a text class
        elem.querySelector('p:not(.image)').classList.add('text');
        // give cta's link(s) a specific class name
        const cta_links = elem.querySelectorAll('.button-container a');
        cta_links.forEach((cta) => {
            cta.classList.add('cta');
        })
    })    
}