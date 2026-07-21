export function stableId(input, length = 6) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash.toString().padStart(length, '0').slice(-length)
}
