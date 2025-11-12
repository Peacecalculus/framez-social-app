import { StyleSheet } from 'react-native';

// Shared colors
export const colors = {
  primary: '#3797f0',
  primaryLight: '#9acaf7',
  textPrimary: '#262626',
  textSecondary: '#8e8e8e',
  border: '#dbdbdb',
  background: '#fff',
  inputBackground: '#fafafa',
};

// Shared style objects that can be reused across screens
export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  // Auth screens
  authHeader: {
    alignItems: 'center',
    marginBottom: 50,
  },

  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Forms
  form: {
    width: '100%',
  },

  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
  },

  // Buttons
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    backgroundColor: colors.primaryLight,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Links and footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Common elements
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
