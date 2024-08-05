import { createOptimizedPicture } from '../../scripts/aem.js';
import { createElement, removeEmptyTags } from '../../scripts/common.js';

const blockName = 'v2-visual-grid';
const CLASSES = {
  list: `${blockName}__list`,
  item: `${blockName}__item`,
};

/**
 * Extracts the alt text from the cell element.
 * @param {HTMLElement} cellElement - The cell element containing the text.
 * @returns {string} The extracted alt text.
 */
const extractAltText = (cellElement) => {
  const altTextElement = cellElement.querySelector(':scope > p:not(:has(picture))');
  return altTextElement ? altTextElement.textContent.trim() : '';
};

/**
 * Extracts the image element from the cell element.
 * @param {HTMLElement} cellElement - The cell element containing the picture.
 * @returns {HTMLImageElement|null} The image element, or null if not found.
 */
const extractImageElement = (cellElement) => {
  const pictureElement = cellElement.querySelector('picture');
  return pictureElement ? pictureElement.querySelector('img') : null;
};

/**
 * Creates a list item with an optimized picture.
 * @param {HTMLImageElement} image - The image element to optimize.
 * @param {string} altText - The alt text for the image.
 * @returns {HTMLElement} The list item with the optimized picture.
 */
const createListItemWithPicture = (image, altText) => {
  const listItem = createElement('li', { classes: CLASSES.item });
  const optimizedPicture = createOptimizedPicture(image.src, altText, false);
  listItem.prepend(optimizedPicture);
  return listItem;
};

/**
 * Processes a single cell to extract and create a list item if it contains a picture.
 * @param {HTMLElement} cellElement - The cell element to process.
 * @returns {HTMLElement|null} The created list item or null if no picture is found.
 */
const processCell = (cellElement) => {
  const imageElement = extractImageElement(cellElement);
  if (imageElement) {
    const altText = extractAltText(cellElement);
    return createListItemWithPicture(imageElement, altText);
  }
  return null;
};

/**
 * Processes each cell and adds it to the list if it contains a picture.
 * @param {HTMLElement} block - The block element containing the cells.
 * @returns {HTMLElement} The list element with all list items.
 */
const processCells = (block) => {
  const listElement = createElement('ul', { classes: CLASSES.list });
  const cellElements = block.querySelectorAll(':scope > div > div');

  cellElements.forEach((cellElement) => {
    const listItem = processCell(cellElement);
    if (listItem) {
      listElement.append(listItem);
    }
    cellElement.remove();
  });

  return listElement;
};

/**
 * Decorates the block element with an optimized visual grid.
 * @param {HTMLElement} block - The block element to decorate.
 */
const decorate = (block) => {
  const listElement = processCells(block);
  block.append(listElement);
  removeEmptyTags(block);
};

export default decorate;
