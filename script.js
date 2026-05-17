document.addEventListener('DOMContentLoaded', () => {
    // Add simple hover effect tracking for 3D tilt sensation (optional polish)
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    console.log("Tabela de Créditos Carregada com Sucesso!");

    // Limpar localStorage antigo para não sobrescrever dados do servers.js
    ['channels-count', 'movies-count', 'series-count', 'price-1', 'price-2', 'price-3', 'price-4', 'price-5', 'price-6', 'price-7'].forEach(key => localStorage.removeItem(key));

    // Load Server Data
    const urlParams = new URLSearchParams(window.location.search);
    const serverId = urlParams.get('id') || 'newone';
    // Assuming 'servers' object is defined globally or imported from 'servers.js'
    const server = servers[serverId] || servers['newone'];

    // 1. Update Logo
    const logoImg = document.querySelector('.main-brand-logo');
    if (logoImg) {
        logoImg.src = server.logo;
        logoImg.alt = server.name;
    }

    // 2. Update Document Title
    document.title = `Tabela de Preços - ${server.name}`;

    // 3. Update Colors (CSS Variables)
    if (server.colorMain) {
        document.documentElement.style.setProperty('--cyan-mid', server.colorMain);
        document.documentElement.style.setProperty('--cyan-dark', server.colorDark);
        document.documentElement.style.setProperty('--cyan-light', server.colorLight);
    }

    // 4. Update Header Title to Server Name (Optional, but nice)
    // const headerTitle = document.querySelector('.content-table-header');
    // if(headerTitle) headerTitle.textContent = `Conteúdos ${server.name}`;

    // 5. Update Counts (If elements exist and we want to change them) 
    // Identifying rows by index since we removed IDs. 
    // Row 1: Channels, Row 2: Movies, Row 3: Series
    const valueElements = document.querySelectorAll('.content-value');
    if (valueElements.length >= 3) {
        // Helper to format with dots
        const formatNum = (val) => {
            if (!val) return '-';
            // Ensure it's a string, strip existing non-digits just in case, then add dots
            return val.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        // Use saved values or fallback to default placeholders if empty
        valueElements[0].textContent = formatNum(server.channels_count);
        valueElements[1].textContent = formatNum(server.movies_count);
        valueElements[2].textContent = formatNum(server.series_count);
    }

    // 5.1 Update Prices and Ranges (dynamic)
    const pills = document.querySelectorAll('.pill'); // All pills including special
    const pricingGrid = document.querySelector('.pricing-grid');

    // Check if server has a specific message (e.g., "No data available")
    const headerLeft = document.querySelector('.header-left');
    const headerRight = document.querySelector('.header-right');

    if (server.message) {
        // Hide Left Header (Counts & Time)
        if (headerLeft) headerLeft.style.display = 'none';

        // Center Logo for focus
        if (headerRight) headerRight.style.justifyContent = 'center';

        if (pricingGrid) {
            pricingGrid.style.display = 'none';

            // Create or update message container
            let msgContainer = document.getElementById('server-message-container');
            if (!msgContainer) {
                msgContainer = document.createElement('div');
                msgContainer.id = 'server-message-container';
                msgContainer.style.textAlign = 'center';
                msgContainer.style.padding = '50px 20px';
                msgContainer.style.fontSize = '2rem';
                msgContainer.style.fontFamily = "'Anton', sans-serif";
                msgContainer.style.letterSpacing = '1px';
                msgContainer.style.color = '#fff';
                msgContainer.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
                msgContainer.style.marginTop = '20px';
                pricingGrid.parentNode.insertBefore(msgContainer, pricingGrid);
            }
            msgContainer.textContent = server.message;
            msgContainer.style.display = 'block';
        }
    } else {
        // Normal behavior: Restore
        if (headerLeft) headerLeft.style.display = 'flex';
        if (headerRight) headerRight.style.justifyContent = 'flex-end'; // Restore default right align

        if (pricingGrid) pricingGrid.style.display = 'grid'; // Restore grid 
        const msgContainer = document.getElementById('server-message-container');
        if (msgContainer) msgContainer.style.display = 'none';

        // We expect pills 0-6 to be standard, 7 to be special.
        // However, let's target specific price pills 0-6 (the standard ones).

        if (server.ranges && server.prices) {
            // Custom configuration mode
            pills.forEach((pill, index) => {
                // Check standard pills (0-6) and Special pill (7)
                // If server.ranges defined, use strict length check
                if (index < server.ranges.length) {
                    pill.style.display = 'flex';
                    // Update Range Text
                    const rangeEl = pill.querySelector('.qty-range');
                    if (rangeEl) {
                        rangeEl.textContent = server.ranges[index];
                        // Removing long-text class reset for safety, add back if length > 12?
                        if (server.ranges[index].length > 12) rangeEl.classList.add('long-text');
                        else rangeEl.classList.remove('long-text');
                    }
                    // Update Price
                    const priceEl = pill.querySelector('.price-value');
                    if (priceEl && server.prices[index]) {
                        priceEl.textContent = server.prices[index];
                        if (server.prices[index].length > 6 || server.prices[index].toLowerCase().includes("negociar")) {
                            priceEl.classList.add('long-price');
                        } else {
                            priceEl.classList.remove('long-price');
                        }
                    }
                } else {
                    // Hide unused pills, BUT check if it's the Special Pill (index 7) and if server wants it shown
                    if (index === 7 && server.showSpecial) {
                        pill.style.display = 'flex';
                        // Optional: Custom range for special pill
                        if (server.specialRange) {
                            const rangeEl = pill.querySelector('.qty-range');
                            if (rangeEl) rangeEl.textContent = server.specialRange;
                        }
                    } else {
                        pill.style.display = 'none';
                    }
                }
            });
        } else if (server.prices && server.prices.length >= 7) {
            // ALL PLAYER Logic (Just prices, standard ranges)
            pills.forEach((pill, index) => {
                if (index < 7) {
                    pill.style.display = 'flex'; // Ensure visible if modifying from hidden state
                    // Reset Standard Ranges if needed? 
                    // Note: This naive approach assumes server reload. 
                    // If SPA dynamic switch, we'd need to restore default ranges text here.
                    // For now, assuming page reload or standard 'New One' is default.
                    const priceEl = pill.querySelector('.price-value');
                    if (priceEl) priceEl.textContent = server.prices[index];
                }
            });
        } else {
            // Default Mode
            // Ensure all 7 standard pills are visible, hide special 8th by default if requested "remove 5k+"
            pills.forEach((pill, index) => {
                if (index < 7) pill.style.display = 'flex';
                else pill.style.display = 'none'; // Hide index 7 (5k+)
            });
            // (Ideally reset prices/ranges to default HTML here if we were doing true SPA)
        }
    }

    // 6. Dynamic Partners Section
    const partnersSection = document.getElementById('partners');
    const partnersGrid = document.querySelector('.partners-grid');
    const partnersTitle = document.querySelector('.partners-title');

    // Map partner names to filenames (matching actual files in assets/logos/)
    const partnerLogos = {
        "ASSIST PLUS": "ASSIST PLUS.png",
        "BIG PLAYER": "BIG PLAYER.png",
        "BLESSED PLAYER": "BLESSED PLAYER.png",
        "BRASIL IPTV": "BRASIL IPTV.png",
        "BeesTV": "HibridoTV.png",
        "CLOUD": "cloud.png",
        "CORE PLAYER": "Core Player.png",
        "DREAM TV": "DREAM TV.jpg",
        "EASY PLAYER": "EASY PLAYER.png",
        "EPIC PLAY": "EPIC PLAY.png",
        "FLEXPLAY": "FLEXPLAY.png",
        "FUN PLAY": "FUN PLAY.jpeg",
        "HD PLAYER": "HD PLAYER.png",
        "HibridoTV": "HibridoTV.png",
        "I-PLAYER": "IP-TV PLAYER.png",
        "I PLAYER": "IP-TV PLAYER.png",
        "I Player": "IP-TV PLAYER.png",
        "IPTV 4K": "IPTV 4K.png",
        "IPTV +": "IPTV PLUS.png",
        "IPTV PLUS": "IPTV PLUS.png",
        "IPTV OTT": "OTT PLAYER.png",
        "IPTV PLAY": "PlayIPTV.png",
        "IPTV PRO": "IPTV PRO.png",
        "IPTV Pro": "IPTV PRO.png",
        "IPTV PRO PLAYER": "IPTV PRO PLAYER.png",
        "IPTV Player io": "IPTV Player io.png",
        "IPTV STAR": "STAR IPTV.jpg",
        "IPTV STAR PLAYER": "STAR IPTV.jpg",
        "K-PLAYER": "KPLAY.png",
        "LAZER PLAY": "LAZER PLAY.png",
        "LOTUS": "lotus.png",
        "MAGIC PLAYER": "MAGIC PLAYER.jpeg",
        "MAX PLAYER": "MAX PLAYER.png",
        "NATV": "NATV.png",
        "NETX IPTV": "NETX IPTV.png",
        "NEWONE": "NEWONE.png",
        "OTT PLAYER": "OTT PLAYER.png",
        "P2SPEED": "P2SPEED.png",
        "PLAY BOX": "PLAY BOX.png",
        "PLAY SIM": "PLAY SIM.png",
        "PlayIPTV": "PlayIPTV.png",
        "POWER PIXEL": "POWER PIXEL.png",
        "POWER PLAY": "POWER PLAY.png",
        "PREMIUM IPTV": "PREMIUM IPTV.png",
        "PRIME IPTV": "PRIME IPTV.png",
        "PRO PLAYER": "PRO PLAYER.png",
        "QPLAY": "QPLAY.png",
        "QUICK PLAYER": "Quick Player.jpg",
        "QUICK PLAYER PRO": "QUICK PLAYER PRO.png",
        "SEE PLAY": "SEE PLAY.png",
        "STAR IPTV": "STAR IPTV.jpg",
        "SUPER PLAY": "SUPER PLAY.png",
        "THUNDER OTT": "THUNDER.png",
        "TIVI PLAYER": "TIVI PLAYER.jpeg",
        "TIVIPLAYER IPTV": "TIVI PLAYER.jpeg",
        "TiviPlayer IPTV": "TIVI PLAYER.jpeg",
        "TV PLAY": "TVS APP.png",
        "TVS": "TVS APP.png",
        "TV VISON": "VIZZION PLAY.png",
        "ULTRA PLAYER": "ULTRA PLAYER.png",
        "UTM PRO": "UTM PRO.png",
        "VERTU PLAY": "Vertu Play.png",
        "VIZZION PLAY": "VIZZION PLAY.png",
        "WAPP": "WAPP.png",
        "WAPP TV": "WAPP.png",
        "XCLOUD": "xcloud.png"
    };

    // Check if server is ALL PLAYER, ATMOS, BOX SERVIDOR, DIGITAL TV or DUNA TV (hide completely) OR if server has a message
    if (partnersSection && (server.message || server.name.toUpperCase() === "ALL PLAYER" || server.name.toUpperCase() === "ATMOS" || server.name.toUpperCase() === "BOX SERVIDOR" || server.name.toUpperCase() === "DIGITAL TV" || server.name.toUpperCase() === "DUNA TV" || server.name.toUpperCase() === "NEW LIVE" || server.name.toUpperCase() === "LIVE 21" || server.name.toUpperCase() === "NATV" || server.name.toUpperCase() === "NOW" || server.name.toUpperCase() === "NPTV ( OFFICE )" || server.name.toUpperCase() === "PAZ TV" || server.name.toUpperCase() === "PIXEL PLAY" || server.name.toUpperCase() === "PLAY ON" || server.name.toUpperCase() === "THUNDER OTT" || server.name.toUpperCase() === "UNITV")) {

        partnersSection.style.display = 'none';
    } else if (partnersSection) {
        partnersSection.style.display = 'block';

        // If server has specific partners list, render them
        if (server.partners && server.partners.length > 0 && partnersGrid) {
            partnersGrid.innerHTML = ''; // Clear existing content
            // The partnersTitle.textContent modification has been removed as per instruction.

            // Iterate and create logos
            server.partners.forEach(partnerName => {
                const filename = partnerLogos[partnerName] || \`\${partnerName}.png\`;

                const img = document.createElement('img');
                const tstamp = new Date().getTime();
                img.src = \`assets/logos/\${filename}?v=\${tstamp}\`;
                img.alt = partnerName;
                img.className = 'partner-logo';

                // Add error handling to fallback to jpg/jpeg 
                img.onerror = function () {
                    if (!this.dataset.triedJpg) {
                        this.dataset.triedJpg = 'true';
                        this.src = \`assets/logos/\${partnerName}.jpg?v=\${tstamp}\`;
                    } else if (!this.dataset.triedJpeg) {
                        this.dataset.triedJpeg = 'true';
                        this.src = \`assets/logos/\${partnerName}.jpeg?v=\${tstamp}\`;
                    } else {
                        // Replace with text placeholder
                        const placeholder = document.createElement('div');
                        placeholder.className = 'partner-logo-text';
                        placeholder.textContent = partnerName;

                        this.replaceWith(placeholder);
                        console.warn('Missing partner logo, using text fallback:', filename);
                    }
                };

                // Apply color classes based on name heuristic
                if (partnerName.toUpperCase().includes('ASSIST')) img.classList.add('yellow');
                else if (partnerName.toUpperCase().includes('FUN')) img.classList.add('cyan');
                else if (partnerName.toUpperCase().includes('LAZER')) img.classList.add('blue');
                else if (partnerName.toUpperCase().includes('PLAY SIM')) img.classList.add('red');
                else if (partnerName.toUpperCase().includes('POWER')) img.classList.add('purple');
                else if (partnerName.toUpperCase().includes('MAX')) img.classList.add('purple');
                else if (partnerName.toUpperCase().includes('BLESSED')) img.classList.add('red'); // New heuristic
                else img.classList.add('cyan'); // Default

                partnersGrid.appendChild(img);
            });
        }
        // If no specific partners, leave the default HTML static list (or we could define a default list in JS)
    }

    // Update Timestamp
    // Update Timestamp
    const dateElement = document.getElementById('current-date-time');
    if (dateElement) {
        if (server.last_updated) {
            try {
                // Parse date "DD/MM/YYYY às HH:mm"
                const parts = server.last_updated.split(' às ');
                if (parts.length === 2) {
                    const dateParts = parts[0].split('/');
                    const updateDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                    const now = new Date();
                    const diffTime = Math.abs(now - updateDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let color = '#fff';
                    if (diffDays <= 7) color = '#00ff88';      // Green
                    else if (diffDays <= 30) color = '#00d4ff'; // Blue
                    else color = '#ff4d4d';                     // Red

                    const dayText = diffDays <= 1 ? '(Hoje)' : `(há ${diffDays} dias)`;

                    dateElement.innerHTML = `Atualizado em: ${server.last_updated} <span style="margin-left:5px; font-weight:bold;">${dayText}</span>`;
                    dateElement.style.color = color;
                    // Add a subtle text shadow to ensure readability on backgrounds
                    dateElement.style.textShadow = `0 0 10px ${color}40`;
                } else {
                    dateElement.textContent = `Atualizado em: ${server.last_updated}`;
                }
            } catch (e) {
                dateElement.textContent = `Atualizado em: ${server.last_updated}`;
            }
        } else {
            // Fallback if not set
            const now = new Date();
            dateElement.textContent = `Atualizado em: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
            dateElement.style.color = '#888'; // Grey/Neutral to indicate auto-generated
        }
    }
    // Removed old interval to keep it static based on data
    // updateDateTime();
    // setInterval(updateDateTime, 30000);

    // --- Admin Mode Logic (editing now done via partners-manager.html) ---
    const adminBtn = document.getElementById('admin-toggle');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'partners-manager.html';
        });
    }
});

