export default async function decorate(block) {
  const buttons = block.querySelectorAll('a');
  buttons.forEach((button) => {
    button.classList.remove(['button']);
  });
  const lists = block.querySelectorAll('div > div > ul');
  lists.forEach((list) => {
    const contDiv = document.createElement('div');
    contDiv.classList.add('multiline');
    list.querySelectorAll('li').forEach((item) => {
      const itm = document.createElement('div');
      itm.innerHTML = item.innerHTML;
      contDiv.append(itm);
    });
    list.replaceWith(contDiv);
  });
}
