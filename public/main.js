document.addEventListener('DOMContentLoaded', () => {
    // Quantum HUD Cursor Logic
    const quantumCursor = document.querySelector('.cursor-quantum');
    const coordX = document.querySelector('.q-coord-x');
    const coordY = document.querySelector('.q-coord-y');
    const qStatus = document.querySelector('.q-status');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    let tickingMove = false;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!tickingMove) {
            window.requestAnimationFrame(() => {
                // Update coordinate text only if needed
                if (coordX && coordY) {
                    coordX.textContent = `X: ${Math.round(mouseX)}`;
                    coordY.textContent = `Y: ${Math.round(mouseY)}`;
                }
                tickingMove = false;
            });
            tickingMove = true;
        }
    });

    const animateQuantum = () => {
        const easing = 0.3;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;

        if (quantumCursor) {
            quantumCursor.style.transform = `translate3d(${cursorX - 50}px, ${cursorY - 50}px, 0)`;
        }
        requestAnimationFrame(animateQuantum);
    };
    animateQuantum();

    document.querySelectorAll('a, button, .work-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (quantumCursor) quantumCursor.classList.add('hovering');
            if (qStatus) qStatus.textContent = 'INTERCEPTING';
        });
        el.addEventListener('mouseleave', () => {
            if (quantumCursor) quantumCursor.classList.remove('hovering');
            if (qStatus) qStatus.textContent = 'READY';
        });
    });

    // Click Animation
    document.addEventListener('mousedown', () => {
        if (quantumCursor) {
            quantumCursor.classList.add('clicking');
            setTimeout(() => {
                quantumCursor.classList.remove('clicking');
            }, 600);
        }
    });


    // Floating Command Dock Logic
    let tickingScroll = false;
    window.addEventListener('scroll', () => {
        if (!tickingScroll) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Parallax Effect for Hero
                const heroBg = document.getElementById('hero-bg');
                if (heroBg) {
                    heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
                }

                tickingScroll = false;
            });
            tickingScroll = true;
        }
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Apply scroll reveal to elements
    const revealElements = [
        '.section-header',
        '.service-card',
        '.work-item',
        '.tech-item',
        '.testimonial-card',
        '.about-text',
        '.about-image',
        '.kinetic-item',
        '.other-item',
        '.parallax-quote blockquote'
    ];

    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    });

    // Individual Work Item Parallax + Tilt - Optimized with Intersection Observer logic
    const workItems = document.querySelectorAll('.work-item');
    let tickingWorkParallax = false;
    window.addEventListener('scroll', () => {
        if (!tickingWorkParallax) {
            window.requestAnimationFrame(() => {
                workItems.forEach(item => {
                    const speed = item.getAttribute('data-speed') || 1;
                    const rect = item.getBoundingClientRect();
                    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

                    if (isInView) {
                        const scrolled = window.innerHeight - rect.top;
                        const yOffset = scrolled * (speed - 1) * 0.15;
                        const rotation = scrolled * 0.005;
                        const img = item.querySelector('img');
                        if (img) img.style.transform = `translate3d(0, ${yOffset}px, 0) scale(1.15) rotate(${rotation}deg)`;
                    }
                });
                tickingWorkParallax = false;
            });
            tickingWorkParallax = true;
        }
    });

    // 3D Tilt for Service Cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // Data Stream Effect
    const dataStream = document.querySelector('.data-stream');
    if (dataStream) {
        setInterval(() => {
            const binary = Array.from({ length: 3 }, () => Math.random().toString(2).slice(2, 10)).join(' ');
            dataStream.textContent = binary;
        }, 3000);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-center');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            menuToggle.classList.toggle('active');
        });
    }

    // Add CSS for reveal animations dynamically
    const style = document.createElement('style');
    style.textContent = `
            .reveal-element {
                opacity: 0;
                transform: translateY(40px);
                transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
            }
            .reveal-element.in-view {
                opacity: 1;
                transform: translateY(0);
            }
            .service-card:nth-child(2) { transition-delay: 0.2s; }
            .service-card:nth-child(3) { transition-delay: 0.4s; }
        `;
    document.head.appendChild(style);

    // Dynamic Background Transition Logic (Black to Grey to White)
    const colors = [
        { r: 0, g: 0, b: 0 },       // Absolute Black
        { r: 15, g: 15, b: 15 },    // Very Dark Grey
        { r: 25, g: 25, b: 25 },    // Dark Grey
        { r: 35, g: 35, b: 35 }     // Greyish Black
    ];

    function interpolateColor(color1, color2, factor) {
        const r = Math.round(color1.r + (color2.r - color1.r) * factor);
        const g = Math.round(color1.g + (color2.g - color1.g) * factor);
        const b = Math.round(color1.b + (color2.b - color1.b) * factor);
        return `rgb(${r}, ${g}, ${b})`;
    }

    const updateScrollTheme = () => {
        const scrollTop = window.scrollY;
        const bodyHeight = document.body.scrollHeight;
        const winHeight = window.innerHeight;
        const docHeight = Math.max(bodyHeight - winHeight, 1);
        const scrollFraction = Math.min(Math.max(scrollTop / docHeight, 0), 1);

        const sectionFraction = 1 / (colors.length - 1);
        const sectionIndex = Math.min(Math.floor(scrollFraction / sectionFraction), colors.length - 2);
        const sectionFactor = (scrollFraction - (sectionIndex * sectionFraction)) / sectionFraction;

        const c1 = colors[sectionIndex];
        const c2 = colors[sectionIndex + 1];

        const r = c1.r + (c2.r - c1.r) * sectionFactor;
        const g = c1.g + (c2.g - c1.g) * sectionFactor;
        const b = c1.b + (c2.b - c1.b) * sectionFactor;
        const currentColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

        // Apply to CSS variables
        document.documentElement.style.setProperty('--bg', currentColor);

        // Dynamic Text Inversion Logic
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const isLight = luminance > 0.5;

        const contrastColor = isLight ? '#000000' : '#ffffff';
        const invertedColor = isLight ? '#ffffff' : '#000000';
        document.documentElement.style.setProperty('--text', contrastColor);
        document.documentElement.style.setProperty('--nav-hover', invertedColor);
        document.documentElement.style.setProperty('--text-muted', isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)');
        document.documentElement.style.setProperty('--glass-border', isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
        document.documentElement.style.setProperty('--glass', isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)');

        // Contrast the cursor colour for visibility
        if (quantumCursor) {
            const core = quantumCursor.querySelector('.quantum-core');
            const dataSpans = quantumCursor.querySelectorAll('.quantum-data span');
            const orbit = quantumCursor.querySelector('.quantum-orbit');

            const mainColor = isLight ? '#000000' : '#ffffff';
            if (core) core.style.background = mainColor;
            if (orbit) orbit.style.borderColor = isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
            dataSpans.forEach(span => {
                span.style.color = mainColor;
                span.style.borderLeftColor = mainColor;
                span.style.background = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
            });
        }

        // Update logo color based on luminance
        const follower = document.querySelector('.cursor-follower');
        if (follower) follower.style.borderColor = isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';

        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.style.background = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(8, 8, 8, 0.7)';
            navContainer.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
        }
    };

    let tickingTheme = false;
    window.addEventListener('scroll', () => {
        if (!tickingTheme) {
            window.requestAnimationFrame(() => {
                updateScrollTheme();
                tickingTheme = false;
            });
            tickingTheme = true;
        }
    });

    window.addEventListener('resize', () => {
        window.requestAnimationFrame(updateScrollTheme);
    });
    updateScrollTheme();
});
