export const googleMXRecords = [
  { value: "ASPMX.L.GOOGLE.COM", priority: 1 },
  { value: "ALT1.ASPMX.L.GOOGLE.COM", priority: 5 },
  { value: "ALT2.ASPMX.L.GOOGLE.COM", priority: 5 },
  { value: "ALT3.ASPMX.L.GOOGLE.COM", priority: 10 },
  { value: "ALT4.ASPMX.L.GOOGLE.COM", priority: 10 }
].map(({ value, priority }) => ({
  name: '@',
  type: 'MX',
  value,
  priority
}))