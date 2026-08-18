// ─────────────────────────────────────────────
//  BARQ-E-INSAF — Global Theme
//  Import anywhere: import theme from '../constants/theme';
// ─────────────────────────────────────────────

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ── COLORS ────────────────────────────────────
export const colors = {

  // Background
  bgDark:        '#092d70',   // container fallback
  bgGrad1:       '#14557a',   // gradient stop 1
  bgGrad2:       '#040808',   // gradient stop 2
  bgGrad3:       '#141363',   // gradient stop 3
  bgGrad4:       '#180669',   // gradient stop 4

  // Bottom white card
  cardBg:        '#ffffff',
  cardHandle:    '#e2e8f0',

  // Primary blue button (GET STARTED / arrows)
  btnBlue1:      '#0232b6',
  btnBlue2:      '#2563eb',
  btnBlue3:      '#5694f8',

  // Secondary button
  btnSecBg:      '#F8FAFC',
  btnSecBorder:  '#CBD5E1',
  btnSecText:    '#0951aa',

  // Text
  textWhite:     '#ffffff',
  textTitle:     '#0F2744',
  textSubBlue:   '#3b82f6',
  textPoetry:    '#181a8d',
  textMuted:     '#868eb6',
  textHint:      'rgba(255,255,255,0.4)',
  textFaint:     'rgba(255,255,255,0.2)',

  // Orb
  orbGrad1:      '#1eb7c2',
  orbGrad2:      '#1b45ce',
  orbGrad3:      '#1d8cf8',
  orbGrad4:      '#07c2b9',
  orbGrad5:      '#0661d8',
  orbGlow:       'rgba(37,99,235,0.18)',
  orbShadow:     'rgba(37,99,235,0.3)',
  orbVignette:   'rgba(8,8,8,0.2)',
  orbEye1:       '#ffffff',
  orbEye2:       '#e0f2fe',
  orbShine1:     'rgba(255,255,255,0.22)',
  orbShine2:     'rgba(255,255,255,0.12)',
  orbHaze1:      'rgba(37,99,235,0.14)',
  orbHaze2:      'rgba(14,165,233,0.10)',
  orbHaze3:      'rgba(96,165,250,0.08)',
  orbHaze4:      'rgba(37,99,235,0.06)',

  // Orbit rings
  ring1:         'rgba(96,165,250,0.25)',
  ring2:         'rgba(14,165,233,0.15)',
  ring3:         'rgba(147,197,253,0.12)',

  // Particles
  particle:      '#60a5fa',

  // Ambient blobs
  blob1:         'rgba(37,99,235,0.09)',
  blob2:         'rgba(99,179,237,0.07)',
  blob3:         'rgba(14,165,233,0.05)',

  // Status dot
  statusGreen:   '#4ade80',

  // Lightning badge
  lightning1:    '#FCD34D',
  lightning2:    '#F59E0B',
  lightning3:    '#D97706',

  // Role accent colors (for dark backgrounds)
  citizenAccent:  '#f87171',
  citizenLight:   'rgba(248,113,113,0.12)',
  citizenBorder:  'rgba(248,113,113,0.22)',

  lawyerAccent:   '#60a5fa',
  lawyerLight:    'rgba(96,165,250,0.12)',
  lawyerBorder:   'rgba(96,165,250,0.22)',

  ngoAccent:      '#4ade80',
  ngoLight:       'rgba(74,222,128,0.12)',
  ngoBorder:      'rgba(74,222,128,0.22)',

  adminAccent:    '#cbd5e1',
  adminLight:     'rgba(203,213,225,0.08)',
  adminBorder:    'rgba(203,213,225,0.15)',

  // Role accent colors (for light/white backgrounds)
  citizenDark:    '#C0392B',
  lawyerDark:     '#0F2744',
  ngoDark:        '#1B4332',
  adminDark:      '#1A0533',
};

// ── GRADIENTS ─────────────────────────────────
export const gradients = {
  background:   [colors.bgGrad1, colors.bgGrad2, colors.bgGrad3, colors.bgGrad4],
  primaryBtn:   [colors.btnBlue1, colors.btnBlue2, colors.btnBlue3],
  orb:          [colors.orbGrad1, colors.orbGrad2, colors.orbGrad3, colors.orbGrad4, colors.orbGrad5],
  lightning:    [colors.lightning1, colors.lightning2, colors.lightning3],
};

// ── BACKGROUND GRADIENT DIRECTION ─────────────
export const gradientDir = {
  start: { x: 0, y: 0 },
  end:   { x: 1, y: 1 },
  horizontal: {
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 0 },
  },
  vertical: {
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },
};

// ── AMBIENT BLOBS ─────────────────────────────
// Use these as position/size props on absolute Views
export const blobs = [
  {
    top:             height * 0.02,
    left:            -width * 0.2,
    width:           width * 0.65,
    height:          width * 0.65,
    borderRadius:    width * 0.35,
    backgroundColor: colors.blob1,
  },
  {
    top:             height * 0.18,
    right:           -width * 0.15,
    width:           width * 0.55,
    height:          width * 0.55,
    borderRadius:    width * 0.3,
    backgroundColor: colors.blob2,
  },
  {
    top:             height * 0.35,
    left:            width * 0.1,
    width:           width * 0.4,
    height:          width * 0.4,
    borderRadius:    width * 0.22,
    backgroundColor: colors.blob3,
  },
];

