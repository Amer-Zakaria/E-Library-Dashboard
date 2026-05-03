export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }

  let truncated = content.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex !== -1) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + '...';
}
