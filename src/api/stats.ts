import http from 'src/utils/http-service';

export function getStats() {
  return http.get(`track/stats`);
}

export function getUserStats(params: any) {
  return http.get(`track/users`, { params });
}
