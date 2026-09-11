import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  User,
  Package,
  Prediction,
  Payment,
  Subscription,
  Advertisement,
  AppNotification,
  AppSettings,
  AdminStats,
} from './src/types';

// ---- PERSISTENT FILE DATABASE ENGINE ----
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'washindi_db.json');

interface StoredAdmin {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface StoredSession {
  token: string;
  userId: string;
  role: 'user' | 'admin';
  createdAt: string;
  expiresAt: string;
}

interface DatabaseSchema {
  admin: StoredAdmin;
  users: StoredUser[];
  sessions: StoredSession[];
  packages: Package[];
  predictions: Prediction[];
  payments: Payment[];
  subscriptions: Subscription[];
  advertisements: Advertisement[];
  notifications: AppNotification[];
  settings: AppSettings;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

// Initial Seed Data
function getInitialDbData(): DatabaseSchema {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminPasswordHash = hashPassword('2468', adminSalt);

  const defaultPackages: Package[] = [
    {
      id: 'pkg-odds-5',
      code: 'ODDS_5',
      name: 'ODDS 5',
      price: 2000,
      durationDays: 1,
      durationLabel: 'Masaa 24 (Siku 1)',
      description: 'Mikeka ya uhakika ya Odds 5 kwa siku. Inafaa kuanzia mtaji mdogo kwa ushindi wa kila siku.',
      highlight: 'Ushindi wa Uhakika 96%',
      badge: 'MAARUFU',
      targetOdds: '5.00+',
      confidenceRate: 96,
      active: true,
    },
    {
      id: 'pkg-odds-10',
      code: 'ODDS_10',
      name: 'ODDS 10',
      price: 5000,
      durationDays: 1,
      durationLabel: 'Masaa 24 (Siku 1)',
      description: 'Utabiri wa kitaalamu wa Odds 10 zilizofanyiwa uchambuzi wa kina na wataalamu wetu.',
      highlight: 'Faida Kubwa Kila Siku',
      badge: 'CHAGUO BORA',
      targetOdds: '10.00+',
      confidenceRate: 93,
      active: true,
    },
    {
      id: 'pkg-odds-15',
      code: 'ODDS_15',
      name: 'ODDS 15',
      price: 10000,
      durationDays: 1,
      durationLabel: 'Masaa 24 (Siku 1)',
      description: 'Odds 15 za uhakika. Combo ya mechi salama zenye uwezekano mkubwa wa ushindi mnono.',
      highlight: 'Odds Nono za Leo',
      targetOdds: '15.00+',
      confidenceRate: 91,
      active: true,
    },
    {
      id: 'pkg-odds-20',
      code: 'ODDS_20',
      name: 'ODDS 20',
      price: 15000,
      durationDays: 1,
      durationLabel: 'Masaa 24 (Siku 1)',
      description: 'Super VIP Odds 20. Mikeka ya kipekee yenye odds kubwa zaidi na faida kubwa mara 20.',
      highlight: 'Ushindi wa Milionea',
      badge: 'SUPER VIP',
      targetOdds: '20.00+',
      confidenceRate: 89,
      active: true,
    },
    {
      id: 'pkg-wiki',
      code: 'WIKI',
      name: 'WIKI (SIKU 7)',
      price: 30000,
      durationDays: 7,
      durationLabel: 'Siku 7 Mfululizo',
      description: 'Upatikanaji wa mikeka YOTE ya VIP (Odds 5, 10, 15 na 20) kila siku kwa juma zima.',
      highlight: 'Okoa TZS 50,000+',
      badge: 'BORA KWA WIKI',
      targetOdds: 'Vifurushi Vyote',
      confidenceRate: 95,
      active: true,
    },
    {
      id: 'pkg-mwezi',
      code: 'MWEZI',
      name: 'MWEZI (SIKU 30)',
      price: 70000,
      durationDays: 30,
      durationLabel: 'Siku 30 Mfululizo',
      description: 'Kifurushi kikuu cha mwekezaji: VIP yote mwezi mzima bila kukosa mkeka wowote wa ushindi.',
      highlight: 'Uwekezaji wa Uhakika',
      badge: 'VIP MASTER',
      targetOdds: 'VIP Kamili Mwezi Mzima',
      confidenceRate: 98,
      active: true,
    },
  ];

  const now = new Date();
  const formatIso = (offsetHours: number) => new Date(now.getTime() + offsetHours * 3600 * 1000).toISOString();
  const pastIso = (offsetHours: number) => new Date(now.getTime() - offsetHours * 3600 * 1000).toISOString();

  const defaultPredictions: Prediction[] = [
    // Free predictions
    {
      id: 'pred-free-1',
      league: 'LALIGA',
      match: 'Real Madrid vs Getafe',
      homeTeam: 'Real Madrid',
      awayTeam: 'Getafe',
      matchTime: formatIso(3),
      prediction: 'Home Win & Over 1.5',
      odds: 1.52,
      confidence: 94,
      status: 'PENDING',
      category: 'FREE',
      analysis: 'Real Madrid wameshinda mechi 8 kati ya 9 za mwisho nyumbani. Getafe wameruhusu magoli 12 mechi 5 za ugenini.',
      slipCode: 'WHL-FREE-01',
    },
    {
      id: 'pred-free-2',
      league: 'PREMIER LEAGUE',
      match: 'Arsenal vs Everton',
      homeTeam: 'Arsenal',
      awayTeam: 'Everton',
      matchTime: formatIso(5),
      prediction: 'Arsenal Win',
      odds: 1.38,
      confidence: 92,
      status: 'PENDING',
      category: 'FREE',
      analysis: 'Arsenal wana rekodi safi ya ulinzi Emirates. Ushindi wa mapema unatarajiwa.',
      slipCode: 'WHL-FREE-02',
    },
    {
      id: 'pred-free-3',
      league: 'SERIE A',
      match: 'Inter Milan vs Monza',
      homeTeam: 'Inter Milan',
      awayTeam: 'Monza',
      matchTime: formatIso(7),
      prediction: 'Over 2.5 Goals',
      odds: 1.65,
      confidence: 88,
      status: 'PENDING',
      category: 'FREE',
      analysis: 'Mechi 4 zilizopita za pande zote zilishuhudia wastani wa magoli 3.2.',
      slipCode: 'WHL-FREE-03',
    },
    {
      id: 'pred-free-4',
      league: 'NBC PREMIER LEAGUE',
      match: 'Simba SC vs Singida BS',
      homeTeam: 'Simba SC',
      awayTeam: 'Singida BS',
      matchTime: formatIso(4),
      prediction: 'Home Win & Over 1.5',
      odds: 1.45,
      confidence: 91,
      status: 'PENDING',
      category: 'FREE',
      analysis: 'Simba SC wako katika kiwango bora uwanja wa Mkapa wakitafuta alama tatu muhimu.',
      slipCode: 'WHL-NBC-01',
    },

    // VIP ODDS 5
    {
      id: 'pred-vip5-1',
      league: 'BUNDESLIGA',
      match: 'Bayern Munich vs RB Leipzig',
      homeTeam: 'Bayern Munich',
      awayTeam: 'RB Leipzig',
      matchTime: formatIso(4),
      prediction: 'Home Win & Both Teams to Score (GG)',
      odds: 2.35,
      confidence: 92,
      status: 'PENDING',
      category: 'ODDS_5',
      analysis: 'Bayern wanashambulia sana lakini wameruhusu magoli. Leipzig wamefunga mechi zote 6 za mwisho.',
      slipCode: 'VIP5-COMBO-A',
    },
    {
      id: 'pred-vip5-2',
      league: 'PREMIER LEAGUE',
      match: 'Aston Villa vs Newcastle',
      homeTeam: 'Aston Villa',
      awayTeam: 'Newcastle',
      matchTime: formatIso(6),
      prediction: 'Both Teams To Score (GG)',
      odds: 1.72,
      confidence: 90,
      status: 'PENDING',
      category: 'ODDS_5',
      analysis: 'Vikosi vyote vina washambuliaji hatari na ulinzi wenye mapengo.',
      slipCode: 'VIP5-COMBO-B',
    },
    {
      id: 'pred-vip5-3',
      league: 'LIGUE 1',
      match: 'PSG vs Marseille',
      homeTeam: 'PSG',
      awayTeam: 'Marseille',
      matchTime: formatIso(8),
      prediction: 'Home Win & Over 2.5',
      odds: 1.80,
      confidence: 93,
      status: 'PENDING',
      category: 'ODDS_5',
      analysis: 'Le Classique inatarajiwa kuwa na ushindani mkubwa huku PSG wakiwa na ubora mkubwa Parc des Princes.',
      slipCode: 'VIP5-COMBO-C',
    },

    // VIP ODDS 10
    {
      id: 'pred-vip10-1',
      league: 'CHAMPIONS LEAGUE',
      match: 'Barcelona vs Man City',
      homeTeam: 'Barcelona',
      awayTeam: 'Man City',
      matchTime: formatIso(9),
      prediction: 'Over 3.5 Goals & GG',
      odds: 3.10,
      confidence: 89,
      status: 'PENDING',
      category: 'ODDS_10',
      analysis: 'Mechi ya wazi yenye mashambulizi makali pande zote mbili.',
      slipCode: 'VIP10-GOLD-01',
    },
    {
      id: 'pred-vip10-2',
      league: 'PREMIER LEAGUE',
      match: 'Tottenham vs Liverpool',
      homeTeam: 'Tottenham',
      awayTeam: 'Liverpool',
      matchTime: formatIso(10),
      prediction: 'Liverpool Win & GG',
      odds: 2.85,
      confidence: 88,
      status: 'PENDING',
      category: 'ODDS_10',
      analysis: 'Liverpool wako katika msimamo thabiti wakishinda ugenini.',
      slipCode: 'VIP10-GOLD-02',
    },
    {
      id: 'pred-vip10-3',
      league: 'EREDIVISIE',
      match: 'Ajax vs Feyenoord',
      homeTeam: 'Ajax',
      awayTeam: 'Feyenoord',
      matchTime: formatIso(6),
      prediction: 'Over 2.5 & Both to Score',
      odds: 1.95,
      confidence: 90,
      status: 'PENDING',
      category: 'ODDS_10',
      analysis: 'De Klassieker daima hutoa mvua ya magoli na ushindani wa hali ya juu.',
      slipCode: 'VIP10-GOLD-03',
    },

    // VIP ODDS 15 & 20
    {
      id: 'pred-vip15-1',
      league: 'SUPER COMBO',
      match: 'VIP Mega Slip (Mechi 4 za Uhakika)',
      homeTeam: 'Napoli / Leverkusen',
      awayTeam: 'Fiorentina / Frankfurt',
      matchTime: formatIso(5),
      prediction: 'Win & Over Combo Slip',
      odds: 15.40,
      confidence: 91,
      status: 'PENDING',
      category: 'ODDS_15',
      analysis: 'Tiketi maalum ya Odds 15.40 iliyochujwa kwa umakini wa 100%.',
      slipCode: 'VIP15-ACC-01',
    },
    {
      id: 'pred-vip20-1',
      league: 'VIP JACKPOT ACCUMULATOR',
      match: 'Mkeka Maalum wa Odds 20 (Mechi 5)',
      homeTeam: 'VIP Selections',
      awayTeam: 'Top Leagues',
      matchTime: formatIso(7),
      prediction: 'Accumulator Multi-Bet Win',
      odds: 22.80,
      confidence: 89,
      status: 'PENDING',
      category: 'ODDS_20',
      analysis: 'Chaguo 5 bora zaidi za leo kwa ajili ya kupata faida kubwa mara 20+.',
      slipCode: 'VIP20-MEGA-01',
    },

    // PAST RESULTS (WON) for social proof and Matokeo & Ushindi page
    {
      id: 'pred-res-1',
      league: 'PREMIER LEAGUE',
      match: 'Chelsea vs Wolves',
      homeTeam: 'Chelsea',
      awayTeam: 'Wolves',
      matchTime: pastIso(20),
      prediction: 'Chelsea Win & Over 2.5',
      odds: 2.15,
      confidence: 92,
      status: 'WON',
      category: 'ODDS_5',
      resultScore: '3 - 1',
      wonOdds: 2.15,
      analysis: 'Chelsea walitawala mchezo mzima na kufunga magoli matatu safi.',
      slipCode: 'VIP5-WIN-78',
    },
    {
      id: 'pred-res-2',
      league: 'LALIGA',
      match: 'Atletico Madrid vs Valencia',
      homeTeam: 'Atletico Madrid',
      awayTeam: 'Valencia',
      matchTime: pastIso(22),
      prediction: 'Home Win',
      odds: 1.48,
      confidence: 95,
      status: 'WON',
      category: 'FREE',
      resultScore: '2 - 0',
      wonOdds: 1.48,
      analysis: 'Atletico walilinda lango lao bila kuruhusu goli lolote.',
      slipCode: 'FREE-WIN-44',
    },
    {
      id: 'pred-res-3',
      league: 'SERIE A',
      match: 'Juventus vs Torino',
      homeTeam: 'Juventus',
      awayTeam: 'Torino',
      matchTime: pastIso(24),
      prediction: 'Under 2.5 Goals',
      odds: 1.70,
      confidence: 91,
      status: 'WON',
      category: 'FREE',
      resultScore: '1 - 0',
      wonOdds: 1.70,
      analysis: 'Derby della Mole iliisha kwa ushindi mwembamba kama ilivyotabiriwa.',
      slipCode: 'FREE-WIN-45',
    },
    {
      id: 'pred-res-4',
      league: 'VIP ODDS 10 ACCUMULATOR',
      match: 'Combo ya Ushindi: Mechi 3 za Jana',
      homeTeam: 'PSG / Milan / Porto',
      awayTeam: 'Rennes / Empoli / Braga',
      matchTime: pastIso(26),
      prediction: 'Multi-Win Ticket',
      odds: 10.45,
      confidence: 94,
      status: 'WON',
      category: 'ODDS_10',
      resultScore: 'TICKET ILITIKI',
      wonOdds: 10.45,
      analysis: 'Wateja wote wa VIP Odds 10 walipiga mkeka wa faida mara 10.45 jana usiku.',
      slipCode: 'VIP10-BOOM-99',
    },
    {
      id: 'pred-res-5',
      league: 'VIP ODDS 20 SPECIAL',
      match: 'Mkeka Mkubwa wa Mwisho wa Juma',
      homeTeam: 'Dortmund / Sporting / Monaco / Celtic',
      awayTeam: 'Opponents',
      matchTime: pastIso(48),
      prediction: 'Accumulator Over Goals',
      odds: 21.30,
      confidence: 89,
      status: 'WON',
      category: 'ODDS_20',
      resultScore: 'BOOOM! USHINDI 100%',
      wonOdds: 21.30,
      analysis: 'Ushindi mkubwa wa kihistoria! Wateja waliofuata mkeka huu waliondoka na mamilioni.',
      slipCode: 'VIP20-BOOM-88',
    },
  ];

  const defaultAdvertisements: Advertisement[] = [
    {
      id: 'banner-1',
      title: 'MKEKA WA USHINDI WA LEO UPO TAYARI!',
      description: 'Chukua Odds 10 na Odds 20 za uhakika zilizothibitishwa na jopo la wataalamu wetu. Jiunge sasa!',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      buttonText: 'NUNUA VIP SASA',
      buttonLink: '#vip',
      active: true,
      order: 1,
      badgeText: 'HOT TIPS LEO',
    },
    {
      id: 'banner-2',
      title: 'GROUP LA WHATSAPP LA WASHINDI',
      description: 'Jiunge na group letu rasmi la WhatsApp upate mikeka ya bure kila asubuhi na taarifa za haraka.',
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
      buttonText: 'JIUNGE WHATSAPP',
      buttonLink: 'https://wa.me/255743997707?text=Habari%2C%20nahitaji%20kujiunga%20na%20group%20la%20WASHINDI%20WA%20LEO',
      active: true,
      order: 2,
      badgeText: 'WHATSAPP RASMI',
    },
    {
      id: 'banner-3',
      title: 'KIFURUSHI CHA WIKI NA MWEZI',
      description: 'Lipa mara moja ufurahie mikeka yote ya VIP kwa siku 7 au siku 30 mfululizo uokoe zaidi ya TZS 50,000.',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      buttonText: 'ANGALIA VIFURUSHI',
      buttonLink: '#vip',
      active: true,
      order: 3,
      badgeText: 'OFA YA WIKI',
    },
  ];

  const defaultSettings: AppSettings = {
    supportPhone: '0743997707',
    whatsappGroupUrl: 'https://chat.whatsapp.com/invite/washindi-wa-leo-official',
    mpesaRecipientName: 'WASHINDI WA LEO / SMK (0743997707)',
    siteNotice: 'Karibu WASHINDI WA LEO: Mikeka ya leo ya Odds 5, 10 na 20 ipo tayari! Lipa kwenda 0743997707 kisha thibitisha hapa.',
    adminContactEmail: 'support@washindiwaleo.co.tz',
  };

  return {
    admin: {
      id: 'admin-smk',
      username: 'smk',
      passwordHash: adminPasswordHash,
      salt: adminSalt,
      updatedAt: new Date().toISOString(),
    },
    users: [],
    sessions: [],
    packages: defaultPackages,
    predictions: defaultPredictions,
    payments: [],
    subscriptions: [],
    advertisements: defaultAdvertisements,
    notifications: [],
    settings: defaultSettings,
  };
}

class Database {
  private data: DatabaseSchema;
  private saving = false;
  private needsSave = false;

