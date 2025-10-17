// ===================================
// Navigation & Mobile Menu
// ===================================

const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================================
// Smooth Scrolling
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animateElements = document.querySelectorAll(
    '.benefit-card, .service-card, .problem-card, .features-items li'
);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
    observer.observe(el);
});

// ===================================
// Wizard Form Handling
// ===================================

let currentStep = 1;
const totalSteps = 3;

const contactForm = document.getElementById('contactForm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');

// Show specific step
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress indicators
    updateProgress(step);
    
    // Update buttons
    updateButtons(step);
}

// Update progress bar
function updateProgress(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < step) {
            progressStep.classList.add('completed');
            progressStep.classList.remove('active');
        } else if (stepNumber === step) {
            progressStep.classList.add('active');
            progressStep.classList.remove('completed');
        } else {
            progressStep.classList.remove('active', 'completed');
        }
    });
    
    progressLines.forEach((line, index) => {
        if (index < step - 1) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
}

// Update button visibility
function updateButtons(step) {
    prevBtn.style.display = step === 1 ? 'none' : 'flex';
    nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
    submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
}

// Validate current step
function validateStep(step) {
    const currentStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'rgba(255, 100, 100, 0.8)';
            
            // Reset border color after a moment
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }
    
    return isValid;
}

// Next button
nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const contactMethod = document.getElementById('contactMethod').value;
    const message = document.getElementById('message').value;
    
    // Get selected services
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
    const services = Array.from(serviceCheckboxes).map(cb => cb.value.toUpperCase()).join(', ');
    
    // Create mailto link
    const fullName = `${firstName} ${lastName}`;
    const subject = encodeURIComponent(`New inquiry from ${fullName}`);
    const body = encodeURIComponent(
        `Name: ${fullName}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Preferred Contact Method: ${contactMethod}\n` +
        `Services Interested In: ${services || 'None selected'}\n\n` +
        `Additional Details:\n${message || 'No additional details provided'}`
    );
    
    window.location.href = `mailto:zac@marleymarketing.co.uk?subject=${subject}&body=${body}`;
    
    // Show success message
    showNotification('Thank you! Your message is being prepared in your email client.');
    
    // Reset form and wizard
    setTimeout(() => {
        contactForm.reset();
        currentStep = 1;
        showStep(currentStep);
    }, 1000);
});

// Initialize wizard
showStep(currentStep);

// Keyboard navigation
contactForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        
        if (currentStep < totalSteps) {
            nextBtn.click();
        } else {
            submitBtn.click();
        }
    }
});

// ===================================
// Notification System
// ===================================

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Different colors for different types
    const bgColor = type === 'error' 
        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.25rem 2rem;
        background: ${bgColor};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.4s ease-out;
        max-width: 400px;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Append to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 5000);
}

// ===================================
// 3D Shapes Parallax Effect
// ===================================

// Mouse move parallax (only on desktop)
if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape-3d');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 15;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`;
        });
        
        // Hero orbs
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Scroll parallax
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape-3d');
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.3;
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// ===================================
// Active Nav Link on Scroll
// ===================================

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// ===================================
// Stat Counter Animation
// ===================================

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images when available
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// Page Load Animation
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Accessibility Enhancements
// ===================================

// Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles
const style = document.createElement('style');
style.textContent = `
    .keyboard-nav *:focus {
        outline: 3px solid #667eea;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);

// ===================================
// Console Message
// ===================================

console.log(
    '%c✨ Marley Marketing Website',
    'font-size: 20px; font-weight: bold; color: #667eea;'
);
console.log(
    '%cBuilt with passion for great design and user experience.',
    'font-size: 12px; color: #64748b;'
);
console.log(
    '%c🚀 Ready to elevate your marketing? Visit marleymarketing.co.uk',
    'font-size: 12px; color: #8b5cf6;'
);

