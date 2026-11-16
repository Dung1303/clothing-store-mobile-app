import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  header: {
    backgroundColor: '#287A50',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  subtitle: {
    color: '#E5F1E9',
    fontSize: 13,
    marginTop: 5,
  },
  body: {
    padding: 15,
    paddingBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 13,
    marginBottom: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  grow: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    color: '#20352A',
    fontSize: 15,
    fontWeight: '700',
  },
  muted: {
    color: '#718078',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#287A50',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#287A50',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: '#287A50',
    fontSize: 12,
    fontWeight: '600',
  },
  danger: {
    backgroundColor: '#D94848',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    elevation: 5,
  },
  modalTitle: {
    color: '#20352A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8E0DA',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#20352A',
    marginBottom: 12,
  },
});

export default styles;
