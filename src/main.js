import './styles/scss/main.scss'

// ── Preloader ──
const preloader = document.getElementById('preloader')
window.addEventListener('load', () => {
  preloader?.classList.add('hidden')
  setTimeout(() => preloader?.remove(), 600)
})

document.addEventListener('DOMContentLoaded', () => {
  // ── Hero loaded class ──
  const hero = document.querySelector('.hero')
  hero?.classList.add('loaded')

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar')
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50)
  })

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'))
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
        // Close mobile nav if open
        document.getElementById('mobileNav')?.classList.remove('open')
      }
    })
  })

  // ── Mobile nav ──
  const menuToggle = document.getElementById('menuToggle')
  const mobileNav = document.getElementById('mobileNav')
  const mobileClose = document.getElementById('mobileClose')

  menuToggle?.addEventListener('click', () => mobileNav?.classList.add('open'))
  mobileClose?.addEventListener('click', () => mobileNav?.classList.remove('open'))
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileNav?.classList.remove('open'))
  })

  // ── FAQ accordion ──
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn = item.querySelector('.faq__question')
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open')
      // Close all others
      document.querySelectorAll('.faq__item.open').forEach(open => open.classList.remove('open'))
      if (!isOpen) item.classList.add('open')
      btn.setAttribute('aria-expanded', !isOpen)
    })
  })

  // ── Stats counter animation ──
  const animateStats = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10)
      if (!target || el.dataset.animated) return
      el.dataset.animated = 'true'
      const duration = 2000
      const start = performance.now()
      const animate = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3)
        el.textContent = Math.floor(eased * target)
        if (progress < 1) requestAnimationFrame(animate)
        else el.textContent = target
      }
      requestAnimationFrame(animate)
    })
  }

  // ── Reveal animations on scroll ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        // Trigger stats if inside revealed element
        animateStats()
      }
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

  revealElements.forEach(el => revealObserver.observe(el))

  // Also observe stats directly
  document.querySelectorAll('[data-count]').forEach(el => {
    revealObserver.observe(el.closest('.section-intro__stats') || el)
  })

  // ── Floating CTA hide near footer ──
  const floatingCta = document.querySelector('.floating-cta')
  const footer = document.querySelector('.footer')
  if (floatingCta && footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        floatingCta.style.opacity = entry.isIntersecting ? '0' : '1'
        floatingCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto'
      })
    }, { threshold: 0.1 })
    footerObserver.observe(footer)
  }

  // ── Contact form (prevent default, could be wired to a backend) ──
  const contactForm = document.getElementById('contactForm')
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    const btn = contactForm.querySelector('button[type="submit"]')
    const originalText = btn?.innerHTML
    if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Enviado!'
    setTimeout(() => { if (btn) btn.innerHTML = originalText }, 2500)
  })
})
