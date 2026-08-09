import { StyleSheet } from 'react-native';

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    width: 30,
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // CASE TYPE BANNER
  caseTypeBanner: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ece9e4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseTypeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  caseTypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // FORM
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formTextArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  // EVIDENCE SECTION
  evidenceSection: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ece9e4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  evidenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addEvidenceBtn: {
    backgroundColor: '#5C1A1A',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addEvidenceBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  evidenceHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  evidenceIcon: {
    marginRight: 12,
  },
  evidenceIconText: {
    fontSize: 28,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  evidenceMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  evidenceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  evidenceActionBtn: {
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  evidenceActionText: {
    fontSize: 16,
  },
  emptyEvidence: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  emptyEvidenceText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyEvidenceSub: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },

  // SUBMIT BUTTON
  submitBtn: {
    backgroundColor: '#5C1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});