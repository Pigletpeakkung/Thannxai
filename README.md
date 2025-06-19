# ThannxAI Website

A human-centered AI platform focused on empathetic communication and cross-cultural understanding. This repository contains the complete website for ThannxAI, showcasing our mission to create AI tools that amplify human connection rather than replace it.

## Portfolio Screenshots

## 🌟 Project Overview

ThannxAI represents a new approach to artificial intelligence—one that prioritizes empathy, cultural sensitivity, and human dignity. Our website serves as both a showcase of our technology and a testament to our values of authentic, meaningful digital communication.

### Key Features

- **Human-Centered Design**: Every element prioritizes user experience and emotional connection
- **Cross-Cultural Intelligence**: Built with global accessibility and cultural sensitivity in mind
- **Empathetic AI Showcase**: Interactive demos of our emotion-aware communication tools
- **Research-Driven Content**: Transparent sharing of our findings and methodologies
- **Community-Focused**: Multiple engagement points for developers, researchers, and users

## 🚀 Live Demo

Visit our live website: [https://thannxai.com](https://thannxai.com)

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic, accessible markup
- **CSS3**: Modern styling with Tailwind CSS framework
- **JavaScript (ES6+)**: Interactive features and animations
- **GSAP**: Advanced animations and scroll-triggered effects

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI elements
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant

### Performance & SEO
- **Progressive Web App (PWA)**: Offline capability and app-like experience
- **Optimized Assets**: Compressed images and efficient loading
- **Structured Data**: Rich snippets for search engines
- **Core Web Vitals**: Optimized for Google's performance metrics

## 📁 Project Structure

```
thannxai-website/
├── index.html                 # Main landing page
├── css/
│   ├── styles.css            # Main stylesheet
│   ├── animate.css           # Custom animations
│   └── components.css        # Component-specific styles
├── js/
│   ├── script.js             # Main JavaScript functionality
│   ├── animate.js            # Animation controllers
│   ├── pwa.js               # Progressive Web App features
│   └── components/
│       ├── navigation.js     # Navigation functionality
│       ├── demo.js          # Interactive demo features
│       └── forms.js         # Form handling and validation
├── images/
│   ├── hero/                # Hero section images
│   ├── team/                # Team member photos
│   ├── projects/            # Project screenshots
│   └── testimonials/        # User testimonial photos
├── icons/                   # PWA icons and favicons
├── docs/                    # Documentation files
├── manifest.json            # PWA manifest
├── sw.js                   # Service worker
└── README.md               # This file
```

## 🎨 Design Philosophy

### Visual Identity
- **Color Palette**: Consciousness-inspired gradients (indigo, purple, blue)
- **Typography**: Inter for body text, Playfair Display for headings
- **Iconography**: Emotion and connection-focused symbols
- **Animations**: Subtle, meaningful micro-interactions

### User Experience Principles
1. **Empathy First**: Every interaction considers emotional context
2. **Cultural Sensitivity**: Inclusive design for global audiences
3. **Transparency**: Clear communication about AI capabilities and limitations
4. **Accessibility**: Usable by people of all abilities
5. **Performance**: Fast, efficient, and reliable

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML, CSS, and JavaScript
- Text editor or IDE (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thannxai/website.git
   cd thannxai-website
   ```

2. **Install dependencies** (if using build tools)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in browser**
   Navigate to `http://localhost:8000`

### Development Workflow

1. **Make changes** to HTML, CSS, or JavaScript files
2. **Test locally** in multiple browsers and devices
3. **Validate accessibility** using tools like axe-core
4. **Optimize performance** using Lighthouse
5. **Commit changes** with descriptive messages
6. **Deploy** to staging for review

## 🎯 Key Sections

### 1. Hero Section
- Consciousness-inspired animations
- Dynamic typing effect showcasing AI applications
- Clear value proposition and call-to-action

### 2. Founder's Story
- Personal narrative driving the mission
- Cultural background and lived experiences
- Authentic connection with visitors

### 3. Solutions Showcase
- Interactive demos of AI tools
- Real-world use cases and applications
- Technical capabilities without jargon

### 4. Research & Insights
- Published papers and findings
- Thought leadership content
- Transparent methodology sharing

### 5. Community Hub
- Developer resources and APIs
- Research collaboration opportunities
- User testimonials and success stories

### 6. Contact & Engagement
- Multiple communication channels
- Partnership opportunities
- Newsletter and community signup

## 🔧 Customization

### Styling
```css
/* Custom CSS variables for easy theming */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #3b82f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}
```

### JavaScript Configuration
```javascript
// Animation settings
const animationConfig = {
  duration: 1000,
  easing: "power2.out",
  stagger: 0.1
};

// API endpoints
const apiConfig = {
  demo: "/api/demo",
  contact: "/api/contact",
  newsletter: "/api/newsletter"
};
```

## 📱 Progressive Web App Features

- **Offline Functionality**: Core content available without internet
- **App-like Experience**: Installable on mobile and desktop
- **Push Notifications**: Updates on new research and features
- **Background Sync**: Form submissions when connection restored

## 🔍 SEO & Analytics

### Search Engine Optimization
- Semantic HTML structure
- Meta tags and Open Graph data
- Structured data markup (JSON-LD)
- Sitemap and robots.txt
- Core Web Vitals optimization

### Analytics Integration
- Google Analytics 4
- Custom event tracking
- User journey analysis
- Performance monitoring

## 🧪 Testing

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Run performance tests
npm run test:performance

# Run cross-browser tests
npm run test:browsers
```

### Manual Testing Checklist
- [ ] Responsive design on all devices
- [ ] Accessibility with screen readers
- [ ] Form validation and submission
- [ ] Animation performance
- [ ] PWA installation flow

## 🚀 Deployment

### Production Build
```bash
# Optimize assets
npm run build

# Generate service worker
npm run sw:generate

# Deploy to hosting platform
npm run deploy
```

### Hosting Recommendations
- **Netlify**: Automatic deployments from Git
- **Vercel**: Optimized for modern web apps
- **GitHub Pages**: Simple static hosting
- **AWS S3 + CloudFront**: Scalable enterprise solution

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Guidelines
1. Follow semantic HTML practices
2. Use CSS custom properties for theming
3. Write accessible JavaScript
4. Test across multiple browsers and devices
5. Optimize for performance

### Code Style
- Use Prettier for code formatting
- Follow ESLint rules for JavaScript
- Use meaningful commit messages
- Document complex functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Human-centered design principles
- **Technical Stack**: Open-source community contributions
- **Content**: Research from cross-cultural communication studies
- **Community**: Early adopters and feedback providers

## 📞 Support & Contact

### Technical Support
- **Email**: dev@thannxai.com
- **Discord**: [ThannxAI Community](https://discord.gg/thannxai)
- **GitHub Issues**: [Report bugs or request features](https://github.com/thannxai/website/issues)

### Business Inquiries
- **Email**: hello@thannxai.com
- **LinkedIn**: [ThannxAI Company Page](https://linkedin.com/company/thannxai)
- **Calendar**: [Schedule a meeting](https://calendly.com/thannxai)

## 🔮 Roadmap

### Q1 2024
- [ ] Enhanced demo functionality
- [ ] Multi-language support
- [ ] Advanced accessibility features
- [ ] Performance optimizations

### Q2 2024
- [ ] Interactive research visualizations
- [ ] Community platform integration
- [ ] Mobile app companion
- [ ] API documentation portal

### Q3 2024
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations
- [ ] Enterprise solutions showcase

## 📊 Performance Metrics

### Current Scores
- **Lighthouse Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **PWA**: Fully compliant

### Key Performance Indicators
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

**Built with consciousness and care by the ThannxAI team** 🧠💝

*Creating AI that amplifies human empathy, one conversation at a time.*


# Thanatsitt's Portfolio

A portfolio website for Thanatsitt Santisamranwilai, showcasing Thai heritage and modern technology. Built with HTML, Tailwind CSS, Alpine.js, GSAP, Font Awesome, and EmailJS, with Progressive Web App (PWA) support.

## Features
- Cosmic-themed design with glass-morphism and animations.
- Responsive layout for desktop and mobile.
- Contact form powered by EmailJS.
- PWA for offline access and installability.
- Deployed on Netlify with continuous deployment.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Pigletpeakkung/thanatsitt-portfolio.git
