export default function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  } else {
    return text;
  }
}
