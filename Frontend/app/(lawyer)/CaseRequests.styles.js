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

  reqCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#ece9e4',
  },
  reqTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  reqName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  badgeNew: {
    fontSize: 10, fontWeight: '700',
    backgroundColor: '#fef9c3', color: '#713f12',
    borderWidth: 1, borderColor: '#fde68a',
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 50,
  },
  reqMeta: { fontSize: 12, color: '#888', marginBottom: 3 },
  attachRow: {
    flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 10,
  },
  attachPill: {
    backgroundColor: '#f0ece8', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  attachText: { fontSize: 10, color: '#666', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  acceptBtn: { flex: 1, backgroundColor: '#0F2744', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  acceptText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  declineBtn: {
    flex: 1, backgroundColor: '#f3f4f6', borderRadius: 10, paddingVertical: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  declineText: { color: '#666', fontSize: 12, fontWeight: '700' },
});