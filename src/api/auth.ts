import http from 'src/utils/http-service';

const endpoint = '/signin';

export async function signin(username: string, password: string): Promise<string> {
  return http.post(endpoint, { username, password });
}
