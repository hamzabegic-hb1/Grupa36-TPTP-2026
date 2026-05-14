document.addEventListener('DOMContentLoaded', function () {

    const themeToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme-faza4');

    if (savedTheme === 'dark-mode') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        if (themeToggle) themeToggle.textContent = '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme-faza4', 'dark-mode');
                themeToggle.textContent = '☀️';
            } else {
                localStorage.setItem('theme-faza4', 'light');
                themeToggle.textContent = '🌙';
            }
        });
    }

    // Ovaj dio je urađen uz pomoć AI alata.
    // Klik na ime kluba polako skroluje do stadiona
    // i privremeno označi odabrani stadion zelenom bojom na 4.5 sekundi.
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();

                document.querySelectorAll('.stadion-highlight').forEach(function (item) {
                    item.classList.remove('stadion-highlight');
                });

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                target.classList.add('stadion-highlight');

                setTimeout(function () {
                    target.classList.remove('stadion-highlight');
                }, 4500);
            }
        });
    });

    const socialLinks = {
        IG: 'https://www.instagram.com/nfsbih_official/',
        YT: 'https://www.youtube.com/@nfsbihofficial8465',
        FB: 'https://www.facebook.com/nfsbih',
        X: 'https://x.com/NFSBiH'
    };

    Object.keys(socialLinks).forEach(function (id) {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.open(socialLinks[id], '_blank');
            });
        }
    });
});
