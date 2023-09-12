
// call with makeRel(import.meta.url), returns a function that resolves relative paths
export default function makeRel (importURL: string) {
  return (pth: string): string => new URL(pth, importURL).toString().replace(/^file:\/\//, '');
}
