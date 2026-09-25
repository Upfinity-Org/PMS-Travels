/** ₹ amounts use Indian digit grouping (₹2,200 / ₹1,25,000). */
export const rupees = (value: number): string => `₹${value.toLocaleString('en-IN')}`;
