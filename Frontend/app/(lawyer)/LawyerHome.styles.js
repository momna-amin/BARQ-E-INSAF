import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#07152E',
  },
  header: {
    backgroundColor: '#0F2744',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 52 : 44,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    backgroundColor: '#fbbf24',
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  logoBadgeText: {
    color: '#07152E',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brand: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  brandSub: {
    fontSize: 11,
    color: '#fbbf24',
    marginTop: 1,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  profileBtnText: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '700',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#07152E',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  sbcBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  sbcBadgeText: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '800',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },

  // STATS BAR
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0F2744',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fbbf24',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // SECTION HEADERS
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  badgeCount: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeCountText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fbbf24',
  },

  // REQUEST CARDS
  reqCard: {
    backgroundColor: 'rgba(15, 39, 68, 0.75)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  reqSpecTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  reqSpecTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3b82f6',
  },
  reqMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  reqMetaText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  reqDesc: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 19,
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reqActions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  acceptBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  declineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
  },
  declineBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },

  // CASE CARDS
  caseCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  caseCourt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  caseClient: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
  },
  caseDesc: {
    fontSize: 12,
    color: '#cbd5e1',
    marginBottom: 10,
  },
  caseFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  evidenceCount: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '700',
  },
  manageBtnText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '800',
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0F2744',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  navLabelActive: {
    color: '#fbbf24',
    fontWeight: '800',
  },
});