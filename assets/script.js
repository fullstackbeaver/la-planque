window.onload = () => {
  const nav = document.querySelector('.hero nav');
  const body = document.querySelector('body');
  console.log("...", nav, window.innerWidth < 1024)

  body.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    const rect = body.getBoundingClientRect();
    // const style = window.getComputedStyle(nav, '::before');

    // Récupérer les dimensions du ::before
    // const beforeWidth = parseInt(style.width);
    // const beforeHeight = parseInt(style.height);

    // Calculer la position relative au nav


    const clickX = e.clientX - rect.left;
    const clickY = e.clientY;// - window.scrollY;
    console.log(clickX, clickY, e.clientY, window.scrollY)

    // Zone du burger (à ajuster selon votre CSS)
    if (
      clickX >= rect.width - 60 && // 60px depuis la droite
      clickX <= rect.width - 20 &&
      clickY >= 20 &&
      clickY <= 60
    ) {
      nav.classList.toggle('is-open');
    }
  });
}
