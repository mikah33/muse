/**
 * Pre-built page templates for photography portfolio
 * Monotone theme with professional photography-focused content
 */

// Block type definitions
export type BlockType = 'hero' | 'text' | 'image' | 'cta' | 'gallery' | 'contact'

export interface PageBlock {
  id: string
  type: BlockType
  content: {
    title?: string
    subtitle?: string
    body?: string
    imageUrl?: string
    imageAlt?: string
    buttonText?: string
    buttonLink?: string
    backgroundColor?: string
    textColor?: string
    alignment?: 'left' | 'center' | 'right'
    height?: 'small' | 'medium' | 'large' | 'full'
  }
  order: number
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  category: 'marketing' | 'portfolio' | 'information'
  previewImage: string
  blocks: PageBlock[]
}

/**
 * ABOUT PAGE TEMPLATE
 * Professional photographer biography and approach
 */
const aboutPageTemplate: PageTemplate = {
  id: 'about-page',
  name: 'About Page',
  description: 'Professional photographer biography with workspace and philosophy sections',
  category: 'information',
  previewImage: '/templates/about-preview.jpg',
  blocks: [
    {
      id: 'about-hero',
      type: 'hero',
      order: 1,
      content: {
        title: 'Behind the Lens',
        subtitle: 'Capturing moments that tell your story',
        imageUrl: 'https://images.unsplash.com/photo-1554844453-7ea2a562a6c8?w=1200&h=800&fit=crop',
        imageAlt: 'Photographer with camera',
        height: 'large',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        alignment: 'center',
      },
    },
    {
      id: 'about-bio',
      type: 'text',
      order: 2,
      content: {
        title: 'A Passion for Photography',
        body: `With over a decade of experience capturing life's most precious moments, I've dedicated my career to the art of visual storytelling. My journey began with a simple 35mm film camera and an insatiable curiosity about the world around me.

What started as a hobby quickly evolved into a calling. I believe that photography is more than just clicking a shutter—it's about understanding light, emotion, and the fleeting moments that define our lives. Each session is an opportunity to create something timeless, something that will be cherished for generations.

My approach is deeply personal and collaborative. I take the time to understand your vision, your story, and what matters most to you. Whether it's the joy of a wedding day, the intimacy of a family portrait, or the power of a professional headshot, my goal is to capture authenticity in every frame.`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'left',
      },
    },
    {
      id: 'about-workspace',
      type: 'image',
      order: 3,
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1556139966-56c3df1ddc63?w=1200&h=800&fit=crop',
        imageAlt: 'Professional photography studio workspace',
        backgroundColor: '#f5f5f5',
        height: 'medium',
      },
    },
    {
      id: 'about-philosophy',
      type: 'text',
      order: 4,
      content: {
        title: 'My Creative Philosophy',
        body: `Photography is an art of observation. It's about finding beauty in the ordinary, emotion in the everyday, and stories in the smallest details.

I work with natural light whenever possible, believing that authentic moments happen when people feel comfortable and relaxed. My style is characterized by clean compositions, thoughtful use of negative space, and a timeless monotone aesthetic that allows the subject to speak for itself.

Every project is approached with fresh eyes and creative vision. I don't believe in cookie-cutter solutions—your story is unique, and your photographs should be too. From the initial consultation to the final delivery, I'm committed to creating images that resonate with authenticity and artistic integrity.

My work has been featured in numerous publications and exhibitions, but my greatest satisfaction comes from the relationships I build with my clients and the memories we create together.`,
        backgroundColor: '#000000',
        textColor: '#ffffff',
        alignment: 'left',
      },
    },
  ],
}

/**
 * CONTACT PAGE TEMPLATE
 * Professional contact information and inquiry form
 */
const contactPageTemplate: PageTemplate = {
  id: 'contact-page',
  name: 'Contact Page',
  description: 'Professional contact page with inquiry call-to-action',
  category: 'information',
  previewImage: '/templates/contact-preview.jpg',
  blocks: [
    {
      id: 'contact-hero',
      type: 'hero',
      order: 1,
      content: {
        title: 'Let\'s Create Together',
        subtitle: 'I\'d love to hear about your project',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=600&fit=crop',
        imageAlt: 'Professional camera equipment',
        height: 'medium',
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        alignment: 'center',
      },
    },
    {
      id: 'contact-info',
      type: 'text',
      order: 2,
      content: {
        title: 'Get in Touch',
        body: `Whether you're planning a wedding, need professional portraits, or have a creative project in mind, I'm here to help bring your vision to life.

**Studio Location**
123 Photography Lane
Creative District
Your City, ST 12345

**Contact Information**
Email: hello@yourphotography.com
Phone: (555) 123-4567

**Studio Hours**
Monday - Friday: 10am - 6pm
Saturday: By appointment only
Sunday: Closed

I typically respond to all inquiries within 24 hours. For urgent matters, please don't hesitate to call the studio directly.`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'left',
      },
    },
    {
      id: 'contact-cta',
      type: 'cta',
      order: 3,
      content: {
        title: 'Ready to Book Your Session?',
        subtitle: 'Let\'s discuss your project and create something beautiful together',
        buttonText: 'SEND INQUIRY',
        buttonLink: 'mailto:hello@yourphotography.com',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        alignment: 'center',
      },
    },
  ],
}

