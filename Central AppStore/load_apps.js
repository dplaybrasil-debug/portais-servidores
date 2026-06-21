// Carrega apps da API JSON e renderiza na grade
(async () => {
    try {
        const resp = await fetch('apps.json');
        const apps = await resp.json();
        const grid = document.querySelector('.apps-grid');
        grid.innerHTML = '';
        apps.forEach(app => {
            const article = document.createElement('article');
            article.className = 'app-card';
            article.innerHTML = `
                <img src="${app.image}" alt="${app.name}" class="app-img">
                <h3 class="app-name">${app.name}</h3>
                <p class="app-desc">${app.description}</p>
                <a href="#" class="app-cta">Instalar</a>
            `;
            grid.appendChild(article);
        });
    } catch (e) {
        console.error('Erro ao carregar apps:', e);
    }
})();
