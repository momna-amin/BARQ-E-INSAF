import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f3ef' },
  header: {
    backgroundColor: '#0F2744', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center',
  },
  backText: { fontSize: 16, color: '#fff' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBadge: {
    backgroundColor: '#fff', width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  logoBadgeText: { color: '#0F2744', fontSize: 14, fontWeight: '800' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff', flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  caseCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#ece9e4',
  },
  caseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  caseTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  activeBadge: {
    fontSize: 10, fontWeight: '700',
    backgroundColor: '#dcfce7', color: '#166534',
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 50,
  },
  caseMeta: { fontSize: 12, color: '#888', marginBottom: 4 },
  problemBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  problemLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  caseDescription: { fontSize: 13, color: '#444', lineHeight: 18 },
  caseFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5f3f0',
  },
  caseFooterText: { fontSize: 11, color: '#999' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ece9e4',
    flexDirection: 'row',
    height: 80,
    paddingBottom: 24,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, fontWeight: '600', color: '#bbb' },
  navLabelActive: { color: '#0F2744' },
});