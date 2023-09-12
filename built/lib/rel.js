// call with makeRel(import.meta.url), returns a function that resolves relative paths
export default function makeRel(importURL) {
    return function (pth) { return new URL(pth, importURL).toString().replace(/^file:\/\//, ''); };
}
