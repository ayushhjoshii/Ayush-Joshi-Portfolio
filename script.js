// ======================================= //
// ======== Debounce Utility ======== //
// ======================================= //
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Global variable for blurred element (main content wrapper)
const blurredElement = document.getElementById('main-content-wrapper');

// ======================================= //
// ======== Welcome Screen & Hero Entrance ======== //
// ======================================= //
window.addEventListener("load", () => {
    const welcome = document.getElementById("welcome-screen");
    const hero = document.querySelector(".hero");
    const scrollPrompt = document.querySelector(".scroll-prompt");
    const welcomeText = document.querySelector(".welcome-text");

    // Initial state: welcome screen is solid black, content behind is blurred
    // (Blur is set in CSS on #main-content-wrapper)

    gsap.timeline()
        .to(welcomeText, { // Animate Welcome Text In
            opacity: 1,
            // y: 0, // No Y animation needed if it's already centered by CSS flexbox
            duration: 1.5,
            ease: "power2.out",
            delay: 1 // Welcome text appears 1 second after black screen starts
        })
        .to(welcome, { // Fade out Welcome Screen (black overlay)
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            delay: 1, // Welcome screen fades out 1 second after text is fully visible
            onComplete: () => {
                welcome.remove(); // Remove welcome screen from DOM after it fades out
                hero.classList.add("show"); // Ensure hero is visible
                gsap.from(scrollPrompt, { // Animate scroll prompt
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    delay: 0.5,
                    ease: "power2.out"
                });
            }
        })
        .to(blurredElement, { // Animate blur out on main content wrapper
            filter: "blur(0px)",
            duration: 1.5, // Matches or slightly exceeds welcome screen fade duration for smoothness
            ease: "power2.inOut"
        }, "<"); // Starts blur animation at the same time as welcome screen fades out
});

// ======================================= //
// ======== GSAP Animations ======== //
// ======================================= //
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Hero floating text animation
gsap.to(".animated-text span", {
    y: -5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    stagger: 0.05,
    ease: "sine.inOut"
});

// Parallax effect on main content wrapper (subtle)
gsap.to("#main-content-wrapper", {
    y: () => -innerHeight * 0.1, // Move content wrapper up slightly slower than scroll
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true,
    }
});

// Section Entrances with scrollTrigger (General sections)
gsap.utils.toArray("section").forEach((section) => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom center",
            toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
    });
});

// Staggered list items animation with scrollTrigger (Apply to all ul in info-card)
gsap.utils.toArray(".info-card ul").forEach(ul => {
    gsap.from(ul.children, {
        scrollTrigger: {
            trigger: ul,
            start: "top 85%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    });
});

// ======================================= //
// ======== Vanilla Tilt Effects ======== //
// ======================================= //
// Tilt Effects (desktop only)
if (!window.matchMedia("(pointer: coarse)").matches) {
    VanillaTilt.init(document.querySelectorAll(".project-card, .info-card, .skill-card"), {
        max: 8,
        speed: 600,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02
    });
}

// ======================================= //
// ======== Custom Cursor Follower ======== //
// ======================================= //
const cursorFollower = document.getElementById('cursor-follower');
const isMobileDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isMobileDevice) {
    document.body.addEventListener('mousemove', (e) => {
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.05,
            ease: "power2.out",
            opacity: 1
        });
    });

    document.body.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, {
            opacity: 0,
            duration: 0.3
        });
    });
} else {
    if (cursorFollower) {
        cursorFollower.style.display = 'none';
    }
    document.body.style.cursor = 'default';
    document.querySelectorAll('a, .project-card, .info-card, .animated-text span, .demo-btn, .skill-card').forEach(el => {
        el.style.cursor = 'pointer';
    });
}

// ======================================= //
// ======== Canvas Background: Particle Network ======== //
// ======================================= //
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const numParticles = isMobileDevice ? 50 : 150;
const connectionDistance = 120;

let currentParticleColors = [];
let currentLineColor = '';

// Helper to get CSS variable value
const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Function to update particle colors and re-initialize particles
function updateParticleColorsAndRedraw() {
    currentParticleColors = [
        getCssVar('--canvas-particle-clr-1'),
        getCssVar('--canvas-particle-clr-2'),
        getCssVar('--canvas-particle-clr-3'),
        getCssVar('--canvas-particle-clr-4')
    ];
    currentLineColor = getCssVar('--canvas-line-clr');

    initParticles(); 
}

if (!isMobileDevice) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = currentParticleColors[Math.floor(Math.random() * currentParticleColors.length)];
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            this.opacity += (Math.random() - 0.5) * 0.01;
            this.opacity = Math.max(0.3, Math.min(1, this.opacity));
        }

        draw() {
            ctx.fillStyle = this.color.replace(/,(\s*\d+\.?\d*\s*)\)/, `, ${this.opacity})`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const p1 = particles[a];
                const p2 = particles[b];
                const distance = Math.sqrt(
                    (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
                );

                if (distance < connectionDistance) {
                    ctx.strokeStyle = currentLineColor.replace(/,(\s*\d+\.?\d*\s*)\)/, `, ${1 - (distance / connectionDistance)})`);
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', debounce((e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, 10));

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();

            if (mouse.x && mouse.y) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxForce = 15;
                    const attractionForce = (mouse.radius - distance) / mouse.radius * maxForce;

                    p.x -= attractionForce * forceDirectionX * 0.1;
                    p.y -= attractionForce * forceDirectionY * 0.1;

                    if (distance < mouse.radius / 2) {
                        ctx.strokeStyle = currentLineColor.replace(/,(\s*\d+\.?\d*\s*)\)/, `, ${1 - (distance / (mouse.radius / 2))})`);
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }
        connectParticles();
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animateCanvas);
    }
    
    animateCanvas();
}

// ======================================= //
// ======== Navigation Smooth Scroll ======== //
// ======================================= //
document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: targetId,
                offsetY: 80 // Offset for fixed header height
            },
            ease: "power3.inOut"
        });
    });
});

// ======================================= //
// ======== Theme Toggle (Light/Dark Mode) ======== //
// ======================================= //
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply theme and update canvas
function applyTheme(theme) {
    if (theme === 'light-mode') {
        body.classList.add('light-mode');
        themeToggleBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.remove('light-mode');
        themeToggleBtn.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
    if (!isMobileDevice) { // Update canvas if not mobile
        updateParticleColorsAndRedraw();
    }
}

// Check for saved theme preference on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme('dark-mode'); // Default to dark mode if no preference
}

// Event listener for theme toggle button
themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        applyTheme('dark-mode');
    } else {
        applyTheme('light-mode');
    }
});

// Initial call to update canvas colors based on loaded theme
// (This is separate from the welcome screen sequence)
if (!isMobileDevice) {
    // Only call after the initial blur has been set by GSAP, not just on 'load' event
    // The blur is now removed by the welcome screen timeline,
    // so we call updateParticleColorsAndRedraw after that timeline ends, or rely on applyTheme call on load.
    // The current setup `applyTheme` calls it, which is correct.
}


// ======================================= //
// ======== Video Project Play on Hover ======== //
// ======================================= //
const videoProjectCard = document.querySelector('.video-project-card');

if (videoProjectCard && !isMobileDevice) { // Only enable on desktop and if the card exists
    const videoElement = videoProjectCard.querySelector('video');

    if (videoElement) {
        videoProjectCard.addEventListener('mouseenter', () => {
            videoElement.play();
        });

        videoProjectCard.addEventListener('mouseleave', () => {
            videoElement.pause();
            videoElement.currentTime = 0;
            videoElement.load(); // Reloads the video element, forcing the poster to show
        });
    }
}