  constructor() {
    this.ensureDir();
    this.data = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure defaults if schema evolved
        const initial = getInitialDbData();
        return {
          ...initial,
          ...parsed,
          packages: parsed.packages?.length ? parsed.packages : initial.packages,
          settings: { ...initial.settings, ...(parsed.settings || {}) },
        };
      }
    } catch (err) {
      console.error('Error loading database, initializing fresh:', err);
    }
    const fresh = getInitialDbData();
    this.saveDirect(fresh);
    return fresh;
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public save(): void {
    if (this.saving) {
      this.needsSave = true;
      return;
    }
    this.saving = true;
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    const payload = JSON.stringify(this.data, null, 2);

    fs.promises
      .writeFile(tempFile, payload, 'utf-8')
      .then(() => fs.promises.rename(tempFile, DB_FILE))
      .catch((err) => console.error('Failed to persist database:', err))
      .finally(() => {
        this.saving = false;
        if (this.needsSave) {
          this.needsSave = false;
          this.save();
        }
      });
  }

  private saveDirect(payload: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  }
}

const db = new Database();

// Helper to sanitize predictions for user viewing
function sanitizePrediction(p: Prediction, hasAccess: boolean): Prediction {
  if (p.category === 'FREE' || hasAccess) {
    return { ...p, isLocked: false };
  }
  return {
    ...p,
    prediction: '🔒 KIFURUSHI CHA VIP KINAHITAJIKA',
    odds: 0,
    analysis: 'Chukua kifurushi hiki kuona timu na aina ya bashiri iliyochaguliwa kwa ushindi.',
    slipCode: undefined,
    isLocked: true,
  };
}

// Check if user has active subscription for a specific category
function userHasAccessToCategory(userId: string | undefined, category: string): boolean {
  if (!userId) return false;
  if (category === 'FREE') return true;

  const now = new Date();
  const activeSubs = db.get().subscriptions.filter((s) => {
    return s.userId === userId && s.status === 'ACTIVE' && new Date(s.expiresAt) > now;
  });

  for (const sub of activeSubs) {
    // WIKI and MWEZI unlock all VIP categories
    if (sub.packageCode === 'WIKI' || sub.packageCode === 'MWEZI') {
      return true;
    }
    // Specific match e.g. ODDS_5 unlocks ODDS_5
    if (sub.packageCode === category) {
      return true;
    }
  }

  return false;
}

// Routine to mark expired subscriptions
function cleanupExpiredSubscriptions() {
  const now = new Date();
  let changed = false;
  db.get().subscriptions.forEach((sub) => {
    if (sub.status === 'ACTIVE' && new Date(sub.expiresAt) <= now) {
      sub.status = 'EXPIRED';
      changed = true;
    }
  });
  if (changed) {
    db.save();
  }
}

// Start Server & Express Routes
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Periodic subscription status check
  setInterval(cleanupExpiredSubscriptions, 60000);

