export default {
  // Navigation
  nav: {
    home: "Home",
    diseaseDetection: "Disease Detection",
    aiAssistant: "AI Assistant",
    community: "Community",
    expertConsultation: "Expert Consultation",
    news: "News",
    marketplace: "Marketplace",
    contractFarming: "Contract Farming",
    verticalFarming: "Vertical Farming",
    developers: "Developers",
    geminiVoice: "Agro voice assistant",
    },

  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    filter: "Filter",
    apply: "Apply",
    clear: "Clear",
    close: "Close",
    next: "Next",
    previous: "Previous",
    viewMore: "View More",
    learnMore: "Learn More",
    getStarted: "Get Started",
    contact: "Contact",
    phone: "Phone",
    email: "Email",
    location: "Location",
    date: "Date",
    time: "Time",
    price: "Price",
    quantity: "Quantity",
    category: "Category",
    description: "Description",
    name: "Name",
    title: "Title",
    status: "Status",
    available: "Available",
    sold: "Sold",
    expired: "Expired",
    organic: "Organic",
    fresh: "Fresh",
    premium: "Premium",
    featured: "Featured",
    negotiable: "Negotiable",
  },

  // Home Page
  home: {
    title: "Welcome to Agro-Mentor",
    subtitle:
      "Empowering farmers with modern agricultural technology and expert guidance",
    heroDescription:
      "Your complete agricultural companion for disease detection, expert consultation, community support, and marketplace access.",
    features: {
      diseaseDetection: {
        title: "AI Disease Detection",
        description:
          "Upload crop images for instant disease identification and treatment recommendations using advanced AI technology.",
      },
      geminiVoice: {
        title: "Agro Voice Assistant",
        description:
          "Hands-free voice assistant for farming with multilingual support (Kannada/English) and voice responses.",
      },
      aiAssistant: {
        title: "AI Assistant",
        description:
          "24/7 intelligent farming assistant for instant answers to agricultural questions and personalized advice.",
      },
      expertConsultation: {
        title: "Expert Consultation",
        description:
          "Connect with agricultural experts for personalized advice and solutions to your farming challenges.",
      },
      community: {
        title: "Community Support",
        description:
          "Join a community of farmers to share experiences, ask questions, and learn from each other.",
      },
      marketplace: {
        title: "Direct Marketplace",
        description:
          "Sell your products directly to buyers without middlemen and get the best prices for your harvest.",
      },
      contractFarming: {
        title: "Contract Farming",
        description:
          "Partner with local companies for guaranteed purchase, input support, and technical guidance for your crops.",
      },
      verticalFarming: {
        title: "Vertical Farming",
        description:
          "Learn about space-efficient vertical farming technologies, setup guides, and local equipment providers in Bengaluru.",
      },
    },
    stats: {
      farmers: "Farmers Connected",
      experts: "Agricultural Experts",
      consultations: "Consultations Completed",
      success: "Success Rate",
    },
    cta: {
      title: "Ready to Start Your Digital Farming Journey?",
      description:
        "Join thousands of farmers who are already benefiting from our platform.",
      button: "Get Started Today",
    },
  },

  // Marketplace
  marketplace: {
    title: "Agricultural Marketplace",
    subtitle:
      "Connect directly with farmers to buy fresh, quality agricultural products at the best prices",
    stats: {
      products: "Products",
      farmers: "Farmers",
      locations: "Locations",
      direct: "Direct",
    },
    featured: "Featured Products",
    premiumSelection: "Premium Selection",
    searchPlaceholder: "Search products...",
    sortBy: {
      latest: "Latest",
      price: "Price",
      name: "Name",
      popular: "Popular",
    },
    filters: {
      title: "Filters",
      search: "Search Products",
      searchPlaceholder: "Search by title, description, or tags",
      category: "Category",
      allCategories: "All categories",
      priceRange: "Price Range (₹)",
      minPrice: "Min",
      maxPrice: "Max",
      location: "Location",
      locationPlaceholder: "Search by location",
      qualityGrade: "Quality Grade",
      anyGrade: "Any grade",
      organicOnly: "Organic Products Only",
      applyFilters: "Apply Filters",
      activeFilters: "Active Filters:",
    },
    product: {
      viewDetails: "View Details",
      contact: "Contact",
      likes: "Likes",
      views: "Views",
      expires: "Expires",
      expired: "Expired",
      minOrder: "Min order: {{quantity}} {{unit}}",
      availableQuantity: "Available: {{quantity}} {{unit}}",
      farmer: "Farmer",
      grade: "Grade {{grade}}",
    },
    addProduct: {
      title: "Add New Product",
      subtitle: "List your agricultural products in the marketplace",
      button: "Sell Product",
      success: "Product added successfully!",
      successDescription: "Your product is now available in the marketplace.",
      error: "Failed to add product",
      errorDescription: "Please try again or contact support.",
      form: {
        basicInfo: "Basic Information",
        productTitle: "Product Title",
        titlePlaceholder: "e.g., Fresh Organic Tomatoes",
        category: "Category",
        selectCategory: "Select category",
        description: "Description",
        descriptionPlaceholder:
          "Describe your product, quality, farming methods...",
        priceAndQuantity: "Price & Quantity",
        price: "Price (₹)",
        unit: "Unit",
        quantity: "Quantity",
        minOrder: "Min Order",
        optional: "Optional",
        location: "Location",
        locationPlaceholder: "e.g., Bengaluru Rural",
        contactPhone: "Contact Phone",
        contactEmail: "Contact Email",
        harvestDate: "Harvest Date",
        expiryDate: "Expiry Date",
        qualityGrade: "Quality Grade",
        organicProduct: "Organic Product",
        priceNegotiable: "Price Negotiable",
        tags: "Tags",
        tagsPlaceholder: "Add tags (e.g., fresh, premium)",
        productImages: "Product Images (Max 5)",
        uploadImages: "Click to upload images or drag and drop",
        tooManyImages: "Too many images",
        maxImagesError: "You can upload maximum 5 images",
        addingProduct: "Adding Product...",
        addProduct: "Add Product",
      },
    },
    empty: {
      title: "No products found",
      description: "Try adjusting your filters or search terms",
      noProducts: "Be the first to list a product in the marketplace!",
      addProduct: "Add Your Product",
    },
  },

  // News
  news: {
    title: "Agricultural Updates",
    latest: "Latest News",
    categories: {
      all: "All News",
      government: "Government Policy",
      weather: "Weather Alert",
      market: "Market News",
      technology: "Technology",
      education: "Education",
      success: "Success Story",
      event: "Event",
    },
    readTime: "{{time}} min read",
    views: "{{count}} views",
    comments: "{{count}} comments",
    tags: "Tags",
    author: "By {{name}}",
    publishedOn: "Published on {{date}}",
  },

  // Expert Consultation
  expert: {
    title: "Expert Consultation",
    subtitle: "Get personalized advice from agricultural experts",
    bookConsultation: "Book Consultation",
    consultationTypes: {
      video: "Video Call",
      phone: "Phone Call",
      chat: "Chat",
    },
    rating: "Rating",
    experience: "{{years}} years experience",
    hourlyRate: "₹{{rate}}/hour",
    responseTime: "Response time: {{time}}",
    availability: "Available {{time}}",
    specialization: "Specialization",
    languages: "Languages",
    consultations: "{{count}} consultations",
    verified: "Verified Expert",
  },

  // Disease Detection
  disease: {
    title: "AI Disease Detection",
    subtitle: "Upload crop images for instant disease identification",
    uploadImage: "Upload Crop Image",
    analyzing: "Analyzing image...",
    results: "Detection Results",
    disease: "Disease",
    confidence: "Confidence",
    severity: "Severity",
    crop: "Crop Type",
    treatment: "Treatment Recommendations",
    prevention: "Prevention Tips",
    severityLevels: {
      low: "Low",
      moderate: "Moderate",
      high: "High",
      critical: "Critical",
    },
  },

  // Community
  community: {
    title: "Farmer Community",
    subtitle: "Connect, share, and learn from fellow farmers",
    createPost: "Create Post",
    posts: "Posts",
    discussions: "Discussions",
    questions: "Questions",
    successStories: "Success Stories",
    events: "Events",
    likes: "{{count}} likes",
    comments: "{{count}} comments",
    shares: "{{count}} shares",
    postedBy: "Posted by {{name}}",
    timeAgo: "{{time}} ago",
  },

  // PWA
  pwa: {
    install: "Install App",
    installPrompt: "Install Agro-Mentor app on your device for quick access",
    installButton: "Install Now",
    installLater: "Maybe Later",
    installInstructions: 'Tap the share button and select "Add to Home Screen"',
    offlineMessage:
      "You are currently offline. Some features may not be available.",
  },

  // Language
  language: {
    title: "Language",
    english: "English",
    kannada: "ಕನ್ನಡ",
    select: "Select Language",
  },

  // Contract Farming
  contractFarming: {
    title: "Contract Farming",
    subtitle:
      "Partner with local companies for guaranteed purchase and farming support",
    partnerships: "Local Partnerships",
    contracts: "Available Contracts",
    benefits: "Contract Benefits",
    requirements: "Requirements",
    apply: "Apply for Contract",
    viewDetails: "View Contract Details",
    companies: {
      title: "Partner Companies",
      subtitle:
        "Trusted local companies offering contract farming opportunities",
    },
    crops: {
      vegetables: "Vegetables",
      fruits: "Fruits",
      grains: "Grains",
      spices: "Spices",
      flowers: "Flowers",
    },
    contractTypes: {
      seasonal: "Seasonal Contract",
      annual: "Annual Contract",
      multiYear: "Multi-Year Contract",
    },
    support: {
      title: "Support Provided",
      seeds: "Quality Seeds & Saplings",
      fertilizers: "Fertilizers & Pesticides",
      technical: "Technical Guidance",
      equipment: "Equipment Support",
      training: "Training Programs",
      guaranteed: "Guaranteed Purchase",
    },
    localCompanies: {
      iffco: {
        name: "IFFCO Kisan",
        description: "Leading cooperative for vegetable and grain contracts",
        crops: "Tomato, Onion, Potato, Wheat",
        minArea: "2 acres minimum",
        support: "Seeds, fertilizers, technical guidance",
      },
      reliance: {
        name: "Reliance Fresh",
        description:
          "Fresh produce supply chain with direct farmer partnerships",
        crops: "Leafy vegetables, Fruits, Herbs",
        minArea: "1 acre minimum",
        support: "Input supply, cold storage, transportation",
      },
      bigBasket: {
        name: "BigBasket Farm",
        description:
          "E-commerce platform connecting farmers to urban consumers",
        crops: "Organic vegetables, Fruits",
        minArea: "0.5 acres minimum",
        support: "Organic certification, premium pricing",
      },
      heritage: {
        name: "Heritage Foods",
        description: "Dairy and food processing company contract farming",
        crops: "Fodder crops, Millets, Pulses",
        minArea: "3 acres minimum",
        support: "Equipment lease, buyback guarantee",
      },
    },
    applications: {
      title: "Your Applications",
      status: {
        pending: "Under Review",
        approved: "Approved",
        rejected: "Rejected",
        active: "Active Contract",
      },
    },
  },

  // Vertical Farming
  verticalFarming: {
    title: "Vertical Farming",
    subtitle:
      "Maximize your yield with space-efficient vertical farming technologies and local Bengaluru solutions",
    technologies: "Farming Technologies",
    providers: "Equipment Providers",
    setup: "Setup Guide",
    benefitsLabel: "Benefits",
    getStarted: "Get Started",
    learnMore: "Learn More",
    contactProvider: "Contact Provider",
    companies: {
      title: "Local Equipment Providers",
      subtitle: "Trusted vertical farming technology providers in Bengaluru",
    },
    systems: {
      hydroponic: "Hydroponic Systems",
      aeroponic: "Aeroponic Systems",
      nft: "NFT (Nutrient Film Technique)",
      deepWater: "Deep Water Culture",
      media: "Media-based Systems",
      stackable: "Stackable Tower Systems",
    },
    crops: {
      leafyGreens: "Leafy Greens",
      herbs: "Herbs & Microgreens",
      tomatoes: "Cherry Tomatoes",
      strawberries: "Strawberries",
      peppers: "Peppers",
      lettuce: "Lettuce Varieties",
    },
    benefits: {
      title: "Why Choose Vertical Farming?",
      spaceEfficient: "Space Efficient",
      spaceDesc: "90% less space required compared to traditional farming",
      yearRound: "Year-round Production",
      yearDesc: "Climate-controlled environment for consistent harvests",
      waterSaving: "Water Conservation",
      waterDesc: "95% less water usage with recirculating systems",
      pesticideFree: "Pesticide-free",
      pesticideDesc: "Controlled environment eliminates need for pesticides",
      higherYield: "Higher Yields",
      yieldDesc: "Up to 365 times more productive than traditional farming",
      qualityControl: "Quality Control",
      qualityDesc: "Consistent quality and faster growth cycles",
    },
    setupGuide: {
      title: "Complete Setup Guide",
      step1: {
        title: "Space Planning",
        description:
          "Assess your available space and choose the right system size",
        details:
          "Indoor space, balcony, terrace, or dedicated room - minimum 4x4 feet required",
      },
      step2: {
        title: "System Selection",
        description:
          "Choose between hydroponic, aeroponic, or media-based systems",
        details: "Consider crops, budget, and maintenance requirements",
      },
      step3: {
        title: "Equipment Installation",
        description:
          "Install grow lights, pumps, timers, and monitoring systems",
        details:
          "LED lights, nutrient pumps, pH meters, and automation systems",
      },
      step4: {
        title: "Crop Selection",
        description:
          "Start with easy crops like lettuce, herbs, and microgreens",
        details: "Gradually expand to tomatoes, peppers, and strawberries",
      },
      step5: {
        title: "Monitoring & Maintenance",
        description:
          "Regular monitoring of pH, nutrients, and environmental conditions",
        details:
          "Daily checks, weekly nutrient changes, and system maintenance",
      },
    },
    localProviders: {
      futurefarms: {
        name: "Future Farms India",
        description:
          "Complete hydroponic and aeroponic solutions for urban farming",
        specialization: "NFT systems, LED grow lights, automation",
        location: "Electronic City, Bengaluru",
        experience: "8+ years",
        products: "Hydroponic towers, grow tents, nutrient solutions",
        support: "Installation, training, maintenance",
      },
      urbanKissan: {
        name: "Urban Kissan",
        description: "Vertical farming technology and consultancy services",
        specialization: "Stackable systems, IoT monitoring",
        location: "Koramangala, Bengaluru",
        experience: "5+ years",
        products: "Vertical towers, smart controllers, sensors",
        support: "Design consultation, technical support",
      },
      greenPod: {
        name: "GreenPod Labs",
        description:
          "Automated vertical farming solutions for homes and businesses",
        specialization: "AI-powered systems, mobile apps",
        location: "Whitefield, Bengaluru",
        experience: "6+ years",
        products: "Smart pods, mobile app control, auto-dosing",
        support: "App support, remote monitoring",
      },
      simpleGreen: {
        name: "Simply Green",
        description:
          "Affordable hydroponic kits and vertical farming solutions",
        specialization: "DIY kits, educational programs",
        location: "Indiranagar, Bengaluru",
        experience: "4+ years",
        products: "Starter kits, grow towers, organic nutrients",
        support: "Workshops, online tutorials",
      },
    },
    costs: {
      title: "Investment Overview",
      starter: {
        title: "Starter Kit",
        price: "₹15,000 - ₹25,000",
        description: "Perfect for beginners and small spaces",
        includes: "Basic hydroponic tower, LED lights, nutrients for 3 months",
      },
      intermediate: {
        title: "Home System",
        price: "₹50,000 - ₹1,00,000",
        description: "Complete home vertical farming setup",
        includes: "Multi-tower system, automation, monitoring, installation",
      },
      commercial: {
        title: "Commercial Setup",
        price: "₹2,00,000 - ₹10,00,000",
        description: "Large-scale vertical farming for businesses",
        includes: "Climate control, IoT monitoring, maintenance support",
      },
    },
    roi: {
      title: "Return on Investment",
      timeframe: "6-12 months payback period",
      savings: "Save ₹2,000-5,000 monthly on fresh produce",
      income: "Potential monthly income of ₹10,000-50,000",
    },
  },

  // Notifications
  notifications: {
    error: "An error occurred",
    success: "Operation completed successfully",
    networkError: "Network error. Please check your connection.",
    permissionDenied: "Permission denied",
    fileUploadError: "Failed to upload file",
    invalidInput: "Invalid input provided",
  },
};
