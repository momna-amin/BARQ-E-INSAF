import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f3ef' },

  header: {
    backgroundColor: '#1B4332', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'column' },
  brandName: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  brandSub: { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center',
  },
  notifIcon: { fontSize: 16 },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  orgName: { fontSize: 16, fontWeight: '800', color: '#fff', marginTop: 14 },
  orgSub: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  statChip: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statNum: { fontSize: 17, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: '500' },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 100 },

  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 18, marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 0.08,
    color: '#aaa', textTransform: 'uppercase',
  },
  seeAllText: { fontSize: 11, fontWeight: '700', color: '#1B4332' },

  mapCard: {
    backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#ece9e4', overflow: 'hidden',
  },
  mapVisual: {
    height: 120, backgroundColor: '#E0F2F1',
    flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 5, alignContent: 'flex-start',
  },
  mapDot: { borderRadius: 4 },
  mapFooter: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapLabel: { fontSize: 12, fontWeight: '700', color: '#1a1a1a' },
  mapSub: { fontSize: 10, color: '#999', marginTop: 2 },

  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  barLabel: { fontSize: 11, color: '#555', width: 75 },
  barTrack: { flex: 1, height: 7, backgroundColor: '#f0ece8', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barVal: { fontSize: 11, fontWeight: '700', color: '#333', width: 32, textAlign: 'right' },

  insightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  insightCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 13,
    width: (width - 38) / 2, borderWidth: 1, borderColor: '#ece9e4',
  },
  insightNum: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  insightLabel: { fontSize: 10, color: '#999', marginTop: 3 },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ece9e4',
    flexDirection: 'row', height: 68, paddingBottom: 8,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 9, fontWeight: '600', color: '#bbb', letterSpacing: 0.2 },
  navLabelActive: { color: '#1B4332' },
  navActiveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#1B4332', marginTop: 1 },
});