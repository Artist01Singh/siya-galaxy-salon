import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'siya_galaxy_luxury_salon_secret_key_2026';

app.use(express.json());

// Persistent database path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial seed data
const initialSalonSettings = {
  salonName: 'Siya Galaxy Salon',
  tagline: 'Luxury Hair, Beauty Rituals & Bridal Artistry',
  category: 'Unisex Hair & Beauty Salon',
  phone: '+91 72176 44360',
  email: 'contact@siyagalaxysalon.com',
  address: 'Near Metro Pillar No. 33, Vikas Marg, Laxmi Nagar',
  landmark: 'Near Laxmi Nagar Metro Station',
  city: 'New Delhi',
  pincode: '110092',
  googleMapsUrl: 'https://maps.app.goo.gl/L2Wpk8mx8ki1924a6',
  established: 'April 2023',
  rating: 5.0,
  reviewCount: 119,
  slotIntervalMinutes: 30,
  maxConcurrentBookings: 3,
  weeklySchedule: [
    { day: 'monday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'thursday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'friday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'saturday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { day: 'sunday', isOpen: true, openTime: '10:00', closeTime: '21:00' }
  ],
  blockedDates: []
};

const serviceImageMap: Record<string, string> = {
  'srv-nanoplastia': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'srv-keratin': 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
  'srv-botoplex': 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
  'srv-balayage': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
  'srv-color-global': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
  'srv-cut-blowdry': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
  'srv-hair-spa': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
  'srv-hydra-facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  'srv-o3-bridal-facial': 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80',
  'srv-diamond-facial': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
  'srv-detan-therapy': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
  'srv-deep-cleanse': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  'srv-hd-bridal': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  'srv-airbrush-bridal': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'srv-engagement-glam': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  'srv-party-makeup': 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80',
  'srv-nail-extensions': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
  'srv-gel-polish': 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
  'srv-spa-pedicure-manicure': 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
  'srv-threading-detan': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
  'srv-rica-wax': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  'srv-beard-sculpt': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
};

const initialServices = [
  // Hair
  {
    id: 'srv-nanoplastia',
    name: 'Nanoplastia Silk Infusion Treatment',
    category: 'hair',
    durationMinutes: 180,
    price: 3999,
    description: 'Advanced formaldehyde-free organic hair straightening and deep restructuring treatment that delivers long-lasting mirror shine and velvet softness.',
    imageUrl: serviceImageMap['srv-nanoplastia'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-keratin',
    name: 'Keratin Smoothing Therapy',
    category: 'hair',
    durationMinutes: 150,
    price: 3499,
    description: 'Deep protein infusion that eliminates unruly frizz, restores hydration, and transforms dry damaged hair into manageable silky tresses.',
    imageUrl: serviceImageMap['srv-keratin'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-botoplex',
    name: 'Botoplex Collagen Hair Repair',
    category: 'hair',
    durationMinutes: 120,
    price: 2999,
    description: 'Intensive restorative molecular treatment with peptides, collagen, and caviar extract for weakened or chemically treated hair.',
    imageUrl: serviceImageMap['srv-botoplex'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-balayage',
    name: 'Artisanal Balayage & Highlights',
    category: 'hair',
    durationMinutes: 150,
    price: 3200,
    description: 'Custom hand-painted multidimensional highlights and seamless ombre transitions personalized for Indian undertones with bond-protecting plex.',
    imageUrl: serviceImageMap['srv-balayage'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-color-global',
    name: 'Global Hair Color & Gloss',
    category: 'hair',
    durationMinutes: 90,
    price: 1999,
    description: 'Rich ammonia-free global root-to-tip coloring with nourishing argan oil infusion and high-shine glossing finish.',
    imageUrl: serviceImageMap['srv-color-global'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-cut-blowdry',
    name: 'Signature Precision Cut & Blowdry',
    category: 'hair',
    durationMinutes: 45,
    price: 500,
    description: 'Bespoke consultation, shampoo wash, conditioning, textured precision haircut tailored to facial structure, and glamorous salon blowdry.',
    imageUrl: serviceImageMap['srv-cut-blowdry'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-hair-spa',
    name: 'Deep Nourishing Scalp & Hair Spa',
    category: 'hair',
    durationMinutes: 60,
    price: 899,
    description: 'Detoxifying scalp scrub, steam infusion, essential oil massage, and deep moisture hair mask to combat pollution and stress.',
    imageUrl: serviceImageMap['srv-hair-spa'],
    popular: false,
    isActive: true
  },
  // Skin
  {
    id: 'srv-hydra-facial',
    name: 'Hydra-Facial Deep Clean & Glow Ritual',
    category: 'skin',
    durationMinutes: 75,
    price: 1799,
    description: 'Multi-step clinical suction pore cleanse, blackhead extraction, antioxidant infusion, ultrasound serum penetration, and cold hammer firming.',
    imageUrl: serviceImageMap['srv-hydra-facial'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-o3-bridal-facial',
    name: 'O3+ Luxury Radiance & Brightening Facial',
    category: 'skin',
    durationMinutes: 90,
    price: 2499,
    description: 'Professional grade dermatological brightening facial delivering instant translucent bridal glow, evening out hyperpigmentation.',
    imageUrl: serviceImageMap['srv-o3-bridal-facial'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-diamond-facial',
    name: 'Diamond Micro-Derm Polish Facial',
    category: 'skin',
    durationMinutes: 60,
    price: 1299,
    description: 'Gentle exfoliating diamond-dust scrub with hydrating botanical masks to rejuvenate dull tired skin cells.',
    imageUrl: serviceImageMap['srv-diamond-facial'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-detan-therapy',
    name: 'Herbal De-Tan & Glow Treatment',
    category: 'skin',
    durationMinutes: 45,
    price: 699,
    description: 'Fast-acting botanical detan formulation that gently lifts sun damage, tan, and impurities without stripping natural skin moisture.',
    imageUrl: serviceImageMap['srv-detan-therapy'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-deep-cleanse',
    name: 'Pore Clarifying Purifying Clean-up',
    category: 'skin',
    durationMinutes: 45,
    price: 599,
    description: 'Steamed extraction, gentle scrubbing, and antibacterial tea-tree mask for clear, balanced, oil-free complexion.',
    imageUrl: serviceImageMap['srv-deep-cleanse'],
    popular: false,
    isActive: true
  },
  // Bridal
  {
    id: 'srv-hd-bridal',
    name: 'Signature HD Bridal Makeover',
    category: 'bridal',
    durationMinutes: 180,
    price: 7999,
    description: 'High-definition long-wear bridal makeup, premium skin prep, designer bridal hairstyle, jewelry fitting, and meticulous dupatta/saree draping.',
    imageUrl: serviceImageMap['srv-hd-bridal'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-airbrush-bridal',
    name: 'Luxury Airbrush Bridal Masterpiece',
    category: 'bridal',
    durationMinutes: 210,
    price: 11999,
    description: 'Featherlight waterproof airbrush perfection lasting 18+ hours, mink lashes, custom bridal hair ornamentation, and full wedding jewelry placement.',
    imageUrl: serviceImageMap['srv-airbrush-bridal'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-engagement-glam',
    name: 'Engagement & Cocktail Glamour',
    category: 'bridal',
    durationMinutes: 120,
    price: 3999,
    description: 'Striking evening glamorous makeover with smokey eye or subtle shimmer, sculpted facial contouring, and modern soft-wave hairstyle.',
    imageUrl: serviceImageMap['srv-engagement-glam'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-party-makeup',
    name: 'Party Glow Makeup & Saree Draping',
    category: 'bridal',
    durationMinutes: 90,
    price: 2199,
    description: 'Luminous event makeup suitable for bridesmaids and family functions, accompanied by classic hairstyle and saree/lehenga draping.',
    imageUrl: serviceImageMap['srv-party-makeup'],
    popular: false,
    isActive: true
  },
  // Nails
  {
    id: 'srv-nail-extensions',
    name: 'Gel Nail Extensions & Artistic Accents',
    category: 'nails',
    durationMinutes: 90,
    price: 1499,
    description: 'Long-lasting lightweight tip extensions sculpted with salon-grade gel, finished with choice of chrome, French tip, or glitter artistry.',
    imageUrl: serviceImageMap['srv-nail-extensions'],
    popular: true,
    isActive: true
  },
  {
    id: 'srv-gel-polish',
    name: 'Signature UV Gel Polish & Gloss',
    category: 'nails',
    durationMinutes: 45,
    price: 699,
    description: 'Chip-resistant high-shine gel application on natural nails cured under LED light for 3+ weeks of flawless beauty.',
    imageUrl: serviceImageMap['srv-gel-polish'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-spa-pedicure-manicure',
    name: 'Deluxe Aromatherapy Mani-Pedi Spa',
    category: 'nails',
    durationMinutes: 75,
    price: 1199,
    description: 'Hygienic warm sea salt foot bath, exfoliating pumice scrub, cuticle conditioning, reflexology massage, and buffed polish finish.',
    imageUrl: serviceImageMap['srv-spa-pedicure-manicure'],
    popular: false,
    isActive: true
  },
  // Grooming
  {
    id: 'srv-threading-detan',
    name: 'Precision Threading & Brow Detan',
    category: 'grooming',
    durationMinutes: 30,
    price: 349,
    description: 'Pain-minimized organic thread shaping for eyebrows, upper lip, chin, finished with soothing ice compress and aloe detan.',
    imageUrl: serviceImageMap['srv-threading-detan'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-rica-wax',
    name: 'Rica White Chocolate Body Waxing',
    category: 'grooming',
    durationMinutes: 60,
    price: 1299,
    description: 'Colophony-free Italian liposoluble wax formulated with glyceryl rosinate, minimizing discomfort and redness on delicate skin.',
    imageUrl: serviceImageMap['srv-rica-wax'],
    popular: false,
    isActive: true
  },
  {
    id: 'srv-beard-sculpt',
    name: "Men's Precision Beard Styling & Trim",
    category: 'grooming',
    durationMinutes: 30,
    price: 300,
    description: 'Hot towel relaxation, razor-sharp edge definition, beard trimming, and nourishing botanical beard oil treatment.',
    imageUrl: serviceImageMap['srv-beard-sculpt'],
    popular: false,
    isActive: true
  }
];

const initialReviews = [
  {
    id: 'rev-1',
    name: 'Sunita Verma',
    rating: 5,
    date: 'August 2024',
    source: 'Justdial',
    comment: 'Visited Siya Galaxy Salon right near pillar 33 for hair straightening and botoplex treatment. The staff is exceptionally polite and the salon is spotless and spacious. Genuinely great value in Laxmi Nagar!',
    serviceMentioned: 'Botoplex & Straightening'
  },
  {
    id: 'rev-2',
    name: 'Aman Arora',
    rating: 5,
    date: 'January 2025',
    source: 'Google',
    comment: 'Got a haircut and beard grooming done here. The stylist really understands modern hair trends and takes his time. Very hygienic, welcoming, and budget friendly.',
    serviceMentioned: "Haircut & Men's Grooming"
  },
  {
    id: 'rev-3',
    name: 'Priya Malhotra',
    rating: 5,
    date: 'November 2024',
    source: 'Justdial',
    comment: 'Had my engagement makeup and bridal gel nail extensions done here. Truly professional work! Everyone at the party was complimenting my look. The air-conditioned salon is clean and peaceful.',
    serviceMentioned: 'Engagement Makeup & Nails'
  },
  {
    id: 'rev-4',
    name: 'Meenakshi Sharma',
    rating: 5,
    date: 'February 2025',
    source: 'Google',
    comment: 'Super polite staff, welcoming atmosphere, and transparent pricing without hidden charges. The Hydra facial and hair spa were extremely relaxing. Highly recommended salon in East Delhi.',
    serviceMentioned: 'Hydra Facial & Hair Spa'
  },
  {
    id: 'rev-5',
    name: 'Deepak Saxena',
    rating: 5,
    date: 'December 2024',
    source: 'Google',
    comment: 'Clean environment, experienced stylists, and quick service right next to Laxmi Nagar Metro Station. They use genuine products and ensure customer satisfaction.',
    serviceMentioned: 'Hair Care & Detan'
  }
];

// Helper: safe database manager
function getDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      settings: initialSalonSettings,
      services: initialServices,
      reviews: initialReviews,
      bookings: [
        {
          id: 'bk-sample-1',
          reference: 'SGS-2026-9481',
          serviceId: 'srv-nanoplastia',
          serviceName: 'Nanoplastia Silk Infusion Treatment',
          customerName: 'Kavita Joshi',
          customerEmail: 'kavita.j@example.com',
          customerPhone: '9810123456',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time: '11:00',
          durationMinutes: 180,
          price: 3999,
          notes: 'Special event coming up, prefers gentle scalp touch.',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'bk-sample-2',
          reference: 'SGS-2026-8820',
          serviceId: 'srv-hydra-facial',
          serviceName: 'Hydra-Facial Deep Clean & Glow Ritual',
          customerName: 'Rohit Khanna',
          customerEmail: 'rohit.k@example.com',
          customerPhone: '9871654321',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time: '14:30',
          durationMinutes: 75,
          price: 1799,
          notes: 'Sensitive skin near cheekbones.',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      adminUsers: [] // Empty slot initially so user can register their single admin account!
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);

    // Schema sync: ensure all services have imageUrl
    let hasUpdatedServices = false;
    if (Array.isArray(parsed.services)) {
      for (const s of parsed.services) {
        if (!s.imageUrl && serviceImageMap[s.id]) {
          s.imageUrl = serviceImageMap[s.id];
          hasUpdatedServices = true;
        } else if (!s.imageUrl) {
          s.imageUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
          hasUpdatedServices = true;
        }
      }
    }

    if (hasUpdatedServices) {
      saveDb(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Error reading database:', err);
    return null;
  }
}

function saveDb(data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_FILE);
}

// Authentication middleware for admin routes
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
}

// ========================
// PUBLIC API ENDPOINTS
// ========================

// 1. Get salon profile & info
app.get('/api/salon', (_req, res) => {
  const db = getDb();
  res.json({
    settings: db.settings,
    reviews: db.reviews
  });
});

// 2. Get active services
app.get('/api/services', (_req, res) => {
  const db = getDb();
  const services = db.services.filter((s: any) => s.isActive);
  res.json(services);
});

// 3. Get dynamically available time slots for a specific date and service
app.get('/api/slots', (req, res) => {
  const { date, serviceId } = req.query as { date?: string; serviceId?: string };

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Valid date (YYYY-MM-DD) is required' });
  }

  const db = getDb();
  const settings = db.settings;
  const service = serviceId ? db.services.find((s: any) => s.id === serviceId) : null;
  const serviceDuration = service ? service.durationMinutes : 45;

  // Check if date is blocked
  const isBlocked = settings.blockedDates.some((b: any) => b.date === date);
  if (isBlocked) {
    const blockReason = settings.blockedDates.find((b: any) => b.date === date)?.reason || 'Holiday / Blocked';
    return res.json({
      isOpen: false,
      reason: blockReason,
      slots: []
    });
  }

  // Parse day of week
  const dateObj = new Date(`${date}T00:00:00Z`);
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[dateObj.getUTCDay()];

  const daySchedule = settings.weeklySchedule.find((s: any) => s.day === dayName);
  if (!daySchedule || !daySchedule.isOpen) {
    return res.json({
      isOpen: false,
      reason: 'Salon is closed on this day',
      slots: []
    });
  }

  const [openHour, openMin] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMin] = daySchedule.closeTime.split(':').map(Number);

  const openMinutesTotal = openHour * 60 + openMin;
  const closeMinutesTotal = closeHour * 60 + closeMin;
  const interval = settings.slotIntervalMinutes || 30;
  const maxCapacity = settings.maxConcurrentBookings || 3;

  // Active bookings for this date (not cancelled)
  const existingBookings = db.bookings.filter((b: any) => b.date === date && b.status !== 'cancelled');

  // Current time in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const todayStr = istNow.toISOString().split('T')[0];
  const currentMinutesToday = istNow.getUTCHours() * 60 + istNow.getUTCMinutes();
  const isToday = date === todayStr;
  const isPastDate = date < todayStr;

  if (isPastDate) {
    return res.json({
      isOpen: false,
      reason: 'Cannot book slots in the past',
      slots: []
    });
  }

  const slots = [];

  for (let m = openMinutesTotal; m + serviceDuration <= closeMinutesTotal; m += interval) {
    const slotHour = Math.floor(m / 60);
    const slotMinute = m % 60;
    const timeString = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`;

    // Past time on today?
    if (isToday && m <= currentMinutesToday + 15) { // 15 mins buffer
      slots.push({
        time: timeString,
        available: false,
        remainingCapacity: 0,
        reason: 'Time passed'
      });
      continue;
    }

    // Check overlap with existing bookings
    const slotEnd = m + serviceDuration;
    let overlappingCount = 0;

    for (const bk of existingBookings) {
      const [bHour, bMin] = bk.time.split(':').map(Number);
      const bStart = bHour * 60 + bMin;
      const bEnd = bStart + (bk.durationMinutes || 45);

      if (Math.max(m, bStart) < Math.min(slotEnd, bEnd)) {
        overlappingCount++;
      }
    }

    const remaining = Math.max(0, maxCapacity - overlappingCount);
    const isAvailable = remaining > 0;

    slots.push({
      time: timeString,
      available: isAvailable,
      remainingCapacity: remaining,
      reason: isAvailable ? undefined : 'Fully booked'
    });
  }

  res.json({
    isOpen: true,
    dayName,
    operatingHours: `${daySchedule.openTime} - ${daySchedule.closeTime}`,
    slots
  });
});

// 4. Create appointment booking with strict validation
app.post('/api/bookings', (req, res) => {
  const { serviceId, date, time, customerName, customerEmail, customerPhone, notes } = req.body;

  if (!serviceId || !date || !time || !customerName || !customerPhone) {
    return res.status(400).json({ error: 'Please provide all required fields (service, date, time, name, phone).' });
  }

  const db = getDb();
  const service = db.services.find((s: any) => s.id === serviceId && s.isActive);
  if (!service) {
    return res.status(404).json({ error: 'Selected service is invalid or unavailable.' });
  }

  // Validate date is not past
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const todayStr = istNow.toISOString().split('T')[0];
  if (date < todayStr) {
    return res.status(400).json({ error: 'Booking date cannot be in the past.' });
  }

  // Verify blocked date
  const isBlocked = db.settings.blockedDates.some((b: any) => b.date === date);
  if (isBlocked) {
    return res.status(400).json({ error: 'The salon is closed on this selected date.' });
  }

  // Verify capacity
  const [slotHour, slotMin] = time.split(':').map(Number);
  const slotMinutesStart = slotHour * 60 + slotMin;
  const slotMinutesEnd = slotMinutesStart + service.durationMinutes;

  const existingBookings = db.bookings.filter((b: any) => b.date === date && b.status !== 'cancelled');
  let overlappingCount = 0;
  for (const bk of existingBookings) {
    const [bHour, bMin] = bk.time.split(':').map(Number);
    const bStart = bHour * 60 + bMin;
    const bEnd = bStart + (bk.durationMinutes || 45);
    if (Math.max(slotMinutesStart, bStart) < Math.min(slotMinutesEnd, bEnd)) {
      overlappingCount++;
    }
  }

  const maxCapacity = db.settings.maxConcurrentBookings || 3;
  if (overlappingCount >= maxCapacity) {
    return res.status(409).json({ error: 'Sorry, this time slot was just booked to capacity. Please choose another slot.' });
  }

  // Generate unique booking reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference = `SGS-${new Date().getFullYear()}-${randomSuffix}`;

  const newBooking = {
    id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    reference,
    serviceId: service.id,
    serviceName: service.name,
    customerName: customerName.trim(),
    customerEmail: (customerEmail || '').trim().toLowerCase(),
    customerPhone: customerPhone.trim(),
    date,
    time,
    durationMinutes: service.durationMinutes,
    price: service.price,
    notes: (notes || '').trim(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  saveDb(db);

  res.status(201).json({
    message: 'Appointment confirmed successfully!',
    booking: newBooking
  });
});

// 5. Look up booking by reference code & customer phone
app.get('/api/bookings/lookup', (req, res) => {
  const { reference, phone } = req.query as { reference?: string; phone?: string };

  if (!reference && !phone) {
    return res.status(400).json({ error: 'Reference code or phone number required' });
  }

  const db = getDb();
  let matches = [];

  if (reference) {
    matches = db.bookings.filter((b: any) => b.reference.toUpperCase() === reference.trim().toUpperCase());
  } else if (phone) {
    matches = db.bookings.filter((b: any) => b.customerPhone.replace(/\D/g, '').endsWith(phone.trim().replace(/\D/g, '')));
  }

  if (matches.length === 0) {
    return res.status(404).json({ error: 'No matching appointments found with provided details.' });
  }

  res.json(matches);
});

// 6. Customer cancellation
app.post('/api/bookings/:reference/cancel', (req, res) => {
  const { reference } = req.params;
  const { phone } = req.body;

  const db = getDb();
  const bookingIndex = db.bookings.findIndex((b: any) => b.reference.toUpperCase() === reference.toUpperCase());

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const booking = db.bookings[bookingIndex];

  if (phone) {
    const cleanPhoneReq = phone.replace(/\D/g, '');
    const cleanPhoneBook = booking.customerPhone.replace(/\D/g, '');
    if (!cleanPhoneBook.endsWith(cleanPhoneReq) && !cleanPhoneReq.endsWith(cleanPhoneBook)) {
      return res.status(403).json({ error: 'Phone number verification failed.' });
    }
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'This appointment is already cancelled.' });
  }

  booking.status = 'cancelled';
  booking.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ message: 'Appointment successfully cancelled.', booking });
});

// 7. Customer reschedule
app.post('/api/bookings/:reference/reschedule', (req, res) => {
  const { reference } = req.params;
  const { newDate, newTime, phone } = req.body;

  if (!newDate || !newTime) {
    return res.status(400).json({ error: 'New date and time required.' });
  }

  const db = getDb();
  const bookingIndex = db.bookings.findIndex((b: any) => b.reference.toUpperCase() === reference.toUpperCase());
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const booking = db.bookings[bookingIndex];

  if (phone) {
    const cleanPhoneReq = phone.replace(/\D/g, '');
    const cleanPhoneBook = booking.customerPhone.replace(/\D/g, '');
    if (!cleanPhoneBook.endsWith(cleanPhoneReq) && !cleanPhoneReq.endsWith(cleanPhoneBook)) {
      return res.status(403).json({ error: 'Phone number verification failed.' });
    }
  }

  booking.date = newDate;
  booking.time = newTime;
  booking.status = 'rescheduled';
  booking.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ message: 'Appointment successfully rescheduled.', booking });
});

// ========================
// ADMIN API ENDPOINTS (PROTECTED & SETUP)
// ========================

// Check whether the single admin account is configured
app.get('/api/admin/setup-status', (_req, res) => {
  const db = getDb();
  const hasAdmin = Array.isArray(db.adminUsers) && db.adminUsers.length > 0;
  res.json({
    isRegistered: hasAdmin,
    adminEmail: hasAdmin ? db.adminUsers[0].email : null,
    adminName: hasAdmin ? db.adminUsers[0].name : null
  });
});

// One-time Setup: Single Slot Admin Registration
app.post('/api/admin/setup', (req, res) => {
  const { name, email, password } = req.body;
  const db = getDb();

  // STRICT ENFORCEMENT: Only ONE admin slot is allowed ever
  if (Array.isArray(db.adminUsers) && db.adminUsers.length > 0) {
    return res.status(403).json({
      error: 'Registration is permanently closed. The single master admin account has already been created.'
    });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newAdmin = {
    id: `adm-${Date.now()}`,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role: 'admin',
    passwordHash,
    createdAt: new Date().toISOString()
  };

  db.adminUsers = [newAdmin];
  saveDb(db);

  const token = jwt.sign(
    { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'Master admin account successfully created! Single slot is now closed.',
    token,
    user: {
      id: newAdmin.id,
      email: newAdmin.email,
      name: newAdmin.name,
      role: newAdmin.role
    }
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const db = getDb();

  if (!Array.isArray(db.adminUsers) || db.adminUsers.length === 0) {
    return res.status(400).json({
      error: 'No administrator account has been set up yet. Please complete the initial admin registration first.'
    });
  }

  const user = db.adminUsers.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Admin verify token
app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ user: (req as any).adminUser });
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  const db = getDb();
  const bookings = db.bookings || [];

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const todayStr = istNow.toISOString().split('T')[0];

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
  const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
  const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length;

  const totalRevenue = bookings
    .filter((b: any) => b.status !== 'cancelled')
    .reduce((sum: number, b: any) => sum + (b.price || 0), 0);

  const todayBookingsCount = bookings.filter((b: any) => b.date === todayStr && b.status !== 'cancelled').length;
  const upcomingBookingsCount = bookings.filter((b: any) => b.date >= todayStr && b.status !== 'cancelled').length;

  res.json({
    totalBookings,
    totalRevenue,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    todayBookingsCount,
    upcomingBookingsCount
  });
});

// Admin get bookings with filters
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  const db = getDb();
  let list = [...db.bookings];

  const { status, search, date } = req.query as { status?: string; search?: string; date?: string };

  if (status && status !== 'all') {
    list = list.filter((b: any) => b.status === status);
  }

  if (date) {
    list = list.filter((b: any) => b.date === date);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter((b: any) =>
      b.reference.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.includes(q) ||
      b.serviceName.toLowerCase().includes(q)
    );
  }

  // Sort by date and time descending
  list.sort((a, b) => {
    const da = `${a.date} ${a.time}`;
    const db_time = `${b.date} ${b.time}`;
    return db_time.localeCompare(da);
  });

  res.json(list);
});

// Admin update booking status
app.patch('/api/admin/bookings/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid booking status' });
  }

  const db = getDb();
  const bk = db.bookings.find((b: any) => b.id === id);
  if (!bk) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bk.status = status;
  bk.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ message: `Booking marked as ${status}`, booking: bk });
});

// Admin reschedule appointment
app.patch('/api/admin/bookings/:id/reschedule', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ error: 'Date and time required' });
  }

  const db = getDb();
  const bk = db.bookings.find((b: any) => b.id === id);
  if (!bk) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bk.date = date;
  bk.time = time;
  bk.status = 'rescheduled';
  bk.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ message: 'Booking rescheduled successfully', booking: bk });
});

// Admin all services (including inactive)
app.get('/api/admin/services', requireAdmin, (_req, res) => {
  const db = getDb();
  res.json(db.services);
});

// Admin create service
app.post('/api/admin/services', requireAdmin, (req, res) => {
  const { name, category, durationMinutes, price, description, imageUrl, popular, isActive } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  const db = getDb();
  const newService = {
    id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    name: name.trim(),
    category,
    durationMinutes: Number(durationMinutes) || 45,
    price: Number(price),
    description: (description || '').trim(),
    imageUrl: (imageUrl || '').trim() || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    popular: Boolean(popular),
    isActive: isActive !== false
  };

  db.services.push(newService);
  saveDb(db);

  res.status(201).json(newService);
});

// Admin edit service
app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.services.findIndex((s: any) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  db.services[index] = {
    ...db.services[index],
    ...req.body,
    id // keep id stable
  };

  saveDb(db);
  res.json(db.services[index]);
});

// Admin delete service
app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const initialLength = db.services.length;
  db.services = db.services.filter((s: any) => s.id !== id);

  if (db.services.length === initialLength) {
    return res.status(404).json({ error: 'Service not found' });
  }

  saveDb(db);
  res.json({ message: 'Service deleted successfully' });
});

// Admin get settings
app.get('/api/admin/settings', requireAdmin, (_req, res) => {
  const db = getDb();
  res.json(db.settings);
});

// Admin update settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDb(db);
  res.json(db.settings);
});

// Admin add blocked date
app.post('/api/admin/blocked-dates', requireAdmin, (req, res) => {
  const { date, reason } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const db = getDb();
  const exists = db.settings.blockedDates.some((b: any) => b.date === date);
  if (exists) {
    return res.status(400).json({ error: 'Date is already blocked' });
  }

  const newBlocked = {
    id: `blk-${Date.now()}`,
    date,
    reason: (reason || 'Salon Closed / Special Holiday').trim()
  };

  db.settings.blockedDates.push(newBlocked);
  saveDb(db);
  res.status(201).json(newBlocked);
});

// Admin delete blocked date
app.delete('/api/admin/blocked-dates/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.settings.blockedDates = db.settings.blockedDates.filter((b: any) => b.id !== id);
  saveDb(db);
  res.json({ message: 'Blocked date removed' });
});

// ========================
// VITE / STATIC SERVING
// ========================

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
