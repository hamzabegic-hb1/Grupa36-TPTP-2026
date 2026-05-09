
document.addEventListener('DOMContentLoaded', function () {

    const ig = document.getElementById("IG");
    const yt = document.getElementById("YT");
    const fb = document.getElementById("FB");
    const x = document.getElementById("X");
    //e.preventDefault() funkcija je preporucena od strane ChatGPT da se doda
    ig.addEventListener("click", function(e) {
        e.preventDefault();
        window.open("https://www.instagram.com/nfsbih_official/", "_blank");
    });
    yt.addEventListener("click", function(e) {
        e.preventDefault();
        window.open("https://www.youtube.com/@nfsbihofficial8465", "_blank");
    });
    fb.addEventListener("click", function(e) {
        e.preventDefault();
        window.open("https://www.facebook.com/nfsbih/?locale=hr_HR", "_blank");
    });
    x.addEventListener("click", function(e) {
        e.preventDefault();
        window.open("https://x.com/NFSBiH", "_blank");
    });
     
    const themeToggle = document.getElementById('darkModeToggle');

    if (localStorage.getItem('theme') === 'dark-mode') {
        document.body.classList.add('dark-mode');
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark-mode');

            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

});