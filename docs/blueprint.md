# **App Name**: Regenera Comunicación

## Core Features:

- Dynamic Content System: Implement a system for rendering news, articles, and interviews from Markdown files dynamically on the 'Resonancia' page, using a serverless function to fetch content.
- Decap CMS Integration: Integrate Decap CMS for easy management and publishing of news, articles, and interview content, structured via a 'config.yml' file for various fields.
- Secure Administrator Login: Provide a custom login interface leveraging Netlify Identity for secure authentication, ensuring only authorized users can access the Decap CMS admin panel.
- Static Narrative Pages: Efficiently render the core informational pages ('Inicio', 'Conciencia', 'Experiencia', 'Acción', 'Coherencia', 'Contacto') with predefined narrative content and layout.
- Rich Media Embeds: Allow seamless embedding and display of Spotify podcast episodes and YouTube videos directly within the content pages, particularly on 'Resonancia' and 'Conciencia'.
- Responsive Design & Navigation: Ensure the application provides an optimal viewing experience across desktop and mobile devices, featuring a responsive navigation menu and content grids as specified in the layout guidelines.
- Contact Form: Implement a functional contact form on the 'Contacto' page for direct inquiries, capturing sender's name, email, organization, and message.

## Style Guidelines:

- Primary color (Warm Terracota): #C05A3B. Chosen for its earthy warmth, suggesting honesty, groundedness, and avoiding typical 'greenwashing' tones.
- Background color (Subtle Warm White): #F9F4F2. A very light, heavily desaturated hue derived from the primary color, providing a clean and elegant base that rests the eye.
- Accent color (Deep Blue): #1A4B6B. Provides depth, professionalism, and a sophisticated cool-warm contrast to the primary terracota, aligning with a trusted, coherent brand identity.
- Dark text: #1F2A3A. Muted text: #5A6B7C. Quote block background: #F0F2F5. These contribute to legibility and a refined aesthetic.
- Headings (H1, H2, H3): 'Playfair Display' (serif), an elegant font with high contrast lines, contributing to a high-end, fashionable feel for titles.
- Body text, navigation, and buttons: 'Inter' (sans-serif), a neutral and objective font ensuring excellent legibility and a modern, professional appearance.
- Use fine-line, simple icons (e.g., from FontAwesome or similar libraries), utilizing accent colors to maintain consistency and a minimalist, elegant look.
- Header will be fixed, logo/name left, navigation links right, using a hamburger menu on mobile. Content will use grid layouts (2-3 columns on desktop, 1 on mobile) with ample padding (80px between sections, 40px between blocks) for a clean, spacious feel. Narrative blocks will have a neutral background and be centered, with maximum width 800px.
- Each page will feature a 'Hero' section with title/subtitle and a content grid, concluding with clear navigation buttons '← Capítulo anterior' and 'Siguiente capítulo →' between narrative sections. Footer will contain copyright and LinkedIn link.
- Implement subtle transition effects on navigation and button hovers to enhance user interaction and convey a smooth, modern experience. Smooth scrolling should be used when navigating to internal anchor points.