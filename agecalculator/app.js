// Create stars
        const starsContainer = document.getElementById('stars');
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }

        // Create planets
        const planet1 = document.getElementById('planet1');
        const planet2 = document.getElementById('planet2');

        ///// chatgpt
        planet1.style.width = '100px';
        planet1.style.height = '100px';
        planet1.style.background = 'radial-gradient(circle, #ff7e5f, #feb47b)';
        planet1.style.top = '20%';
        planet1.style.left = '10%';
        planet1.style.boxShadow = '0 0 30px #ff7e5f';

        planet2.style.width = '60px';
        planet2.style.height = '60px';
        planet2.style.background = 'radial-gradient(circle, #88d3ce, #6e45e2)';
        planet2.style.bottom = '15%';
        planet2.style.right = '10%';
        planet2.style.boxShadow = '0 0 20px #6e45e2';

        // Age Calculation
        document.getElementById('ageForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous results and errors
            document.getElementById('result').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            
            // Get input values
            const day = parseInt(document.getElementById('day').value);
            const month = parseInt(document.getElementById('month').value);
            const year = parseInt(document.getElementById('year').value);
            
            // Validate inputs
            if (!isValidDate(day, month, year)) {
                document.getElementById('error').textContent = 'Please enter a valid date!';
                document.getElementById('error').style.display = 'block';
                return;
            }
            
            // Calculate age
            const age = calculateAge(day, month, year);
            
            // Display result
            document.getElementById('years').textContent = age.years;
            document.getElementById('months').textContent = age.months;
            document.getElementById('days').textContent = age.days;
            document.getElementById('ageDisplay').textContent = `${age.years} YEARS IN THIS UNIVERSE`;
            
            document.getElementById('result').style.display = 'block';
            
            // Trigger confetti /////  chatgpt
            triggerConfetti();
            
            // Animate planets based on age
            animatePlanets(age.years);
        });

        function isValidDate(day, month, year) {
            if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
            if (day < 1 || day > 31) return false;
            if (month < 1 || month > 12) return false;
            if (year < 1900 || year > new Date().getFullYear()) return false;
            
            // Check for month lengths
            if (month === 2) {
                const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                if (isLeapYear) return day <= 29;
                return day <= 28;
            } else if ([4, 6, 9, 11].includes(month)) {
                return day <= 30;
            }
            
            return true;
        }

        function calculateAge(day, month, year) {
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            
            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            let days = today.getDate() - birthDate.getDate();
            
            if (days < 0) {
                months--;
                const lastDayOfMonth = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                ).getDate();
                days += lastDayOfMonth;
            }
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            return { years, months, days };
        }

        function triggerConfetti() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00ffff', '#00c6ff', '#0072ff', '#6e45e2']
            });
        }

        function animatePlanets(age) {
            const planet1 = document.getElementById('planet1');
            const planet2 = document.getElementById('planet2');
            
            // Move planets based on age
            planet1.style.transform = `translate(${age % 20 * 5}px, ${age % 10 * 5}px)`;
            planet2.style.transform = `translate(-${age % 15 * 5}px, -${age % 8 * 5}px)`;
        }