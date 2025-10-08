document.addEventListener('DOMContentLoaded', () => {

    const loginContent = document.getElementById('login-content');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const loadingContainer = document.getElementById('loading-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loadingText = document.getElementById('loading-text');

    const USERS_API_URL = 'https://dummyjson.com/users';

    const fetchAndStoreUsers = async () => {
        if (!localStorage.getItem('users')) {
            try {
                const response = await fetch(USERS_API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data pengguna.');
                const data = await response.json();
                localStorage.setItem('users', JSON.stringify(data.users));
                console.log('Data pengguna berhasil diambil dan disimpan.');
            } catch (error) {
                console.error('Error saat mengambil data:', error);
                alert('Gagal memuat data pengguna. Periksa koneksi Anda dan refresh halaman.');
            }
        }
    };

    const startLoadingBar = (onComplete) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = progress + '%';
            progressText.textContent = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                onComplete();
            }
        }, 15); 
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Username dan password tidak boleh kosong.');
            return;
        }

        loginContent.classList.add('hidden');
        loadingContainer.classList.remove('hidden');

        startLoadingBar(() => {
            const storedUsers = localStorage.getItem('users');
            if (!storedUsers) {
                alert('Data pengguna belum siap. Coba refresh halaman.');
                loadingContainer.classList.add('hidden');
                loginContent.classList.remove('hidden');
                return;
            }

            const users = JSON.parse(storedUsers);
            const foundUser = users.find(user => user.username.toLowerCase() === username);

            if (foundUser && foundUser.password === password) {
                loadingText.textContent = "Login Berhasil! Mengalihkan...";

                localStorage.setItem('firstName', foundUser.firstName);

                setTimeout(() => {
                    window.location.href = 'recipes.html';
                }, 500); 

            } else {
                loadingText.textContent = "Username atau Password Salah! Silahkan coba lagi...";
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    });

    fetchAndStoreUsers();
});