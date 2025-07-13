const user = JSON.parse(localStorage.getItem('login_success')) || false;

if (!user) {
    window.location.href = 'login.html';
}
debugger;
const logout = document.querySelector('#logout');

logout.addEventListener('click', ()=>{
    alert('Hasta pronto');
    window.location.href = 'login.html';
})