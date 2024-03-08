export function toCamelCase(str: string) {
  return str.replace(/_([a-z])/g, function (match, group1) {
    return group1.toUpperCase();
  });
}