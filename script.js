 
    const burger = document.getElementById('burgerBtn');
    const menu = document.getElementById('sideMenu');

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('active');
    });