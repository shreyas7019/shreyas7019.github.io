// Project content lives in index.html so it remains readable without JavaScript.
const choices = [...document.querySelectorAll('.project-choice')];
const panels = choices.map(link => document.querySelector(link.getAttribute('href')));
const projectList = document.querySelector('.project-links');

if (choices.length && panels.every(Boolean)) {
  projectList.setAttribute('role', 'tablist');
  projectList.setAttribute('aria-label', 'Selected projects');
  // The project list stays vertical on desktop and mobile.
  projectList.setAttribute('aria-orientation', 'vertical');

  function selectProject(index, moveFocus = false) {
    choices.forEach((link, i) => {
      link.setAttribute('aria-selected', String(i === index));
      link.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (moveFocus) choices[index].focus();
  }

  choices.forEach((link, index) => {
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', link.id);
    panels[index].tabIndex = 0;
    link.addEventListener('click', event => {
      event.preventDefault();
      selectProject(index);
      history.replaceState(null, '', '#' + panels[index].id);
    });
    link.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % choices.length;
      if (event.key === 'ArrowUp') next = (index - 1 + choices.length) % choices.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = choices.length - 1;
      if (event.key === ' ') next = index;
      if (next === undefined) return;
      event.preventDefault();
      selectProject(next, true);
      history.replaceState(null, '', '#' + panels[next].id);
    });
  });

  const fromHash = () => {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) selectProject(index);
  };
  selectProject(Math.max(0, panels.findIndex(panel => '#' + panel.id === location.hash)));
  window.addEventListener('hashchange', fromHash);
  document.documentElement.classList.add('enhanced');
}

document.querySelectorAll('.image-link img').forEach(image => {
  const showFallback = () => {
    image.closest('.image-link').hidden = true;
    image.closest('figure').querySelector('.image-error').hidden = false;
  };
  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});
