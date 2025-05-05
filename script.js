// Debounce Utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Welcome Screen Transition
window.addEventListener("load", () => {
  const welcome = document.getElementById("welcome-screen");
  const hero = document.querySelector(".hero");
  const scrollPrompt = document.querySelector(".scroll-prompt");

  setTimeout(() => {
    welcome.style.opacity = "0";
    setTimeout(() => {
      welcome.remove();
      hero.classList.add("show");
      
      // Animate scroll prompt after hero appears
      gsap.to(scrollPrompt, {
        opacity: 1,
        delay: 0.5,
        duration: 1
      });
    }, 1000);
  }, 2500);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero floating text animation
gsap.to(".animated-text span", {
  y: -5,
  duration: 2,
  repeat: -1,
  yoyo: true,
  stagger: 0.05,
  ease: "sine.inOut"
});

// Section Entrances with scrollTrigger (General sections)
gsap.utils.toArray("section:not(.education)").forEach((section, index) => {
  const direction = index % 2 === 0 ? -50 : 50; // Reduced translation

  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "bottom top",
      toggleActions: "play reverse play reverse",
    },
    x: direction,
    opacity: 0,
    duration: 0.8, // Shorter duration
    ease: "power2.out",
    stagger: 0.1 // Reduced stagger
  });
});

// Specific animation for Education section
gsap.from(".education", {
  scrollTrigger: {
    trigger: ".education",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none none",
  },
  x: 50, // Reduced translation
  opacity: 0,
  duration: 0.8,
  ease: "power2.out"
});

// Staggered list items animation with scrollTrigger
gsap.from("ul li", {
  scrollTrigger: {
    trigger: "ul",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none none",
  },
  opacity: 0,
  y: 20,
  stagger: 0.05,
  duration: 0.4
});

// Tilt Effects (desktop only)
if (!window.matchMedia("(pointer: coarse)").matches) {
  VanillaTilt.init(document.querySelectorAll(".project-card, .info-card"), {
    max: 10, // Reduced tilt angle
    speed: 400,
    glare: true,
    "max-glare": 0.1 // Reduced glare
  });
}

// Starfield Background with Canvas (Desktop only)
const isMobile = window.matchMedia("(max-width: 600px)").matches;
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

if (!isMobile) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let stars = Array(200).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.3,
    opacity: Math.random() * 0.5 + 0.5,
    baseColor: [50, 50, 50],
    hoverColor: [255, 255, 255],
    glowRadius: 5,
    twinkleSpeed: Math.random() * 0.02 + 0.005
  }));

  let mouse = { x: null, y: null };

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
      star.opacity = Math.max(0.3, Math.min(1, star.opacity));
      
      const dx = star.x - mouse.x;
      const dy = star.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;
      
      let color = star.baseColor;
      if (mouse.x && distance < maxDistance) {
        const ratio = 1 - (distance / maxDistance);
        color = [
          Math.floor(star.baseColor[0] + (star.hoverColor[0] - star.baseColor[0]) * ratio),
          Math.floor(star.baseColor[1] + (star.hoverColor[1] - star.baseColor[1]) * ratio),
          Math.floor(star.baseColor[2] + (star.hoverColor[2] - star.baseColor[2]) * ratio)
        ];
        ctx.shadowBlur = star.glowRadius * 3;
        ctx.shadowColor = `rgba(${star.hoverColor.join(",")}, 0.8)`;
      } else {
        ctx.shadowBlur = 0; // No shadow for non-hovered stars
      }
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.join(",")}, ${star.opacity})`;
      ctx.fill();
    });
    
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('mousemove', debounce((e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, 10));

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  drawStars();

  // Debounced Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array(500).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.5 + 0.5,
        baseColor: [50, 50, 50],
        hoverColor: [255, 255, 255],
        glowRadius: 5,
        twinkleSpeed: Math.random() * 0.02 + 0.005
      }));
    }, 200);
  });
}

// Glowing Stars Effect for Hero Section (Desktop only)
if (!isMobile) {
  document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector(".hero");
    const numStars = 50; // Reduced stars
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      hero.appendChild(star);
      stars.push(star);
    }

    document.addEventListener("mousemove", debounce((e) => {
      stars.forEach(star => {
        const rect = star.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - e.clientX;
        const dy = rect.top + rect.height / 2 - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          star.classList.add("glow");
        } else {
          star.classList.remove("glow");
        }
      });
    }, 10));
  });
}
