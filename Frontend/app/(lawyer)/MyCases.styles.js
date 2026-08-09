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
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff', flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 50,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ece9e4',
  },
  filterChipActive: { backgroundColor: '#0F2744', borderColor: '#0F2744' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#888' },
  filterTextActive: { color: '#fff' },

  caseCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#ece9e4',
  },
  caseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  caseTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  badge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 50 },
  badgeBlue: { backgroundColor: '#dbeafe', color: '#1e40af' },
  badgeAmber: { backgroundColor: '#fef3c7', color: '#92400e' },
  badgeGreen: { backgroundColor: '#dcfce7', color: '#166534' },
  caseMeta: { fontSize: 12, color: '#888', marginBottom: 4 },
  caseFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5f3f0',
  },
  caseFooterText: { fontSize: 11, color: '#999' },
  notesBtn: { backgroundColor: '#0F2744', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  notesBtnText: { fontSize: 11, fontWeight: '700', color: '#fff' },
});