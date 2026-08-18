import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f3ef' },
  header: {
    backgroundColor: '#1B4332', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16,
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

  legendRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#555', fontWeight: '600' },

  districtCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 13, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#ece9e4',
  },
  districtIcon: { fontSize: 20 },
  districtInfo: { flex: 1 },
  districtName: { fontSize: 13, fontWeight: '700', color: '#1a1a1a' },
  districtMeta: { fontSize: 11, color: '#999', marginTop: 2 },
  severityBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 50 },
  sevCritical: { backgroundColor: '#fee2e2', color: '#991b1b' },
  sevHigh: { backgroundColor: '#fef3c7', color: '#92400e' },
  sevCovered: { backgroundColor: '#dcfce7', color: '#166534' },
});