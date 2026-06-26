document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Sticky Header with Scroll Blur Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-borderpink');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-borderpink');
      header.classList.add('bg-transparent');
    }
  });

  // 2. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Service Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button classes
      filterButtons.forEach(b => {
        b.classList.remove('bg-luxury-gradient', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-charcoal', 'hover:bg-secondary');
      });
      btn.classList.add('bg-luxury-gradient', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-charcoal', 'hover:bg-secondary');

      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.classList.remove('hidden');
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 4. Hero Stats Counter Animation
  const statsSection = document.getElementById('stats-container');
  const stats = document.querySelectorAll('.stat-count');
  let animated = false;

  const countUp = (element, target) => {
    let current = 0;
    const increment = target / 50; // 50 frames
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target === 5.0 ? '5.0' : Math.floor(target) + '+';
        clearInterval(timer);
      } else {
        element.textContent = target === 5.0 ? current.toFixed(1) : Math.floor(current) + '+';
      }
    }, 30);
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            countUp(stat, target);
          });
          animated = true;
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // 5. Booking Form WhatsApp Link Generator
  const bookingForm = document.getElementById('bridal-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('booking-name').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const service = document.getElementById('booking-service').value;
      const date = document.getElementById('booking-date').value;
      const time = document.getElementById('booking-time').value;
      const notes = document.getElementById('booking-notes').value.trim();

      // Validate required inputs
      if (!name || !phone || !service || !date) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // Construct message
      let message = `Hello Dulhan Beauty Parlors,\n\n`;
      message += `I would like to book a bridal consultation / beauty treatment:\n\n`;
      message += `✨ *Name:* ${name}\n`;
      message += `📞 *Phone/WhatsApp:* ${phone}\n`;
      message += `💅 *Service:* ${service}\n`;
      message += `📅 *Preferred Date:* ${date}\n`;
      if (time) message += `⏰ *Preferred Time:* ${time}\n`;
      if (notes) message += `📝 *Additional Notes:* ${notes}\n`;

      // URL Encode Message
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/923133036372?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappURL, '_blank');
      showToast('Redirecting to WhatsApp to complete your booking... ✨', 'success');
      bookingForm.reset();
    });
  }

  // 6. Contact Form General Message Generator
  const contactForm = document.getElementById('general-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const msg = document.getElementById('contact-message').value.trim();

      if (!name || !subject || !msg) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // Construct WhatsApp message for quick response
      let message = `Hello Dulhan Beauty Parlors,\n\n`;
      message += `I have an inquiry from your website:\n\n`;
      message += `👤 *Name:* ${name}\n`;
      if (email) message += `📧 *Email:* ${email}\n`;
      message += `📌 *Subject:* ${subject}\n`;
      message += `💬 *Message:* ${msg}\n`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/923133036372?text=${encodedMessage}`;

      window.open(whatsappURL, '_blank');
      showToast('Opening WhatsApp to send your message... 🌸', 'success');
      contactForm.reset();
    });
  }

  // Toast System
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  document.body.appendChild(toast);

  function showToast(message, type = 'success') {
    const icon = type === 'success' ? '✨' : '⚠️';
    toast.innerHTML = `<span class="text-xl">${icon}</span> <span class="text-sm font-medium">${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 7. Mini Testimonial Carousel Indicator Logic
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      if (i === index) {
        card.classList.remove('hidden');
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.classList.add('hidden');
          card.style.display = 'none';
        }, 300);
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-accent', 'w-6');
        dot.classList.remove('bg-borderpink', 'w-2.5');
      } else {
        dot.classList.remove('bg-accent', 'w-6');
        dot.classList.add('bg-borderpink', 'w-2.5');
      }
    });
  }

  if (dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentTestimonial = parseInt(dot.getAttribute('data-index'));
        showTestimonial(currentTestimonial);
      });
    });

    // Auto rotate every 8 seconds
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(currentTestimonial);
    }, 8000);
  }
});
