// 404 page specific JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
  initErrorPageAnimations()
  initSearchFunctionality()
  initNavigationButtons()
})

// Error page animations
function initErrorPageAnimations() {
  // Animate particles with random movement
  const particles = document.querySelectorAll(".particle")

  particles.forEach((particle, index) => {
    // Random initial position
    const randomX = Math.random() * 100
    const randomY = Math.random() * 100

    particle.style.left = randomX + "%"
    particle.style.top = randomY + "%"

    // Add random movement
    setInterval(
      () => {
        const newX = Math.random() * 100
        const newY = Math.random() * 100

        particle.style.transition = "all 3s ease-in-out"
        particle.style.left = newX + "%"
        particle.style.top = newY + "%"
      },
      3000 + index * 500,
    )
  })

  // Animate suggestion cards on scroll
  const suggestionCards = document.querySelectorAll(".suggestion-card")

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "0"
            entry.target.style.transform = "translateY(30px)"
            entry.target.style.transition = "all 0.6s ease"

            setTimeout(() => {
              entry.target.style.opacity = "1"
              entry.target.style.transform = "translateY(0)"
            }, 50)
          }, index * 100)
          cardObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 },
  )

  suggestionCards.forEach((card) => {
    cardObserver.observe(card)
  })

  // Add interactive hover effects to error numbers
  const errorNumbers = document.querySelectorAll(".error-number")
  errorNumbers.forEach((number) => {
    number.addEventListener("mouseenter", () => {
      number.style.transform = "scale(1.1) rotate(5deg)"
      number.style.color = "var(--accent-color)"
    })

    number.addEventListener("mouseleave", () => {
      number.style.transform = "scale(1) rotate(0deg)"
      number.style.color = "var(--primary-color)"
    })
  })
}

// Search functionality
function initSearchFunctionality() {
  const searchInput = document.getElementById("search-input")
  const searchButton = document.getElementById("search-button")

  // Simple search suggestions
  const searchSuggestions = [
    { term: "services", url: "services.html", title: "Our Services" },
    { term: "ptaas", url: "ptaas.html", title: "Penetration Testing as a Service" },
    { term: "compliance", url: "security-grc.html#frameworks", title: "Compliance Services" },
    { term: "about", url: "about.html", title: "About Us" },
    { term: "contact", url: "contact.html", title: "Contact Us" },
    { term: "devsecops", url: "devsecops.html", title: "Complixen DevSecOps Platform" },
    { term: "platform", url: "devsecops.html", title: "Complixen DevSecOps Platform" },
    { term: "vciso", url: "vciso.html", title: "Virtual CISO (vCISO)" },
    { term: "penetration testing", url: "ptaas.html", title: "Penetration Testing as a Service" },
    { term: "gdpr", url: "security-grc.html", title: "GDPR Compliance" },
    { term: "iso 27001", url: "security-grc.html#frameworks", title: "ISO 27001" },
    { term: "soc 2", url: "security-grc.html#frameworks", title: "SOC 2" },
    { term: "hipaa", url: "security-grc.html#frameworks", title: "HIPAA Compliance" },
  ]

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim()

    if (!query) {
      showSearchMessage("Please enter a search term", "warning")
      return
    }

    // Find matching suggestions
    const matches = searchSuggestions.filter(
      (suggestion) => suggestion.term.toLowerCase().includes(query) || suggestion.title.toLowerCase().includes(query),
    )

    if (matches.length > 0) {
      // Redirect to the first match
      window.location.href = matches[0].url
    } else {
      // Show no results message
      showSearchMessage(`No results found for "${query}". Try searching for services, about, or contact.`, "info")
    }
  }

  function showSearchMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector(".search-message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create new message
    const messageEl = document.createElement("div")
    messageEl.className = `search-message search-message--${type}`
    messageEl.textContent = message
    messageEl.style.cssText = `
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      background: ${type === "warning" ? "#fff3cd" : "#d1ecf1"};
      color: ${type === "warning" ? "#856404" : "#0c5460"};
      border: 1px solid ${type === "warning" ? "#ffeaa7" : "#bee5eb"};
      animation: fadeIn 0.3s ease;
    `

    searchInput.parentNode.appendChild(messageEl)

    // Remove message after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.opacity = "0"
        setTimeout(() => {
          if (messageEl.parentNode) {
            messageEl.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Search on button click
  searchButton.addEventListener("click", performSearch)

  // Search on Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch()
    }
  })

  // Add search input animations
  searchInput.addEventListener("focus", () => {
    searchInput.style.transform = "scale(1.02)"
    searchInput.style.boxShadow = "0 0 0 3px rgba(0, 169, 224, 0.1)"
  })

  searchInput.addEventListener("blur", () => {
    searchInput.style.transform = "scale(1)"
    searchInput.style.boxShadow = ""
  })

  // Auto-complete suggestions (simple implementation)
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase()

    if (query.length > 2) {
      const matches = searchSuggestions
        .filter((suggestion) => suggestion.term.toLowerCase().includes(query))
        .slice(0, 3)

      if (matches.length > 0) {
        // You could implement a dropdown here
        // For now, we'll just update the placeholder
        searchInput.setAttribute("title", `Suggestions: ${matches.map((m) => m.title).join(", ")}`)
      }
    }
  })
}

// Navigation buttons
function initNavigationButtons() {
  const goBackButton = document.getElementById("go-back")

  goBackButton.addEventListener("click", () => {
    // Add loading animation
    goBackButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12l4-4 4 4"/>
      </svg>
      Going back...
    `
    goBackButton.disabled = true

    // Go back in history or to home if no history
    setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = "index.html"
      }
    }, 500)
  })

  // Add button hover effects
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      const icon = button.querySelector("svg")
      if (icon) {
        icon.style.transform = "translateX(4px)"
      }
    })

    button.addEventListener("mouseleave", () => {
      const icon = button.querySelector("svg")
      if (icon) {
        icon.style.transform = "translateX(0)"
      }
    })
  })
}

// Add some fun easter eggs
document.addEventListener("DOMContentLoaded", () => {
  let clickCount = 0
  const errorIcon = document.querySelector(".error-icon")

  if (errorIcon) {
    errorIcon.addEventListener("click", () => {
      clickCount++

      if (clickCount === 5) {
        // Easter egg: show a fun message
        const message = document.createElement("div")
        message.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--accent-color);
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          z-index: 10000;
          animation: bounce 0.5s ease;
        `
        message.textContent = "🎉 You found the easter egg! Our security is better than our hide-and-seek skills!"

        document.body.appendChild(message)

        setTimeout(() => {
          message.style.opacity = "0"
          setTimeout(() => {
            document.body.removeChild(message)
          }, 300)
        }, 3000)

        clickCount = 0
      }
    })
  }
})
