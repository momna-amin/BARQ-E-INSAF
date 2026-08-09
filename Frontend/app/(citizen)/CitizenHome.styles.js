import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#f5f3ef',
  },

  // HEADER
  header: {
    backgroundColor: '#5C1A1A',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brand: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 1,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchIcon: {
    fontSize: 14,
    opacity: 0.6,
  },
  searchText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },

  // AI CARD
  aiCard: {
    margin: 14,
    marginBottom: 0,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  aiSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  aiArrow: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.3)',
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 100,
  },

  // SECTION LABEL
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.08,
    color: '#aaa',
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 10,
  },

  // STATS ROW
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
    fontWeight: '500',
  },

  // QUICK GRID
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    width: (width - 42) / 2,
    borderWidth: 1,
    borderColor: '#ece9e4',
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  quickSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    lineHeight: 15,
  },

  // BUILD A CASE BUTTON
  buildCaseBtn: {
    backgroundColor: '#5C1A1A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buildCaseBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // LAWYER BUBBLES
  lawyerRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 4,
  },
  lawyerBubble: {
    alignItems: 'center',
    gap: 5,
    width: 64,
  },
  lawyerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lawyerAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  lawyerName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  lawyerSpec: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  sbcBadge: {
    fontSize: 9,
    color: '#5C1A1A',
    fontWeight: '700',
    backgroundColor: '#f5e8e8',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },

  // CASE ITEMS
  caseItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 13,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ece9e4',
  },
  caseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  caseInfo: {
    flex: 1,
  },
  caseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  caseSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 50,
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgeAmber: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  badgeRed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },

  // BOTTOM NAV
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ece9e4',
    flexDirection: 'row',
    height: 68,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#bbb',
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: '#5C1A1A',
  },
  navActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5C1A1A',
    marginTop: 1,
  },

  // MODAL OVERLAY
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // POPUP STYLES
  popupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  popupSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  caseTypeOption: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  caseTypeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  caseTypeInfo: {
    flex: 1,
  },
  caseTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  caseTypeDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  popupCloseBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  popupCloseBtnText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  // Add to CitizenHome.styles.js
buildCaseBtn: {
  backgroundColor: '#5C1A1A',
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  marginBottom: 4,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
buildCaseBtnText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '700',
},

// Keep these popup styles
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
popupContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 24,
  width: '100%',
  maxWidth: 400,
},
popupTitle: {
  fontSize: 24,
  fontWeight: '700',
  color: '#1a1a1a',
  marginBottom: 8,
  textAlign: 'center',
},
popupSubtitle: {
  fontSize: 14,
  color: '#666',
  marginBottom: 24,
  textAlign: 'center',
  lineHeight: 20,
},
caseTypeOption: {
  flexDirection: 'row',
  padding: 16,
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  marginBottom: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#e8e8e8',
},
caseTypeIcon: {
  fontSize: 32,
  marginRight: 16,
},
caseTypeInfo: {
  flex: 1,
},
caseTypeTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: 4,
},
caseTypeDesc: {
  fontSize: 13,
  color: '#666',
  lineHeight: 18,
},
popupCloseBtn: {
  marginTop: 8,
  paddingVertical: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 12,
},
popupCloseBtnText: {
  fontSize: 16,
  color: '#666',
  fontWeight: '500',
},
});