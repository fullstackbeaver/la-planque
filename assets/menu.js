window.onload = () => {
  const nav = document.querySelector('.hero nav');
  const body = document.querySelector('body');

  body.addEventListener('click', (e) => {
    if (window.innerWidth >= 1024) return;
    const rect = body.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY;

    if (
      clickX >= rect.width - 60 &&
      clickX <= rect.width - 20 &&
      clickY >= 20 &&
      clickY <= 60
    ) {
      nav.classList.toggle('is-open');
    }
  });
}
