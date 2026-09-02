document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="/"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href !== window.location.pathname) {
        document.body.classList.add('page-leave');
      }
    });
  });
});
