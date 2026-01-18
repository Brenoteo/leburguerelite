# LeBurgerElite - AI Coding Agent Instructions

## 🎯 Project Overview

**LeBurgerElite** is a modern, fully-responsive e-commerce website for an artisan burger restaurant built with vanilla HTML5, CSS3, and JavaScript ES6+. Focus on performance (lazy loading, debounce/throttle), accessibility (WCAG 2.1 AA), and user experience.

**Stack**: HTML5 (semantic), CSS3 (variables, Grid/Flexbox), JavaScript (vanilla ES6+, no frameworks)

---

## 🏗️ Architecture

### Core Modules

1. **Cart Manager** (`src/components/cart/cart.js`)
   - Single-responsibility class managing shopping cart state and UI
   - Items stored in `this.items` array with: `{name, quantity, price, image, notes}`
   - **Key methods**: `addItem()`, `removeItem()`, `updateQuantity()`, `showCartModal()`, `generateWhatsAppMessage()`
   - Modal-based checkout UI created dynamically; cleaned on page unload
   - Integrates directly with WhatsApp via message generation (no API backend)

2. **Mobile Menu** (`src/scripts/navigation.js` - `MobileMenu` class)
   - Hamburger menu toggle with aria-expanded state management
   - Closes on scroll or outside clicks
   - Event delegation pattern with proper cleanup (`destroy()` method)

3. **Sticky Navigation** (`src/scripts/navigation.js` - `StickyMenuNavigation` class)
   - Sticky header with auto-detection of active section
   - Throttled scroll handler (60fps) for performance
   - Links scroll to section offsets smoothly

4. **Lazy Image Loader** (`src/scripts/lazy-loading.js`)
   - Intersection Observer API (primary) with fallback for legacy browsers
   - Images use `data-src` attribute; actual `src` attribute loads placeholder
   - Loads with 50px margin before entering viewport, 10% visibility threshold
   - Two CSS states: `.lazy-loading` (shimmer animation) → `.lazy-loaded` (blur fade)
   - **Exceptions**: Logo and small icons load immediately (`src` attribute)

### Data Flow

```
User clicks menu item → addItem() → items array updated → updateUI() 
→ cart counter increments → showFeedback() modal appears
↓
User clicks cart icon → showCartModal() → renders modal with items 
→ binds quantity/notes listeners → generates WhatsApp message on submit
```

---

## 🎨 Styling Architecture

**CSS structure** (imported in `main.css`):
- `base/reset.css` - normalize defaults
- `base/variable.css` - CSS custom properties (colors, spacing, fonts)
- `components/*.css` - scoped component styles (cart, lazy-loading, checkout, footer)
- `pages/*.css` - page-specific overrides (index, contact)

**Key patterns**:
- CSS variables define design system (use `:root { --var: value }`)
- BEM-like naming for modifiers: `.cart-item`, `.cart-item--loading`
- Grid/Flexbox for responsive layouts (no absolute positioning)
- Mobile-first media queries

---

## ⚡ Performance Patterns

### Debounce/Throttle Usage
- **Debounce**: Cart notes textarea (prevents rapid updates) - used in `addItem()`
- **Throttle**: Scroll events (mobile menu close, sticky nav) - 16ms (60fps) or 100ms
- Import at module level:
  ```javascript
  function debounce(func, wait) { /* ... */ }
  function throttle(func, limit) { /* ... */ }
  ```

### Lazy Loading Rules
- **Always lazy**: Product images (menu items) → use `data-src`
- **Never lazy**: Logo, icons, hero background → use `src`
- Placeholder SVG is base64-encoded in `LazyImageLoader.placeholder`
- Observers must call `observer.unobserve()` after loading to free memory

### Event Optimization
- Event delegation: Click on `.menu-item` checked via `element.closest()` in one listener
- Stop propagation on cart clicks: `e.stopPropagation()` prevents event bubbling
- Cleanup on `beforeunload`: Removes stale modals to prevent memory leaks

---

## 🔄 JavaScript Conventions

### Class Structure
Each module exports one main class with `initialize()` or `init()` method:
```javascript
class ModuleName {
  constructor() { /* setup state */ }
  initialize() { /* bind listeners */ }
  methodName() { /* feature */ }
}
new ModuleName(); // Auto-instantiate
```

### Data Attributes for Configuration
- `data-name` - product/item name
- `data-price` - item price (float)
- `data-src` - image lazy-load source
- `data-index` - array index reference

### Accessibility Standards (WCAG 2.1 AA)
- `aria-label` on buttons: `aria-label="Abrir menu"`
- `aria-expanded` on toggles: reflects open/closed state
- Semantic HTML: `<button>` for actions, `<a>` for navigation
- Alt text on all images
- `role="navigation"`, `role="banner"` on landmarks

---

## 📱 Responsive Breakpoints

Media queries typically follow:
- **Mobile-first**: Base styles for mobile, add desktop styles in `@media (min-width: 768px)`
- **Common widths**: 320px (mobile), 768px (tablet), 1024px (desktop)
- Use CSS variables for consistent spacing: `var(--spacing-unit)`

---

## 🚀 Development Workflows

### Adding a New Menu Item
1. Add HTML: `<div class="menu-item" data-name="Item" data-price="12.50"><img data-src="path" alt="..."></div>`
2. No JS needed—`CartManager.addItem()` reads data attributes via `element.dataset`
3. Lazy loading auto-applies to `img[data-src]`

### Modifying Cart Behavior
- Edit `CartManager` methods (addItem, generateModalContent, etc.)
- Test via modal → verify WhatsApp message format
- Check cart counter updates with `updateUI()` and pulse animation

### Debugging Performance
- Check DevTools Performance tab during scroll/lazy-load
- Monitor throttle/debounce intervals in timeline
- Verify lazy images load only when visible (use Network tab filter)

---

## 🔧 Key Files Reference

| File | Purpose |
|------|---------|
| `index.html` | Main page + cart modal template |
| `src/components/cart/cart.js` | Cart state & UI logic (main feature) |
| `src/scripts/navigation.js` | Mobile menu + sticky nav |
| `src/scripts/lazy-loading.js` | Image lazy-load with Intersection Observer |
| `src/styles/base/variable.css` | Design tokens (colors, fonts, spacing) |
| `src/styles/components/cart.css` | Cart modal & checkout styles |
| `README.md` | Project overview & features |
| `LAZY_LOADING_README.md` | Lazy loading implementation details |

---

## ⚠️ Common Pitfalls

1. **Forgetting `data-src` on images** → They won't lazy-load (will load immediately)
2. **Not binding methods in constructors** → `this` context gets lost in callbacks
3. **Missing event cleanup** → Memory leaks; always remove listeners on destroy
4. **Skipping `e.stopPropagation()`** → Event bubbling triggers multiple listeners
5. **Synchronous image loading in cart** → Use cached image references from initial addItem()

---

## 🎯 Quick Start for New Features

1. **Read data from HTML attributes** → No JSON APIs needed
2. **Manage state in a class** → Keep UI in sync via `updateUI()`
3. **Use debounce/throttle for events** → Prevents performance degradation
4. **Test in multiple browsers** → Especially lazy-load fallback (no IntersectionObserver)
5. **Maintain WCAG 2.1 AA** → Add aria-* and semantic HTML

---

**Last Updated**: January 18, 2025  
**Maintained by**: LeBurgerElite Dev Team
