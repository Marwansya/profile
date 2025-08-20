 
    const burger = document.getElementById('burgerBtn');
    const menu = document.getElementById('sideMenu');

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('active');
    });
    
const audio = document.getElementById('btn-sound');

document.querySelectorAll('.btn-sosmed').forEach(button => {
  button.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play();

    // redirect setelah suara selesai atau beberapa saat
    setTimeout(() => {
      window.open(button.dataset.link, "_blank"); // buka di tab baru
    }, 300); // 300ms setelah bunyi, bisa sesuaikan
  });
});