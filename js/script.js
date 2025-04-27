document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const scrollThreshold = 50;
        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('active');
            mobileMenu.style.display = isActive ? 'block' : 'none';
            menuToggle.setAttribute('aria-expanded', isActive);
            // Optional: Toggle body class to prevent scrolling
            // document.body.classList.toggle('mobile-menu-open', isActive);
        });
    }

    // --- Hero Slider (Auto-play only) ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentHeroSlide = 0;
    const heroSlideIntervalTime = 5500; // Slightly faster interval
    let heroSlideInterval;

    function showHeroSlide(index) {
        if (slides.length === 0) return;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        let nextIndex = (currentHeroSlide + 1) % slides.length;
        showHeroSlide(nextIndex);
    }

    function startHeroSlider() {
        stopHeroSlider(); // Clear existing interval
        if (slides.length > 1) {
            heroSlideInterval = setInterval(nextHeroSlide, heroSlideIntervalTime);
        }
    }

    function stopHeroSlider() {
        clearInterval(heroSlideInterval);
    }

    // Initialize hero slider
    if (slides.length > 0) {
        showHeroSlide(0); // Show the first slide
        startHeroSlider(); // Start automatic sliding
        // No event listeners for prev/next buttons needed
    }

    // --- Testimonial Slider (Auto-play with Dots) ---
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    let currentTestimonial = 0;
    let testimonialInterval;
    const testimonialIntervalTime = 7000; // Auto-play interval

    function createDots() {
        if (!dotsContainer || testimonials.length <= 1) return;
        dotsContainer.innerHTML = ''; // Clear existing dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                showTestimonial(index);
                // Restart interval after manual dot click
                stopTestimonialSlider();
                startTestimonialSlider();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots(index) {
        const dots = dotsContainer?.querySelectorAll('.dot');
        if (!dots) return;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function showTestimonial(index) {
        if (testimonials.length === 0) return;
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        currentTestimonial = index;
        updateDots(index);
    }

    function nextTestimonial() {
        let nextIndex = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }

    function startTestimonialSlider() {
        stopTestimonialSlider();
        if (testimonials.length > 1) {
            testimonialInterval = setInterval(nextTestimonial, testimonialIntervalTime);
        }
    }

    function stopTestimonialSlider() {
        clearInterval(testimonialInterval);
    }

    // Initialize testimonial slider
    if (testimonials.length > 0) {
        createDots();
        showTestimonial(0);
        startTestimonialSlider(); // Start auto-play
        // No event listeners for prev/next buttons needed

        // Optional: Pause slider on hover
        const testimonialSliderElement = document.querySelector('.testimonial-slider');
        if (testimonialSliderElement) {
            testimonialSliderElement.addEventListener('mouseenter', stopTestimonialSlider);
            testimonialSliderElement.addEventListener('mouseleave', startTestimonialSlider);
        }
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optional: Unobserve after first animation
                    // observerInstance.unobserve(entry.target);
                } else {
                    // Optional: Remove class to re-animate when scrolling up
                    // entry.target.classList.remove('animated');
                }
            });
        }, {
            threshold: 0.15 // Trigger when 15% is visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers: just show elements immediately
        animatedElements.forEach(el => el.classList.add('animated'));
    }


    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Contact Form Status Display (from URL parameters) ---
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const msg = urlParams.get('msg');

        if (status === 'success') {
            formStatus.textContent = "Thank you! Your message has been sent successfully.";
            formStatus.className = 'success'; // Add class for styling
        } else if (status === 'error') {
            formStatus.textContent = msg || "Sorry, an error occurred. Please try again.";
            formStatus.className = 'error';
        } else if (status === 'validation_error') {
            formStatus.textContent = msg ? msg.replace(/\\n/g, '\n') : "Please check the required fields."; // Decode newline characters if needed
            formStatus.className = 'error';
        }

        // Optional: Clear URL parameters after displaying status
        if (status && window.history.replaceState) {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
    }

    // --- Basic Contact Form Client-Side Validation (Optional Enhancement) ---
    // You can add JavaScript validation here to provide instant feedback
    // before submitting to PHP, but PHP validation is still essential.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Example: Check if name is filled
            const nameInput = document.getElementById('name');
            if (nameInput && nameInput.value.trim() === '') {
                // e.preventDefault(); // Stop submission
                // alert('Please enter your name.'); // Simple feedback
                // // More sophisticated feedback: add error class, display message near field
                // return false;
            }
            // Add more checks for email, message etc.
        });
    }


    console.log("Dev Makers premium scripts V2 loaded.");
  });
