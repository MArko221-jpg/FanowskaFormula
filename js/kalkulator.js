        // Dane produktów (takie same jak w sklepie)
        const products = [
            {
                id: 1,
                name: "Koszulka McLaren Team",
                price: 249.99,
                image: "/api/placeholder/280/180",
                description: "Oficjalna koszulka zespołu McLaren na sezon 2025",
                category: "clothing",
                team: "McLaren"
            },
            {
                id: 2,
                name: "Czapka Red Bull Racing",
                price: 149.99,
                image: "/api/placeholder/280/180",
                description: "Czapka z daszkiem w barwach zespołu Red Bull Racing",
                category: "clothing",
                team: "Red Bull Racing"
            },
            {
                id: 3,
                name: "Model Ferrari SF-25 1:18",
                price: 599.99,
                image: "/api/placeholder/280/180",
                description: "Kolekcjonerski model bolidu Ferrari z sezonu 2025 w skali 1:18",
                category: "models",
                team: "Ferrari"
            },
            {
                id: 4,
                name: "Kubek Mercedes AMG",
                price: 79.99,
                image: "/api/placeholder/280/180",
                description: "Ceramiczny kubek w barwach zespołu Mercedes AMG Petronas",
                category: "accessories",
                team: "Mercedes"
            },
            {
                id: 5,
                name: "Flaga Alpine F1 Team",
                price: 129.99,
                image: "/api/placeholder/280/180",
                description: "Duża flaga kibica zespołu Alpine F1 Team",
                category: "accessories",
                team: "Alpine"
            },
            {
                id: 6,
                name: "Bluza Williams Racing",
                price: 329.99,
                image: "/api/placeholder/280/180",
                description: "Ciepła bluza z kapturem w barwach Williams Racing",
                category: "clothing",
                team: "Williams"
            },
            {
                id: 7,
                name: "Rękawica z autografem Lewis Hamilton",
                price: 1299.99,
                image: "/api/placeholder/280/180",
                description: "Kolekcjonerska rękawica z autografem Lewisa Hamiltona",
                category: "memorabilia",
                team: "Ferrari"
            },
            {
                id: 8,
                name: "Zestaw modeli F1 2025",
                price: 1799.99,
                image: "/api/placeholder/280/180",
                description: "Komplet modeli wszystkich bolidów sezonu 2025 w skali 1:43",
                category: "models",
                team: "Various"
            },
            {
                id: 9,
                name: "Koszulka Replika Max Verstappen",
                price: 299.99,
                image: "/api/placeholder/280/180",
                description: "Replika koszulki Maxa Verstappena z sezonu 2025",
                category: "clothing",
                team: "Red Bull Racing"
            },
            {
                id: 10,
                name: "Brelok Aston Martin",
                price: 59.99,
                image: "/api/placeholder/280/180",
                description: "Metalowy brelok do kluczy zespołu Aston Martin",
                category: "accessories",
                team: "Aston Martin"
            },
            {
                id: 11,
                name: "Plakat GP Monaco 2025",
                price: 89.99,
                image: "/api/placeholder/280/180",
                description: "Oficjalny plakat Grand Prix Monaco 2025",
                category: "memorabilia",
                team: "Various"
            },
            {
                id: 12,
                name: "Model kasku Charles Leclerc 1:2",
                price: 499.99,
                image: "/api/placeholder/280/180",
                description: "Kolekcjonerski model kasku Charlesa Leclerca w skali 1:2",
                category: "models",
                team: "Ferrari"
            }
        ];
        
        // Tablica wybranych produktów
        let selectedProducts = [];
        
        // Inicjalizacja strony
        document.addEventListener('DOMContentLoaded', function() {
            initProductDropdown();
            
            // Dodanie obsługi przycisków
            document.getElementById('add-product-btn').addEventListener('click', addProductToSelection);
            document.getElementById('calculate-btn').addEventListener('click', calculateDiscount);
        });
        
        // Inicjalizacja listy produktów w dropdown
        function initProductDropdown() {
            const dropdown = document.getElementById('product-dropdown');
            
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.innerText = `${product.name} - ${product.price.toFixed(2)} zł (${product.team})`;
                dropdown.appendChild(option);
            });
        }
        
        // Dodawanie produktu do kalkulacji
        function addProductToSelection() {
            const dropdown = document.getElementById('product-dropdown');
            const productId = parseInt(dropdown.value);
            
            if (!productId) {
                alert('Proszę wybrać produkt z listy');
                return;
            }
            
            const product = products.find(p => p.id === productId);
            
            if (!product) return;
            
            selectedProducts.push({
                id: product.id,
                name: product.name,
                price: product.price,
                team: product.team,
                quantity: 1
            });
            
            renderSelectedProducts();
            updateDiscountFactors();
        }
        
        // Usuwanie produktu z selekcji
        function removeProductFromSelection(index) {
            selectedProducts.splice(index, 1);
            renderSelectedProducts();
            updateDiscountFactors();
        }
        
        // Zmiana ilości produktu
        function changeQuantity(index, delta) {
            const product = selectedProducts[index];
            const newQuantity = product.quantity + delta;
            
            if (newQuantity <= 0) {
                removeProductFromSelection(index);
            } else {
                product.quantity = newQuantity;
                renderSelectedProducts();
                updateDiscountFactors();
            }
        }
        
        // Renderowanie wybranych produktów
        function renderSelectedProducts() {
            const container = document.getElementById('product-list');
            
            if (selectedProducts.length === 0) {
                container.innerHTML = '<li class="empty-list">Nie wybrano jeszcze żadnych produktów</li>';
                return;
            }
            
            container.innerHTML = '';
            
            selectedProducts.forEach((product, index) => {
                const li = document.createElement('li');
                li.className = 'product-item';
                
                li.innerHTML = `
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-meta">
                            <span class="product-team">${product.team}</span>
                            <span class="product-price">${product.price.toFixed(2)} zł</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                            <span class="quantity-display">${product.quantity}</span>
                            <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                        </div>
                        <button class="remove-btn" data-index="${index}">Usuń</button>
                    </div>
                `;
                
                container.appendChild(li);
            });
            
            // Dodawanie obsługi przycisków
            document.querySelectorAll('.decrease-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    changeQuantity(index, -1);
                });
            });
            
            document.querySelectorAll('.increase-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    changeQuantity(index, 1);
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeProductFromSelection(index);
                });
            });
        }
        
        // Aktualizacja informacji o czynnikach rabatu
        function updateDiscountFactors() {
            if (selectedProducts.length === 0) {
                document.getElementById('quantity-factor').querySelector('.discount').textContent = '0%';
                document.getElementById('quantity-factor').querySelector('.factor-description').textContent = 'Liczba przedmiotów: 0';
                
                document.getElementById('value-factor').querySelector('.discount').textContent = '0%';
                document.getElementById('value-factor').querySelector('.factor-description').textContent = 'Wartość koszyka: 0.00 zł';
                
                document.getElementById('team-factor').querySelector('.discount').textContent = '0%';
                document.getElementById('team-factor').querySelector('.factor-description').textContent = 'Brak wybranych produktów';
                
                document.getElementById('repeat-factor').querySelector('.discount').textContent = '0%';
                document.getElementById('repeat-factor').querySelector('.factor-description').textContent = 'Brak powtórzeń';
                
                // Reset progresów i podsumowania
                document.getElementById('discount-percentage').textContent = '0%';
                document.getElementById('discount-progress-bar').style.width = '0%';
                document.getElementById('summary').style.display = 'none';
                
                // Usunięcie aktywnych klas
                document.querySelectorAll('.factor').forEach(el => {
                    el.classList.remove('active');
                });
                
                return;
            }
            
            // Obliczenia czynników rabatu
            const totalQuantity = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
            const totalValue = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            
            // 1. Rabat za ilość przedmiotów
            const quantityDiscount = calculateQuantityDiscount(totalQuantity);
            document.getElementById('quantity-factor').querySelector('.discount').textContent = `${quantityDiscount}%`;
            document.getElementById('quantity-factor').querySelector('.factor-description').textContent = `Liczba przedmiotów: ${totalQuantity}`;
            
            // 2. Rabat za wartość przedmiotów
            const valueDiscount = calculateValueDiscount(totalValue);
            document.getElementById('value-factor').querySelector('.discount').textContent = `${valueDiscount}%`;
            document.getElementById('value-factor').querySelector('.factor-description').textContent = `Wartość koszyka: ${totalValue.toFixed(2)} zł`;
            
            // 3. Rabat za przynależność zespołową
            const teamDiscount = calculateTeamDiscount(selectedProducts);
            document.getElementById('team-factor').querySelector('.discount').textContent = `${teamDiscount}%`;
            
            // Przygotowanie informacji o zespołach
            const teamCounts = {};
            selectedProducts.forEach(product => {
                for (let i = 0; i < product.quantity; i++) {
                    if (!teamCounts[product.team]) teamCounts[product.team] = 0;
                    teamCounts[product.team]++;
                }
            });
            
            let teamInfo = Object.entries(teamCounts)
                .map(([team, count]) => `${team}: ${count}`)
                .join(', ');
            
            document.getElementById('team-factor').querySelector('.factor-description').textContent = `Zespoły: ${teamInfo}`;
            
            // 4. Rabat za powtórzenia
            const repeatDiscount = calculateRepeatDiscount(selectedProducts);
            document.getElementById('repeat-factor').querySelector('.discount').textContent = `${repeatDiscount}%`;
            
            // Przygotowanie informacji o powtórzeniach
            const productCounts = {};
            selectedProducts.forEach(product => {
                if (!productCounts[product.id]) productCounts[product.id] = 0;
                productCounts[product.id] += product.quantity;
            });
            
            const repeatingProducts = Object.entries(productCounts)
                .filter(([id, count]) => count > 1)
                .length;
            
            if (repeatingProducts > 0) {
                document.getElementById('repeat-factor').querySelector('.factor-description').textContent = 
                    `${repeatingProducts} produkt(y) się powtarza(ją)`;
            } else {
                document.getElementById('repeat-factor').querySelector('.factor-description').textContent = 
                    'Brak powtórzeń';
            }
            
            // Ustawienie aktywnych klas dla czynników
            document.querySelectorAll('.factor').forEach(el => {
                el.classList.remove('active');
            });
            
            if (quantityDiscount > 0) document.getElementById('quantity-factor').classList.add('active');
            if (valueDiscount > 0) document.getElementById('value-factor').classList.add('active');
            if (teamDiscount > 0) document.getElementById('team-factor').classList.add('active');
            if (repeatDiscount > 0) document.getElementById('repeat-factor').classList.add('active');
        }
        
        // Obliczanie rabatu na podstawie ilości produktów
        function calculateQuantityDiscount(count) {
            if (count >= 8) return 15; // 15% rabatu dla 8+ przedmiotów
            if (count >= 5) return 10; // 10% rabatu dla 5-7 przedmiotów
            if (count >= 3) return 5;  // 5% rabatu dla 3-4 przedmiotów
            return 0; // Brak rabatu dla 1-2 przedmiotów
        }
        
        // Obliczanie rabatu na podstawie wartości produktów
        function calculateValueDiscount(totalValue) {
            if (totalValue >= 1501) return 8; // 8% rabatu dla zakupów powyżej 1500 zł
            if (totalValue >= 801) return 5;  // 5% rabatu dla zakupów 801-1500 zł
            if (totalValue >= 301) return 3;  // 3% rabatu dla zakupów 301-800 zł
            return 0; // Brak rabatu dla zakupów do 300 zł
        }
        
        // Obliczanie rabatu za produkty z tego samego zespołu
        function calculateTeamDiscount(products) {
            // Liczenie produktów dla każdego zespołu
            const teamCounts = {};
            
            products.forEach(product => {
                for (let i = 0; i < product.quantity; i++) {
                    if (!teamCounts[product.team]) {
                        teamCounts[product.team] = 0;
                    }
                    teamCounts[product.team]++;
                }
            });
            
            // Znajdowanie maksymalnej liczby produktów dla jednego zespołu
            let maxTeamProducts = 0;
            for (const team in teamCounts) {
                if (teamCounts[team] > maxTeamProducts) {
                    maxTeamProducts = teamCounts[team];
                }
            }
            
            if (maxTeamProducts >= 3) return 7; // 7% rabatu za 3+ produkty tego samego zespołu
            if (maxTeamProducts >= 2) return 3; // 3% rabatu za 2 produkty tego samego zespołu
            return 0; // Brak rabatu jeśli nie ma powtórzeń zespołów
        }
        
        // Obliczanie rabatu za powtarzające się produkty
        function calculateRepeatDiscount(products) {
            // Liczenie wystąpień każdego produktu
            const productCounts = {};
            
            products.forEach(product => {
                if (!productCounts[product.id]) {
                    productCounts[product.id] = 0;
                }
                productCounts[product.id] += product.quantity;
            });
            
            // Znajdowanie maksymalnej liczby powtórzeń jednego produktu
            let maxRepeats = 0;
            for (const productId in productCounts) {
                if (productCounts[productId] > maxRepeats) {
                    maxRepeats = productCounts[productId];
                }
            }
            
            if (maxRepeats >= 3) return 10; // 10% rabatu za 3+ sztuki tego samego produktu
            if (maxRepeats >= 2) return 5;  // 5% rabatu za 2 sztuki tego samego produktu
            return 0; // Brak rabatu jeśli nie ma powtórzeń produktów
        }
        
        // Obliczanie całkowitego rabatu
        function calculateDiscount() {
            if (selectedProducts.length === 0) {
                alert('Dodaj produkty aby obliczyć rabat');
                return;
            }
            
            const totalQuantity = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
            const totalValue = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            
            const quantityDiscount = calculateQuantityDiscount(totalQuantity);
            const valueDiscount = calculateValueDiscount(totalValue);
            const teamDiscount = calculateTeamDiscount(selectedProducts);
            const repeatDiscount = calculateRepeatDiscount(selectedProducts);
            
            // Sumowanie rabatów z ograniczeniem do 30%
            let totalDiscount = quantityDiscount + valueDiscount + teamDiscount + repeatDiscount;
            totalDiscount = Math.min(totalDiscount, 30); // Maksymalny rabat to 30%
            
            // Wyświetlanie wyniku
            document.getElementById('discount-percentage').textContent = `${totalDiscount}%`;
            document.getElementById('discount-progress-bar').style.width = `${(totalDiscount / 30) * 100}%`;
            
            // Aktualizacja podsumowania
            const discountAmount = (totalValue * totalDiscount / 100);
            const finalPrice = totalValue - discountAmount;

            document.getElementById('total-value').textContent = `${totalValue.toFixed(2)} zł`;
            document.getElementById('discount-value').textContent = `${discountAmount.toFixed(2)} zł`;
            document.getElementById('final-price').textContent = `${finalPrice.toFixed(2)} zł`;
            
            // Pokazanie sekcji podsumowania
            document.getElementById('summary').style.display = 'block';
            
            // Animacja przejścia do wyników
            document.querySelector('.calculation-results').scrollIntoView({ behavior: 'smooth' });
        }
        