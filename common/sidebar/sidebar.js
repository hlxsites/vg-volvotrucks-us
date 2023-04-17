import { loadCSS } from '../../scripts/lib-franklin.js';

const styles$ = new Promise((r) => {
  loadCSS(`${window.hlx.codeBasePath}/common/sidebar/sidebar.css`, r);
});

let sidebar;

export async function showSidebar(content, decorateContent) {
  await styles$;
  if (!sidebar) {
    const fragment = document.createRange().createContextualFragment(`
            <div>
                <aside class="sidebar semitrans-trigger">
                    <button class="close">
                        <img src="/icons/Close-Icons.png">
                    </button>
                    <div></div>
                </aside>
                <div class="semitrans"></div>
            </div>
        `);
    sidebar = fragment.querySelector('.sidebar');
    document.body.append(...fragment.children);

    const button = sidebar.querySelector('button.close');
    button.addEventListener('click', () => {
      document.body.classList.remove('disable-scroll');
      sidebar.ariaExpanded = false;
    });
  }
  const container = sidebar.querySelector('div');
  container.replaceChildren(...content);

  if (decorateContent) await decorateContent(container);

  // expand slightly delayed for the animations to work
  setTimeout(() => {
    document.body.classList.add('disable-scroll');
    sidebar.ariaExpanded = true;
    const button = sidebar.querySelector('button.close');
    button.focus();
  });
}

export function hideSidebar() {
  if (!sidebar) return;
  sidebar.ariaExpanded = false;
  document.body.classList.remove('disable-scroll');
}