/**
 * SERVICES PAGE TEMPLATE
 * Photography services with detailed descriptions
 */
const servicesPageTemplate: PageTemplate = {
  id: 'services-page',
  name: 'Services Page',
  description: 'Comprehensive photography services showcase with booking call-to-action',
  category: 'marketing',
  previewImage: '/templates/services-preview.jpg',
  blocks: [
    {
      id: 'services-hero',
      type: 'hero',
      order: 1,
      content: {
        title: 'Photography Services',
        subtitle: 'Timeless imagery for life\'s most important moments',
        imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=600&fit=crop',
        imageAlt: 'Professional photography equipment',
        height: 'medium',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        alignment: 'center',
      },
    },
    {
      id: 'services-wedding',
      type: 'text',
      order: 2,
      content: {
        title: 'Wedding Photography',
        body: `Your wedding day is one of the most significant moments of your life, and I'm honored to be there to capture it. My wedding photography approach is unobtrusive yet comprehensive, ensuring that every emotional moment, every loving glance, and every joyful celebration is preserved.

**What's Included:**
• Full-day coverage (up to 10 hours)
• Engagement session
• Two professional photographers
• Online gallery with 500+ edited images
• Print release for personal use
• Custom USB drive with high-resolution files

I understand that every wedding is unique, which is why I work closely with couples to understand their vision and preferences. From intimate elopements to grand celebrations, I bring the same level of dedication and artistic vision to every wedding I photograph.

My monotone editing style creates timeless, elegant images that focus on emotion and authenticity. These aren't just wedding photos—they're heirlooms that will be treasured for generations.`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'left',
      },
    },
    {
      id: 'services-wedding-image',
      type: 'image',
      order: 3,
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
        imageAlt: 'Wedding couple photography',
        backgroundColor: '#f5f5f5',
        height: 'large',
      },
    },
    {
      id: 'services-portrait',
      type: 'text',
      order: 4,
      content: {
        title: 'Portrait Photography',
        body: `Great portraits capture more than just a face—they reveal personality, confidence, and character. Whether you need professional headshots, family portraits, or personal branding images, I create photographs that make an impact.

**Portrait Sessions Include:**
• Pre-session consultation to discuss goals and vision
• Professional studio or location of your choice
• Wardrobe and styling guidance
• 1-2 hour photography session
• Online gallery with 30+ edited images
• Print and digital licensing options

My portrait sessions are relaxed and collaborative. I guide you through natural poses and expressions that feel authentic rather than forced. The result is a collection of images that you'll be proud to share.

For professionals, my headshots have helped countless clients make powerful first impressions. For families, I create timeless portraits that capture your loved ones exactly as they are in this moment.`,
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        alignment: 'left',
      },
    },
    {
      id: 'services-portrait-image',
      type: 'image',
      order: 5,
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
        imageAlt: 'Professional portrait photography',
        backgroundColor: '#000000',
        height: 'medium',
      },
    },
    {
      id: 'services-commercial',
      type: 'text',
      order: 6,
      content: {
        title: 'Commercial & Editorial',
        body: `Strong visual content is essential for brands and publications. I work with businesses, magazines, and creative agencies to produce compelling imagery that tells stories and drives engagement.

**Commercial Services:**
• Product photography
• Corporate headshots and team photos
• Architectural and interior photography
• Editorial and lifestyle shoots
• Brand photography packages

Each commercial project is tailored to your specific needs and brand guidelines. I bring a creative eye and professional execution to every assignment, ensuring your visual content stands out in a crowded marketplace.

From concept development to final delivery, I handle all aspects of the photography process. My commercial work has been featured in leading publications and has helped brands connect with their audiences through powerful visual storytelling.`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'left',
      },
    },
    {
      id: 'services-cta',
      type: 'cta',
      order: 7,
      content: {
        title: 'Ready to Book Your Session?',
        subtitle: 'Custom packages available for all photography needs',
        buttonText: 'SCHEDULE CONSULTATION',
        buttonLink: '/contact',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        alignment: 'center',
      },
    },
  ],
}

/**
 * Export all available page templates
 */
export const PAGE_TEMPLATES: PageTemplate[] = [
  aboutPageTemplate,
  contactPageTemplate,
  servicesPageTemplate,
]

/**
 * Utility function to get a template by ID
 */
export function getTemplateById(id: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find(template => template.id === id)
}

/**
 * Utility function to get templates by category
 */
export function getTemplatesByCategory(category: PageTemplate['category']): PageTemplate[] {
  return PAGE_TEMPLATES.filter(template => template.category === category)
}

/**
 * Utility function to create a new page from a template
 */
export function createPageFromTemplate(
  templateId: string,
  customizations?: {
    title?: string
    slug?: string
  }
): {
  title: string
  slug: string
  blocks: PageBlock[]
} | null {
  const template = getTemplateById(templateId)
  if (!template) return null

  return {
    title: customizations?.title || template.name,
    slug: customizations?.slug || template.id,
    blocks: JSON.parse(JSON.stringify(template.blocks)), // Deep clone
  }
}
