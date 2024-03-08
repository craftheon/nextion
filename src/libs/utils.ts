export function toCamelCase(str: string) {
  return str.replace(/[\s_-](\w)/g, function (match, p1) {
    return p1.toUpperCase();
  }).replace(/^[A-Z]/, function (match) {
    return match.toLowerCase();
  });
}