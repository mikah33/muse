import Script from 'next/script'

const SEOSchema = () => {
  const siteUrl = 'https://modelmusestudio.com'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Model Muse Studio',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Professional photography studio specializing in headshots, portfolios, and creative photography services in Fayetteville, NC.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fayetteville',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['en'],
    },
    sameAs: [
      'https://www.facebook.com/modelmusestudio',
      'https://www.instagram.com/modelmusestudio',
      'https://twitter.com/modelmusestudio',
      'https://www.linkedin.com/company/modelmusestudio',
    ],
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: 'Model Muse Studio',
    image: `${siteUrl}/studio-image.jpg`,
    url: siteUrl,
    telephone: '+1-XXX-XXX-XXXX',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Photography Lane',
      addressLocality: 'Fayetteville',
      addressRegion: 'NC',
      postalCode: '28301',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.0527,
      longitude: -78.8784,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  }

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#professionalservice`,
    name: 'Model Muse Studio Photography Services',
    description: 'Professional photography services including headshots, portfolios, corporate photography, and creative sessions.',
    url: siteUrl,
    image: `${siteUrl}/services-image.jpg`,
    telephone: '+1-XXX-XXX-XXXX',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fayetteville',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 35.0527,
        longitude: -78.8784,
      },
      geoRadius: '50000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Photography Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Professional Headshots',
            description: 'Professional headshot photography for actors, models, and corporate professionals.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Portfolio Photography',
            description: 'Complete portfolio sessions for models, actors, and creative professionals.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Real Estate Photography',
            description: 'Professional real estate photography for properties and commercial spaces.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Team Photography',
            description: 'Corporate team and group photography for businesses and organizations.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Family Photography',
            description: 'Family portrait sessions capturing special moments and memories.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pet Photography',
            description: 'Professional pet photography sessions for your beloved companions.',
          },
        },
      ],
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What types of photography services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer professional headshots, portfolio photography, corporate photography, family portraits, pet photography, real estate photography, and creative sessions tailored to your needs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Model Muse Studio located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are located in Fayetteville, North Carolina, and serve the surrounding areas within a 50-mile radius.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I book a photography session?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can book a session through our website booking form, by calling us directly, or by sending an email inquiry. We will respond within 24 hours to confirm availability.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I bring to my photoshoot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend bringing multiple outfit options, any props or accessories you want included, and arriving with clean, styled hair and makeup. We will provide detailed preparation guidelines upon booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a typical photo session take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Session duration varies by service type. Headshot sessions typically take 1-2 hours, while full portfolio sessions can range from 2-4 hours. We will discuss timing when scheduling your appointment.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${siteUrl}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Portfolio',
        item: `${siteUrl}/portfolio`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Contact',
        item: `${siteUrl}/contact`,
      },
    ],
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="professional-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="beforeInteractive"
      />
    </>
  )
}

export default SEOSchema