// ── PARTICLES ─────────────────────────────────
export const particleConfig = [
  { x: width * 0.08, y: height * 0.08, size: 5, duration: 3200 },
  { x: width * 0.82, y: height * 0.12, size: 3, duration: 4100 },
  { x: width * 0.15, y: height * 0.32, size: 4, duration: 2800 },
  { x: width * 0.75, y: height * 0.28, size: 6, duration: 3700 },
  { x: width * 0.35, y: height * 0.05, size: 3, duration: 4400 },
  { x: width * 0.65, y: height * 0.38, size: 4, duration: 3000 },
];

// ── ORB SIZE & SETTINGS ───────────────────────
export const ORB_SIZE = width * 0.55;

export const orbConfig = {
  size:           ORB_SIZE,
  borderRadius:   ORB_SIZE / 2,

  // Float animation
  floatY:         { toValue: -18, duration: 2800 },
  floatX:         { toValue: 7,   duration: 3600 },

  // Glow pulse
  glowScaleTo:    1.15,
  glowDuration:   2400,

  // Rotation
  rotateDuration: 11000,
  ring2Duration:  16000,

  // Blink — fires every 8–13 seconds randomly
  blinkMinDelay:  8000,
  blinkRandRange: 5000,
  blinkClose:     { toValue: 0.06, duration: 90 },
  blinkOpen:      { toValue: 1,    duration: 110 },

  // Button pulse
  btnPulseTo:     1.025,
  btnPulseDur:    1400,

  // Sizes relative to ORB_SIZE
  outerGlowSize:  ORB_SIZE + 120,
  ring1Size:      ORB_SIZE + 66,
  ring2Size:      ORB_SIZE + 44,
  innerRingSize:  ORB_SIZE + 20,
  hazeRingSize:   ORB_SIZE + 28,
  shadowWidth:    ORB_SIZE * 0.68,

  // Eye sizes
  eyeWidth:       16,
  eyeHeight:      40,
  eyeGap:         28,
  eyeBorderRad:   10,

  // Shine positions
  shine1: {
    top:           ORB_SIZE * 0.11,
    left:          ORB_SIZE * 0.17,
    width:         ORB_SIZE * 0.2,
    height:        ORB_SIZE * 0.09,
  },
  shine2: {
    top:           ORB_SIZE * 0.22,
    left:          ORB_SIZE * 0.58,
    size:          ORB_SIZE * 0.08,
  },

  // Vignette border
  vignetteBorder: 32,
};

// ── TYPOGRAPHY ────────────────────────────────
export const typography = {
  titleFont:      'RacingSansOne_400Regular',
  titleSize:      35,
  titleColor:     colors.textTitle,
  titleSpacing:   -0.5,

  subtitleSize:   12,
  subtitleColor:  colors.textSubBlue,
  subtitleWeight: '700',

  poetrySize:     15,
  poetryWeight:   '600',
  poetryColor:    colors.textPoetry,
  poetryLine:     26,
  poetrySpacing:  0.3,

  hintSize:       10,
  hintWeight:     '500',
  hintSpacing:    0.5,

  labelSize:      15,
  labelWeight:    '700',
  labelColor:     colors.textWhite,

  subSize:        11,
  subWeight:      '500',
  subColor:       'rgba(255,255,255,0.38)',
};

// ── SPACING & RADII ───────────────────────────
export const spacing = {
  screenH:        24,   // horizontal screen padding
  screenV:        20,   // vertical screen padding
  cardPadH:       24,
  cardPadT:       14,
  cardPadB:       50,
  cardRadius:     36,
  cardHandleW:    38,
  cardHandleH:    4,
  btnRadius:      16,
  btnPadV:        17,
  btnPadH:        20,
  iconWrapSize:   46,
  iconWrapRadius: 13,
  iconSize:       22,
  arrowBoxSize:   38,
  arrowBoxRadius: 12,
  accentBarW:     3,
};

// ── SHADOWS ───────────────────────────────────
export const shadows = {
  card: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius:  20,
    elevation:     20,
  },
  roleCard: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  10,
    elevation:     5,
  },
  orbBody: {
    shadowColor:   '#2563eb',
    shadowOffset:  { width: 0, height: 20 },
    shadowOpacity: 0.55,
    shadowRadius:  36,
    elevation:     24,
  },
  outerGlow: {
    shadowColor:   '#2563eb',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius:  40,
  },
};

// ── ROLE CONFIG (reusable across screens) ──────
export const roleConfig = {
  citizen: {
    label:      'Citizen Portal',
    color:      '#5C1A1A',
    topColor:   '#7B2020',
    accent:     colors.citizenAccent,
    accentLight:colors.citizenLight,
    accentBorder:colors.citizenBorder,
  },
  lawyer: {
    label:      'Lawyer Portal',
    color:      '#0F2744',
    topColor:   '#1A3A5C',
    accent:     colors.lawyerAccent,
    accentLight:colors.lawyerLight,
    accentBorder:colors.lawyerBorder,
  },
  ngo: {
    label:      'NGO / Media Portal',
    color:      '#1B4332',
    topColor:   '#245C42',
    accent:     colors.ngoAccent,
    accentLight:colors.ngoLight,
    accentBorder:colors.ngoBorder,
  },
  admin: {
    label:      'Admin Panel',
    color:      '#1A0533',
    topColor:   '#2D0D52',
    accent:     colors.adminAccent,
    accentLight:colors.adminLight,
    accentBorder:colors.adminBorder,
  },
};

// ── DEFAULT EXPORT ────────────────────────────
const theme = {
  colors,
  gradients,
  gradientDir,
  blobs,
  particleConfig,
  ORB_SIZE,
  orbConfig,
  typography,
  spacing,
  shadows,
  roleConfig,
};

export default theme;