  // Authentication Middlewares
  function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Uthibitisho wa msimamizi unahitajika (Admin Token Missing)' });
    }
    const token = authHeader.substring(7);
    const session = db.get().sessions.find((s) => s.token === token && s.role === 'admin');
    if (!session || new Date(session.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Muda wa kikao cha msimamizi umeisha. Tafadhali ingia tena.' });
    }
    (req as any).adminSession = session;
    next();
  }

  function optionalUserAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const session = db.get().sessions.find((s) => s.token === token && s.role === 'user');
      if (session && new Date(session.expiresAt) > new Date()) {
        const user = db.get().users.find((u) => u.id === session.userId);
        if (user) {
          (req as any).user = user;
        }
      }
    }
    next();
  }

  function requireUserAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Tafadhali ingia au jisajili kwanza (Login Required)' });
    }
    const token = authHeader.substring(7);
    const session = db.get().sessions.find((s) => s.token === token && s.role === 'user');
    if (!session || new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Muda wa kikao chako umeisha. Tafadhali ingia tena.' });
    }
    const user = db.get().users.find((u) => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ error: 'Mtumiaji hajapatikana.' });
    }
    (req as any).user = user;
    next();
  }

  // =================== PUBLIC / USER ROUTES ===================

  // 1. App Health & Settings
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/settings', (_req, res) => {
    res.json(db.get().settings);
  });

  // 2. User Authentication (Phone + Password)
  app.post('/api/auth/register', (req, res) => {
    try {
      const { phone, password, name } = req.body;
      if (!phone || !password) {
        return res.status(400).json({ error: 'Tafadhali weka namba ya simu na nenosiri.' });
      }

      const cleanPhone = String(phone).replace(/\s+/g, '');
      if (cleanPhone.length < 9) {
        return res.status(400).json({ error: 'Namba ya simu si sahihi.' });
      }

      const existing = db.get().users.find((u) => u.phone === cleanPhone);
      if (existing) {
        return res.status(400).json({ error: 'Namba hii ya simu tayari imesajiliwa. Tafadhali ingia.' });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(String(password), salt);
      const newUser: StoredUser = {
        id: `user-${crypto.randomUUID()}`,
        phone: cleanPhone,
        name: name ? String(name).trim() : `Mshindi ${cleanPhone.slice(-4)}`,
        role: 'user',
        createdAt: new Date().toISOString(),
        passwordHash,
        salt,
      };

      db.get().users.push(newUser);

      // Create Session
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(); // 30 days
      db.get().sessions.push({
        token,
        userId: newUser.id,
        role: 'user',
        createdAt: new Date().toISOString(),
        expiresAt,
      });

      // Welcome Notification
      db.get().notifications.push({
        id: `notif-${crypto.randomUUID()}`,
        userId: newUser.id,
        title: 'Karibu WASHINDI WA LEO!',
        message: 'Akaunti yako imetengenezwa kwa mafanikio. Nunua kifurushi cha VIP upate mikeka ya uhakika ya ushindi leo.',
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.save();

      const userClean: User = {
        id: newUser.id,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };

      return res.json({ token, user: userClean });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya usajili' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) {
        return res.status(400).json({ error: 'Weka namba ya simu na nenosiri.' });
      }

      const cleanPhone = String(phone).replace(/\s+/g, '');
      const user = db.get().users.find((u) => u.phone === cleanPhone);

      if (!user || !verifyPassword(String(password), user.salt, user.passwordHash)) {
        return res.status(401).json({ error: 'Namba ya simu au nenosiri si sahihi.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      db.get().sessions.push({
        token,
        userId: user.id,
        role: 'user',
        createdAt: new Date().toISOString(),
        expiresAt,
      });

      db.save();

      const userClean: User = {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      };

      return res.json({ token, user: userClean });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuingia' });
    }
  });

  app.get('/api/auth/me', requireUserAuth, (req, res) => {
    const user = (req as any).user as User;
    return res.json(user);
  });

  app.put('/api/auth/profile', requireUserAuth, (req, res) => {
    const user = (req as any).user as User;
    const { name } = req.body;
    const target = db.get().users.find((u) => u.id === user.id);
    if (!target) return res.status(404).json({ error: 'Mtumiaji hajapatikana' });
    if (name) target.name = String(name).trim();
    db.save();
    return res.json({ id: target.id, phone: target.phone, name: target.name, role: target.role });
  });

  // 3. VIP Packages (Public)
  app.get('/api/packages', (_req, res) => {
    const pkgs = db.get().packages.filter((p) => p.active !== false);
    res.json(pkgs);
  });

  // 4. Predictions & Slips (With Server-Side Protection)
  app.get('/api/predictions', optionalUserAuth, (req, res) => {
    const user = (req as any).user as User | undefined;
    cleanupExpiredSubscriptions();

    const all = db.get().predictions;
    const sanitized = all.map((p) => {
      const hasAccess = userHasAccessToCategory(user?.id, p.category);
      return sanitizePrediction(p, hasAccess);
    });

    res.json(sanitized);
  });

  // 5. Advertisements / Banners (Public)
  app.get('/api/banners', (_req, res) => {
    const banners = db.get().advertisements.filter((b) => b.active).sort((a, b) => a.order - b.order);
    res.json(banners);
  });

  // 6. User Subscriptions & Access Status
  app.get('/api/subscriptions/my', requireUserAuth, (req, res) => {
    const user = (req as any).user as User;
    cleanupExpiredSubscriptions();
    const now = new Date();

    const userSubs = db
      .get()
      .subscriptions.filter((s) => s.userId === user.id)
      .map((s) => {
        const exp = new Date(s.expiresAt);
        const remSeconds = Math.max(0, Math.floor((exp.getTime() - now.getTime()) / 1000));
        return {
          ...s,
          remainingSeconds: remSeconds,
          isLive: s.status === 'ACTIVE' && remSeconds > 0,
        };
      });

    res.json(userSubs);
  });

  // 7. Payments - Submit Manual Payment Confirmation
  app.post('/api/payments/submit', requireUserAuth, (req, res) => {
    try {
      const user = (req as any).user as User;
      const { packageId, transactionId, phone, paymentMethod } = req.body;

      if (!packageId || !transactionId || !phone) {
        return res.status(400).json({ error: 'Tafadhali jaza namba ya simu na namba ya muamala (Transaction ID).' });
      }

      const pkg = db.get().packages.find((p) => p.id === packageId);
      if (!pkg) {
        return res.status(404).json({ error: 'Kifurushi hakijapatikana.' });
      }

      const cleanTxId = String(transactionId).trim().toUpperCase();

      // Check if transaction ID already exists for approved/pending
      const dup = db.get().payments.find((p) => p.transactionId === cleanTxId && p.status !== 'REJECTED');
      if (dup) {
        return res.status(400).json({
          error: 'Namba hii ya muamala tayari imewasilishwa. Subiri ithibitishwe na msimamizi au wasiliana nasi.',
        });
      }

      const newPayment: Payment = {
        id: `pay-${crypto.randomUUID()}`,
        userId: user.id,
        userName: user.name,
        userPhone: String(phone).trim(),
        packageId: pkg.id,
        packageCode: pkg.code,
        packageName: pkg.name,
        amount: pkg.price,
        transactionId: cleanTxId,
        paymentMethod: paymentMethod || 'M-Pesa / Tigo Pesa / Airtel Money',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      db.get().payments.push(newPayment);

      // In-app notification for the user
      db.get().notifications.push({
        id: `notif-${crypto.randomUUID()}`,
        userId: user.id,
        title: 'Ombi la Malipo Limepokelewa',
        message: `Malipo yako ya TZS ${pkg.price.toLocaleString()} kwa ${pkg.name} (Muamala: ${cleanTxId}) yanapitiwa na msimamizi. Utaarifiwa mara moja yakithibitishwa!`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.save();

      return res.json({
        success: true,
        message: 'Ombi la malipo limewasilishwa kwa ufanisi. Msimamizi atathibitisha ndani ya dakika chache.',
        payment: newPayment,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuwasilisha malipo' });
    }
  });

  // 8. User's Payment History
  app.get('/api/payments/my', requireUserAuth, (req, res) => {
    const user = (req as any).user as User;
    const myPayments = db
      .get()
      .payments.filter((p) => p.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(myPayments);
  });

  // 9. User Notifications
  app.get('/api/notifications/my', requireUserAuth, (req, res) => {
    const user = (req as any).user as User;
    const userNotifs = db
      .get()
      .notifications.filter((n) => n.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(userNotifs);
  });

  app.post('/api/notifications/mark-read', requireUserAuth, (req, res) => {
    const user = (req as any).user as User;
    db.get().notifications.forEach((n) => {
      if (n.userId === user.id) {
        n.read = true;
      }
    });
    db.save();
    res.json({ success: true });
  });

  // =================== SECURE ADMIN ROUTES ===================

  // Admin Login (Username: smk, Initial password: 2468)
  app.post('/api/admin/login', (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Weka jina la mtumiaji (username) na nenosiri.' });
      }

      const admin = db.get().admin;
      if (username !== admin.username || !verifyPassword(String(password), admin.salt, admin.passwordHash)) {
        return res.status(401).json({ error: 'Taarifa za msimamizi si sahihi.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(); // 7 days admin session

      db.get().sessions.push({
        token,
        userId: admin.id,
        role: 'admin',
        createdAt: new Date().toISOString(),
        expiresAt,
      });

      db.save();

      return res.json({
        token,
        admin: {
          username: admin.username,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuingia kwa msimamizi' });
    }
  });

  app.get('/api/admin/me', requireAdminAuth, (_req, res) => {
    res.json({ username: db.get().admin.username });
  });

  // Change Admin Password
  app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Weka nenosiri la sasa na nenosiri jipya.' });
      }

      const admin = db.get().admin;
      if (!verifyPassword(String(currentPassword), admin.salt, admin.passwordHash)) {
        return res.status(400).json({ error: 'Nenosiri la sasa si sahihi.' });
      }

      if (String(newPassword).length < 4) {
        return res.status(400).json({ error: 'Nenosiri jipya liwe na angalau tarakimu 4.' });
      }

      const newSalt = crypto.randomBytes(16).toString('hex');
      admin.salt = newSalt;
      admin.passwordHash = hashPassword(String(newPassword), newSalt);
      admin.updatedAt = new Date().toISOString();

      db.save();
      return res.json({ success: true, message: 'Nenosiri la msimamizi limebadilishwa kikamilifu!' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kubadili nenosiri' });
    }
  });

  // Admin Dashboard Statistics
  app.get('/api/admin/stats', requireAdminAuth, (_req, res) => {
    cleanupExpiredSubscriptions();
    const data = db.get();

    const approvedPayments = data.payments.filter((p) => p.status === 'APPROVED');
    const totalSales = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingCount = data.payments.filter((p) => p.status === 'PENDING').length;
    const activeVips = data.subscriptions.filter(
      (s) => s.status === 'ACTIVE' && new Date(s.expiresAt) > new Date()
    ).length;

    const finishedTips = data.predictions.filter((p) => p.status === 'WON' || p.status === 'LOST');
    const wonTips = data.predictions.filter((p) => p.status === 'WON');
    const winRate = finishedTips.length > 0 ? Math.round((wonTips.length / finishedTips.length) * 100) : 94;

    const stats: AdminStats = {
      totalSalesTzs: totalSales,
      pendingPaymentsCount: pendingCount,
      approvedPaymentsCount: approvedPayments.length,
      activeVipUsersCount: activeVips,
      totalUsersCount: data.users.length,
      totalPredictionsCount: data.predictions.length,
      winRatePercentage: winRate,
    };

    res.json(stats);
  });

  // Admin Payments Management
  app.get('/api/admin/payments', requireAdminAuth, (_req, res) => {
    const list = [...db.get().payments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(list);
  });

  // APPROVE PAYMENT
  app.post('/api/admin/payments/:id/approve', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const payment = db.get().payments.find((p) => p.id === id);

      if (!payment) {
        return res.status(404).json({ error: 'Malipo hayajapatikana.' });
      }

      if (payment.status === 'APPROVED') {
        return res.status(400).json({ error: 'Malipo haya tayari yalithibitishwa.' });
      }

      const pkg = db.get().packages.find((p) => p.id === payment.packageId);
      const durationDays = pkg ? pkg.durationDays : 1;

      // Calculate expiry date
      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + durationDays * 24 * 3600 * 1000);

      payment.status = 'APPROVED';
      payment.approvedAt = startedAt.toISOString();
      payment.expiresAt = expiresAt.toISOString();

      // Create or update subscription
      const newSub: Subscription = {
        id: `sub-${crypto.randomUUID()}`,
        userId: payment.userId,
        packageId: payment.packageId,
        packageCode: payment.packageCode,
        packageName: payment.packageName,
        paymentId: payment.id,
        startedAt: startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'ACTIVE',
      };

      db.get().subscriptions.push(newSub);

      // In-app notification for the user
      db.get().notifications.push({
        id: `notif-${crypto.randomUUID()}`,
        userId: payment.userId,
        title: '🎉 UTHIBITISHO WA MALIPO - VIP IMEFUNGULIWA!',
        message: `Hongera sana! Malipo yako ya TZS ${payment.amount.toLocaleString()} kwa kifurushi cha ${payment.packageName} Yamethibitishwa. Sasa una access kamili ya mikeka yote ya VIP hadi tarehe ${expiresAt.toLocaleDateString('sw-TZ')} saa ${expiresAt.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}.`,
        type: 'PAYMENT_APPROVED',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.save();

      return res.json({ success: true, payment, subscription: newSub });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuthibitisha malipo' });
    }
  });

  // REJECT PAYMENT
  app.post('/api/admin/payments/:id/reject', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const payment = db.get().payments.find((p) => p.id === id);

      if (!payment) {
        return res.status(404).json({ error: 'Malipo hayajapatikana.' });
      }

      payment.status = 'REJECTED';
      payment.rejectedAt = new Date().toISOString();
      payment.rejectionReason = reason || 'Kumbukumbu ya muamala haikupatikana au kiasi hakikidhi.';

      // In-app notification
      db.get().notifications.push({
        id: `notif-${crypto.randomUUID()}`,
        userId: payment.userId,
        title: 'Taarifa ya Malipo Yasiyothibitishwa',
        message: `Samahani, muamala wako ${payment.transactionId} kwa ajili ya ${payment.packageName} haukuthibitishwa. Sababu: ${payment.rejectionReason}. Tafadhali piga/WhatsApp 0743997707 kwa msaada wa haraka.`,
        type: 'PAYMENT_REJECTED',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.save();
      return res.json({ success: true, payment });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kukataa malipo' });
    }
  });

  // Admin Subscriptions View
  app.get('/api/admin/subscriptions', requireAdminAuth, (_req, res) => {
    cleanupExpiredSubscriptions();
    const subs = [...db.get().subscriptions].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    res.json(subs);
  });

  // Admin Predictions CRUD
  app.get('/api/admin/predictions', requireAdminAuth, (_req, res) => {
    res.json(db.get().predictions);
  });

  app.post('/api/admin/predictions', requireAdminAuth, (req, res) => {
    try {
      const { league, match, homeTeam, awayTeam, matchTime, prediction, odds, confidence, category, status, analysis, slipCode } =
        req.body;

      if (!match || !prediction || !odds) {
        return res.status(400).json({ error: 'Mechi, utabiri, na odds ni lazima.' });
      }

      const newPred: Prediction = {
        id: `pred-${crypto.randomUUID()}`,
        league: league || 'WORLD',
        match,
        homeTeam: homeTeam || match.split('vs')[0]?.trim() || match,
        awayTeam: awayTeam || match.split('vs')[1]?.trim() || '',
        matchTime: matchTime || new Date().toISOString(),
        prediction,
        odds: parseFloat(odds) || 1.5,
        confidence: parseInt(confidence) || 90,
        status: status || 'PENDING',
        category: category || 'FREE',
        analysis,
        slipCode: slipCode || `WHL-${Date.now().toString().slice(-4)}`,
      };

      db.get().predictions.unshift(newPred);
      db.save();
      return res.json(newPred);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuongeza utabiri' });
    }
  });

  app.put('/api/admin/predictions/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const target = db.get().predictions.find((p) => p.id === id);
      if (!target) return res.status(404).json({ error: 'Utabiri haujapatikana.' });

      Object.assign(target, req.body);
      if (req.body.odds) target.odds = parseFloat(req.body.odds);
      if (req.body.confidence) target.confidence = parseInt(req.body.confidence);

      db.save();
      return res.json(target);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kurekebisha utabiri' });
    }
  });

  app.delete('/api/admin/predictions/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const idx = db.get().predictions.findIndex((p) => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Utabiri haujapatikana.' });

      db.get().predictions.splice(idx, 1);
      db.save();
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kufuta utabiri' });
    }
  });

  // Admin Packages CRUD
  app.put('/api/admin/packages/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const target = db.get().packages.find((p) => p.id === id);
      if (!target) return res.status(404).json({ error: 'Kifurushi hakijapatikana.' });

      Object.assign(target, req.body);
      if (req.body.price) target.price = parseInt(req.body.price);
      if (req.body.durationDays) target.durationDays = parseInt(req.body.durationDays);

      db.save();
      return res.json(target);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kurekebisha kifurushi' });
    }
  });

  // Admin Advertisements CRUD
  app.get('/api/admin/banners', requireAdminAuth, (_req, res) => {
    res.json(db.get().advertisements);
  });

  app.post('/api/admin/banners', requireAdminAuth, (req, res) => {
    try {
      const { title, description, imageUrl, buttonText, buttonLink, badgeText, active, order } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Kichwa cha habari na maelezo ni lazima.' });
      }

      const newBanner: Advertisement = {
        id: `banner-${crypto.randomUUID()}`,
        title,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
        buttonText: buttonText || 'JIFUNZE ZAIDI',
        buttonLink: buttonLink || '#vip',
        active: active !== false,
        order: parseInt(order) || db.get().advertisements.length + 1,
        badgeText,
      };

      db.get().advertisements.push(newBanner);
      db.save();
      return res.json(newBanner);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuongeza tangazo' });
    }
  });

  app.put('/api/admin/banners/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const target = db.get().advertisements.find((b) => b.id === id);
      if (!target) return res.status(404).json({ error: 'Tangazo halijapatikana.' });

      Object.assign(target, req.body);
      db.save();
      return res.json(target);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kurekebisha tangazo' });
    }
  });

  app.delete('/api/admin/banners/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const idx = db.get().advertisements.findIndex((b) => b.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Tangazo halijapatikana.' });

      db.get().advertisements.splice(idx, 1);
      db.save();
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kufuta tangazo' });
    }
  });

  // Admin Users List
  app.get('/api/admin/users', requireAdminAuth, (_req, res) => {
    const list = db.get().users.map((u) => {
      const activeSub = db.get().subscriptions.find(
        (s) => s.userId === u.id && s.status === 'ACTIVE' && new Date(s.expiresAt) > new Date()
      );
      const totalPayments = db.get().payments.filter((p) => p.userId === u.id && p.status === 'APPROVED');
      const totalSpent = totalPayments.reduce((sum, p) => sum + p.amount, 0);

      return {
        id: u.id,
        phone: u.phone,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
        hasActiveVip: !!activeSub,
        activePackage: activeSub ? activeSub.packageName : null,
        vipExpiresAt: activeSub ? activeSub.expiresAt : null,
        totalSpentTzs: totalSpent,
        totalPurchases: totalPayments.length,
      };
    });
    res.json(list);
  });

  // Admin Settings Update
  app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
    try {
      const current = db.get().settings;
      Object.assign(current, req.body);
      db.save();
      return res.json(current);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hitilafu ya kuhifadhi mipangilio' });
    }
  });

  // =================== VITE MIDDLEWARE / STATIC ASSETS ===================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server WASHINDI WA LEO running on http://localhost:${PORT}`);
  });
}

startServer();
