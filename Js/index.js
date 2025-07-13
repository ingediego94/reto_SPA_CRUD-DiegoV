const user = JSON.parse(localStorage.getItem('login_success')) || false;

if (!user) {
    window.location.href = 'login.html';
}

const logout = document.querySelector('#logout');

// TO ADD ROLE ***********************************************************************
// Ocultar/enlazar vistas según el rol
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav .link_a');
    if (user.role !== 'admin') {
        navLinks.forEach(link => {
            const view = link.getAttribute('data-vista');
            if (!['home', 'course', 'report'].includes(view)) {
                link.style.display = 'none';
            }
        });
    }
});
//************************************************************************** */

logout.addEventListener('click', ()=>{
    alert('Hasta pronto');
    window.location.href = 'login.html';
})