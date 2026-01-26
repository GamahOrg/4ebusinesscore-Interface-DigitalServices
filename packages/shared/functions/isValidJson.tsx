export const isValidJson = (str: string) => {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object';
  } catch (e) {
    return false;
  }
};