export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: 'rent' | 'sale' | 'lease' | 'sold';
  type: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  agent?: {
    id: string;
    name: string;
    phone: string;
  };
  description?: string;
  amenities?: string[];
  yearBuilt?: number;
  parking?: number;
  floor?: string;
  furnishingStatus?: string;
  availableFrom?: string;
  images?: string[];
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxurious 3 BHK Apartment in Bandra West',
    price: 85000,
    location: 'Bandra West',
    area: 'Mumbai',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1450,
    status: 'rent',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: true,
    agent: {
      id: 'agent-1',
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210'
    },
    description: 'Beautiful 3 BHK apartment with modern amenities and stunning sea view.',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Power Backup'],
    yearBuilt: 2020,
    parking: 2,
    floor: '12th of 25',
    furnishingStatus: 'Semi-Furnished',
    availableFrom: '2024-02-01'
  },
  {
    id: '2',
    title: 'Spacious 4 BHK Villa in Gurgaon',
    price: 32500000,
    location: 'Sector 57',
    area: 'Gurgaon',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2800,
    status: 'sale',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: false,
    agent: {
      id: 'agent-2',
      name: 'Priya Verma',
      phone: '+91 98765 43211'
    },
    description: 'Independent villa with private garden and modern amenities.',
    amenities: ['Garden', 'Gym', 'Security', 'Parking', 'Club House'],
    yearBuilt: 2019,
    parking: 3,
    floor: 'Ground + 2',
    furnishingStatus: 'Unfurnished',
    availableFrom: 'Immediate'
  },
  {
    id: '3',
    title: '2 BHK Modern Flat in Koramangala',
    price: 45000,
    location: 'Koramangala',
    area: 'Bangalore',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    status: 'rent',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop',
    isVerified: false,
    isFeatured: false,
    agent: {
      id: 'agent-3',
      name: 'Ankit Kumar',
      phone: '+91 98765 43212'
    },
    description: 'Well-ventilated 2 BHK in prime location with easy connectivity.',
    amenities: ['Lift', 'Security', 'Parking', 'Power Backup'],
    yearBuilt: 2018,
    parking: 1,
    floor: '8th of 12',
    furnishingStatus: 'Fully Furnished',
    availableFrom: '2024-01-15'
  },
  {
    id: '4',
    title: 'Premium 3 BHK Penthouse in Powai',
    price: 18500000,
    location: 'Powai',
    area: 'Mumbai',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1850,
    status: 'sale',
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: true,
    agent: {
      id: 'agent-4',
      name: 'Meera Nair',
      phone: '+91 98765 43213'
    },
    description: 'Stunning penthouse with terrace garden and lake view.',
    amenities: ['Terrace Garden', 'Swimming Pool', 'Gym', 'Security', 'Parking'],
    yearBuilt: 2021,
    parking: 2,
    floor: 'Top Floor',
    furnishingStatus: 'Semi-Furnished',
    availableFrom: 'Immediate'
  },
  {
    id: '5',
    title: 'Commercial Office Space in Connaught Place',
    price: 125000,
    location: 'Connaught Place',
    area: 'Delhi',
    bedrooms: 0,
    bathrooms: 2,
    sqft: 2200,
    status: 'lease',
    type: 'Office Space',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: false,
    agent: {
      id: 'agent-5',
      name: 'Suresh Gupta',
      phone: '+91 98765 43214'
    },
    description: 'Prime commercial space in the heart of Delhi.',
    amenities: ['AC', 'Lift', 'Security', 'Parking', 'Reception'],
    yearBuilt: 2017,
    parking: 4,
    floor: '5th of 8',
    furnishingStatus: 'Unfurnished',
    availableFrom: '2024-03-01'
  },
  {
    id: '6',
    title: '1 BHK Studio Apartment in Andheri East',
    price: 28000,
    location: 'Andheri East',
    area: 'Mumbai',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    status: 'rent',
    type: 'Studio Apartment',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    isVerified: false,
    isFeatured: false,
    agent: {
      id: 'agent-6',
      name: 'Kavita Singh',
      phone: '+91 98765 43215'
    },
    description: 'Compact studio apartment perfect for young professionals.',
    amenities: ['Gym', 'Security', 'Parking', 'Power Backup'],
    yearBuilt: 2019,
    parking: 1,
    floor: '6th of 14',
    furnishingStatus: 'Fully Furnished',
    availableFrom: '2024-01-20'
  },
  {
    id: '7',
    title: 'Luxury 5 BHK Villa in Jubilee Hills',
    price: 42000000,
    location: 'Jubilee Hills',
    area: 'Hyderabad',
    bedrooms: 5,
    bathrooms: 5,
    sqft: 3500,
    status: 'sale',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: true,
    agent: {
      id: 'agent-7',
      name: 'Ramesh Reddy',
      phone: '+91 98765 43216'
    },
    description: 'Opulent villa with swimming pool and landscaped garden.',
    amenities: ['Swimming Pool', 'Garden', 'Gym', 'Security', 'Parking', 'Club House'],
    yearBuilt: 2020,
    parking: 4,
    floor: 'Ground + 2',
    furnishingStatus: 'Semi-Furnished',
    availableFrom: 'Immediate'
  },
  {
    id: '8',
    title: '2 BHK Apartment in Whitefield',
    price: 8500000,
    location: 'Whitefield',
    area: 'Bangalore',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1150,
    status: 'sale',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: false,
    agent: {
      id: 'agent-8',
      name: 'Sridhar Rao',
      phone: '+91 98765 43217'
    },
    description: 'Well-planned 2 BHK apartment in IT corridor.',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Club House'],
    yearBuilt: 2018,
    parking: 1,
    floor: '4th of 10',
    furnishingStatus: 'Unfurnished',
    availableFrom: 'Immediate'
  },
  {
    id: '9',
    title: '3 BHK Duplex in Gomti Nagar',
    price: 65000,
    location: 'Gomti Nagar',
    area: 'Lucknow',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1650,
    status: 'rent',
    type: 'Duplex',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    isVerified: false,
    isFeatured: false,
    agent: {
      id: 'agent-9',
      name: 'Ashok Tiwari',
      phone: '+91 98765 43218'
    },
    description: 'Spacious duplex with modern amenities in prime location.',
    amenities: ['Gym', 'Security', 'Parking', 'Power Backup', 'Garden'],
    yearBuilt: 2019,
    parking: 2,
    floor: '3rd-4th Floor',
    furnishingStatus: 'Semi-Furnished',
    availableFrom: '2024-02-15'
  },
  {
    id: '10',
    title: 'Builder Floor in Greater Kailash',
    price: 25000000,
    location: 'Greater Kailash',
    area: 'Delhi',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2200,
    status: 'sale',
    type: 'Builder Floor',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop',
    isVerified: true,
    isFeatured: false,
    agent: {
      id: 'agent-10',
      name: 'Deepak Agarwal',
      phone: '+91 98765 43219'
    },
    description: 'Independent builder floor in posh locality of South Delhi.',
    amenities: ['Parking', 'Power Backup', 'Security', 'Garden'],
    yearBuilt: 2017,
    parking: 2,
    floor: '2nd Floor',
    furnishingStatus: 'Unfurnished',
    availableFrom: 'Immediate'
  }
];

export const getFilteredProperties = (filters: any) => {
  return mockProperties.filter(property => {
    // Transaction type filter
    if (filters.transactionType && property.status !== filters.transactionType) {
      return false;
    }

    // Location filter
    if (filters.location && property.area !== filters.location) {
      return false;
    }

    // Property type filter
    if (filters.propertyType && property.type !== filters.propertyType) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      const bedroomCount = parseInt(filters.bedrooms);
      if (bedroomCount === 5 && property.bedrooms < 5) return false;
      if (bedroomCount < 5 && property.bedrooms !== bedroomCount) return false;
    }

    // Price range filter
    if (property.price < filters.minPrice || property.price > filters.maxPrice) {
      return false;
    }

    // Area filter
    if (property.sqft < filters.minSqft || property.sqft > filters.maxSqft) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.area.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query)
      );
    }

    return true;
  });
};