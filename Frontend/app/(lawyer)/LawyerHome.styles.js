import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f3ef',
  },
  header: {
    backgroundColor: '#0F2744',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 52 : 44,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ece9e4',
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
    backgroundColor: '#ffffff',
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F2744',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoBadgeText: {
    color: '#0F2744',
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
    color: 'rgba(255, 255, 255, 0.8)',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  profileBtnText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F2744',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sbcBadgeText: {
    fontSize: 11,
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ece9e4',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F2744',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
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
    color: '#1a1a1a',
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
    color: '#0F2744',
  },

  // REQUEST CARDS
  reqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ece9e4',
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
    color: '#1a1a1a',
  },
  reqSpecTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  reqSpecTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369a1',
  },
  reqMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  reqMetaText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  reqDesc: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 19,
    marginBottom: 14,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reqActions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#0F2744',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
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
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  declineBtnText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '800',
  },

  // CASE CARDS
  caseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ece9e4',
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
    color: '#1a1a1a',
  },
  caseCourt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F2744',
    marginBottom: 4,
  },
  caseClient: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
  },
  caseDesc: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 10,
  },
  caseFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f3ef',
  },
  evidenceCount: {
    fontSize: 11,
    color: '#0F2744',
    fontWeight: '700',
  },
  manageBtnText: {
    fontSize: 12,
    color: '#0F2744',
    fontWeight: '800',
  },

  // BOTTOM NAV
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: 80,
    paddingBottom: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ece9e4',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#bbbbbb',
  },
  navLabelActive: {
    color: '#0F2744',
    fontWeight: '800',
  },
});