document.addEventListener('DOMContentLoaded', function () {

   /* === WINDOWS TEMA + RUCNI DARK MODE FIX === */
/* === WINDOWS TEMA + RUCNI DARK MODE FIX === */
(function () {
    function primijeniTemu(tema) {
        if (tema === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        document.querySelectorAll("#darkModeToggle").forEach(function (dugme) {
            dugme.textContent = tema === "dark" ? "☀️" : "🌙";
        });
    }

    function pokreniTemu() {
        const dugme = document.getElementById("darkModeToggle");

        // Ako korisnik nikad nije birao temu na stranici,
        // stranica uzima temu iz Windowsa/browsera upitno da li radi treba jos izmjena napraviti.
        const sacuvanaTema = localStorage.getItem("theme");

        if (sacuvanaTema === "dark" || sacuvanaTema === "dark-mode") {
            primijeniTemu("dark");
        } else if (sacuvanaTema === "light") {
            primijeniTemu("light");
        } else {
            const windowsDark = window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;

            primijeniTemu(windowsDark ? "dark" : "light");
        }

        if (dugme) {
            dugme.onclick = function (e) {
                e.preventDefault();

                if (document.body.classList.contains("dark-mode")) {
                    localStorage.setItem("theme", "light");
                    primijeniTemu("light");
                } else {
                    localStorage.setItem("theme", "dark");
                    primijeniTemu("dark");
                }
            };
        }

        // Ako korisnik NIJE ručno izabrao temu, stranica prati promjenu Windows teme.
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
                const sacuvano = localStorage.getItem("theme");

                if (!sacuvano) {
                    primijeniTemu(event.matches ? "dark" : "light");
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", pokreniTemu);
    } else {
        pokreniTemu();
    }
})();



    
   

    // ==========================================
    // PRIKAZ PRIJAVLJENOG KORISNIKA U HEADERU
    // ==========================================
    // ovdje je claude sklopio ovaj html i dugme za odjavu jer se sve pobrkalo u headeru kad se covjek prijavi
    

    // ==========================================
    // MODALI
    // ==========================================
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    function openModal(modal) {
        if (modal) modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal) modal.classList.remove('active');
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', function () { openModal(loginModal); });
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', function () { openModal(registerModal); });
    }

    document.querySelectorAll('.close-modal').forEach(function (button) {
        button.addEventListener('click', function () {
            closeModal(button.closest('.modal-overlay'));
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(function (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal(modal);
        });
    });

    document.querySelectorAll('.switch-to-register').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    });

    document.querySelectorAll('.switch-to-login').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    });

    // ==========================================
    // FLOATING LABEL EFEKAT ZA LOGIN/REGISTER
    // ==========================================
    document.querySelectorAll('.inputbox input').forEach(function (input) {
        function updateValueClass() {
            if (input.value.trim() !== '') input.classList.add('has-value');
            else input.classList.remove('has-value');
        }
        input.addEventListener('input', updateValueClass);
        updateValueClass();
    });

    // ==========================================
    // HASHIRANJE LOZINKE
    // ==========================================
    //  nemam pojma sta je textencoder ni crypto.subtle.digest, ovo je chatgpt radio
    async function hashPassword(password) {
        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function(byte) {
            return byte.toString(16).padStart(2, '0');
        }).join('');
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem('tptp-users') || '[]');
    }

    function saveUsers(users) {
        localStorage.setItem('tptp-users', JSON.stringify(users));
    }

    function setError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.toggle('input-error', message !== '');
        if (error) error.textContent = message;
    }

    function setMessage(id, message, success) {
        const element = document.getElementById(id);
        if (!element) return;
        element.textContent = message;
        element.classList.remove('success-message', 'error-message');
        element.classList.add(success ? 'success-message' : 'error-message');
    }

    // ovaj regex za email mi je dao claude
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ==========================================
    // REGISTER LOGIKA
    // ==========================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim().toLowerCase();
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('registerConfirm').value;
            let valid = true;

            setError('registerName', 'registerNameError', '');
            setError('registerEmail', 'registerEmailError', '');
            setError('registerPassword', 'registerPasswordError', '');
            setError('registerConfirm', 'registerConfirmError', '');
            setMessage('registerMessage', '', true);

            if (name.length < 3) {
                setError('registerName', 'registerNameError', 'Unesite ime i prezime.');
                valid = false;
            }
            if (!emailRegex.test(email)) {
                setError('registerEmail', 'registerEmailError', 'Unesite ispravan email.');
                valid = false;
            }
            if (password.length < 6) {
                setError('registerPassword', 'registerPasswordError', 'Lozinka mora imati najmanje 6 karaktera.');
                valid = false;
            }
            if (password !== confirm) {
                setError('registerConfirm', 'registerConfirmError', 'Lozinke se ne poklapaju.');
                valid = false;
            }
            if (!valid) return;

            const users = getUsers();
            if (users.some(function(u) { return u.email === email; })) {
                setMessage('registerMessage', 'Korisnik sa tim emailom već postoji.', false);
                return;
            }

            const passwordHash = await hashPassword(password);
            users.push({ name: name, email: email, passwordHash: passwordHash });
            saveUsers(users);

            localStorage.setItem('tptp-logged-user', JSON.stringify({ name: name, email: email }));
            setMessage('registerMessage', 'Registracija uspješna! Automatski ste prijavljeni.', true);
            registerForm.reset();

            setTimeout(function () {
                closeModal(registerModal);
                window.location.reload();
            }, 700);
        });
    }

    // ==========================================
    // LOGIN LOGIKA
    // ==========================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            let valid = true;

            setError('loginEmail', 'loginEmailError', '');
            setError('loginPassword', 'loginPasswordError', '');
            setMessage('loginMessage', '', true);

            if (!emailRegex.test(email)) {
                setError('loginEmail', 'loginEmailError', 'Unesite ispravan email.');
                valid = false;
            }
            if (password.length === 0) {
                setError('loginPassword', 'loginPasswordError', 'Unesite lozinku.');
                valid = false;
            }
            if (!valid) return;

            const passwordHash = await hashPassword(password);
            const user = getUsers().find(function(item) {
                return item.email === email && item.passwordHash === passwordHash;
            });

            if (!user) {
                setMessage('loginMessage', 'Pogrešan email ili lozinka.', false);
                return;
            }

            localStorage.setItem('tptp-logged-user', JSON.stringify({ name: user.name, email: user.email }));
            setMessage('loginMessage', 'Uspješna prijava. Dobro došli, ' + user.name + '!', true);

            setTimeout(function () {
                closeModal(loginModal);
                window.location.reload();
            }, 700);
        });
    }

    // ==========================================
    // FILTRIRANJE KARTICA — KLIK NA FILTER DUGME
    // ==========================================
    // chatgpt mi uradio ovo sa split i includes za kategorije jer su neki klubovi imali po dvije regije (npr sarajevo fbih) pa nije radilo obicno poredjenje
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const category = btn.getAttribute('data-category');

            cards.forEach(function (card) {
                const cardCategories = card.getAttribute('data-category').split(' ');
                if (category === 'all' || cardCategories.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // DRUŠTVENE MREŽE
    // ==========================================
    const socialLinks = {
        IG: 'https://www.instagram.com/nfsbih_official/',
        YT: 'https://www.youtube.com/@nfsbihofficial8465',
        FB: 'https://www.facebook.com/nfsbih',
        X:  'https://x.com/NFSBiH'
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

    // ==========================================
    // KONTAKT FORMA - VALIDACIJA + USPJEŠNA PORUKA
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        function showFieldError(fieldId, errorId, message) {
            const field = document.getElementById(fieldId);
            const errorEl = document.getElementById(errorId);
            if (field) field.classList.add('input-error');
            if (errorEl) errorEl.textContent = message;
        }

        function clearFieldError(fieldId, errorId) {
            const field = document.getElementById(fieldId);
            const errorEl = document.getElementById(errorId);
            if (field) field.classList.remove('input-error');
            if (errorEl) errorEl.textContent = '';
        }

        const contactEmailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
        // claude mi napisao ovaj regex za telefon da prima samo brojeve i crtice 
        const telefonRegex = /^[0-9\s-]+$/;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName  = document.getElementById('lastName').value.trim();
            const email     = document.getElementById('contactEmail').value.trim();
            const phone     = document.getElementById('phone').value.trim();
            const topic     = document.getElementById('topic').value;
            const message   = document.getElementById('message').value.trim();

            clearFieldError('firstName', 'firstNameError');
            clearFieldError('lastName', 'lastNameError');
            clearFieldError('contactEmail', 'contactEmailError');
            clearFieldError('phone', 'phoneError');
            clearFieldError('topic', 'topicError');
            clearFieldError('message', 'messageError');

            const successEl = document.getElementById('contactSuccess');
            if (successEl) { successEl.textContent = ''; successEl.className = 'form-message'; }

            let valid = true;

            if (firstName.length < 2) {
                showFieldError('firstName', 'firstNameError', 'Unesite ime (min. 2 karaktera).');
                valid = false;
            }

            if (lastName.length < 2) {
                showFieldError('lastName', 'lastNameError', 'Unesite prezime (min. 2 karaktera).');
                valid = false;
            }

            if (!contactEmailRegex.test(email)) {
                showFieldError('contactEmail', 'contactEmailError', 'Unesite ispravan email (npr. ime@domena.ba).');
                valid = false;
            }

            if (phone.length === 0) {
                showFieldError('phone', 'phoneError', 'Unesite broj telefona.');
                valid = false;
            } else if (!telefonRegex.test(phone)) {
                showFieldError('phone', 'phoneError', 'Telefon može sadržavati samo cifre, razmake i crtice.');
                valid = false;
            }

            if (topic === '') {
                showFieldError('topic', 'topicError', 'Odaberite temu upita.');
                valid = false;
            }

            if (message.length < 5) {
                showFieldError('message', 'messageError', 'Poruka mora imati najmanje 5 karaktera.');
                valid = false;
            }

            if (!valid) return;

            if (successEl) {
                successEl.textContent = 'Hvala, ' + firstName + '! Vaša poruka je uspješno poslana. Javit ćemo se na ' + email + '.';
                successEl.classList.add('success-message');
            }

            contactForm.reset();
        });

        const resetBtn = document.getElementById('resetContact');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                contactForm.reset();
                ['firstName','lastName','contactEmail','phone','topic','message'].forEach(function (fieldId) {
                    const errId = fieldId === 'contactEmail' ? 'contactEmailError' : fieldId + 'Error';
                    clearFieldError(fieldId, errId);
                });
                const successEl = document.getElementById('contactSuccess');
                if (successEl) { successEl.textContent = ''; successEl.className = 'form-message'; }
            });
        }
    }

    // ==========================================
    // INTERAKTIVNI ELEMENT: ANIMIRANI BROJAČ + COUNTDOWN
    // ==========================================
    //  performance.now i requestanimationframe i neki easeout sa pow(1-progress, 3)... ovo je chatgpt radio
    function animateCount(elementId, target, duration) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    if (document.getElementById('matchCount')) {
        animateCount('matchCount', 135, 1800);
        animateCount('goalCount', 312, 2200);
        animateCount('clubCount', 10, 1000);
    }

    
    function updateCountdown() {
        const el = document.getElementById('seasonTimer');
        if (!el) return;

        const krajSezone = new Date('2026-05-30T00:00:00');
        const sada = new Date();
        const razlika = krajSezone - sada;

        if (razlika <= 0) {
            el.textContent = 'Sezona završena!';
            return;
        }

        const dani    = Math.floor(razlika / (1000 * 60 * 60 * 24));
        const sati    = Math.floor((razlika % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minute  = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
        const sekunde = Math.floor((razlika % (1000 * 60)) / 1000);

        el.textContent =
            dani + 'd ' +
            String(sati).padStart(2, '0') + ':' +
            String(minute).padStart(2, '0') + ':' +
            String(sekunde).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

});
