export default function constructUrl(key: string) {
  return `${import.meta.env.VITE_BASE_FILE_URL}/${key}`;
}
