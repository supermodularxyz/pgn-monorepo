export function merge(source: object, target: any) {
  for (const [key, val] of Object.entries(source)) {
    if (val !== null && typeof val === "object") {
      target[key] ??= new val.__proto__.constructor();
      merge(val, target[key]);
    } else {
      target[key] = val;
    }
  }
  return target;
}
