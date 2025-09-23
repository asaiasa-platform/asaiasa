// Utility to map common variant names to Button color props
export const getButtonColor = (variant?: string): string => {
  switch (variant) {
    case 'outline':
      return 'secondary';
    case 'ghost':
      return 'tertiary';
    case 'destructive':
      return 'primary-destructive';
    case 'link':
      return 'link-color';
    case 'default':
    case 'primary':
    default:
      return 'primary';
  }
};
