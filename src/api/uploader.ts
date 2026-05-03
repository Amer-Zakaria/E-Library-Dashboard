import type IPagination from 'src/interfaces/IPagination';
import type { ICreateUploader } from 'src/schema/uploader';

import http from 'src/utils/http-service';

const endpoint = 'uploaders';

interface IUploaderFilterWithPagination extends IPagination {
  searchKey?: string;
}

export function getUploaders(filters: IUploaderFilterWithPagination) {
  return http.get(`/${endpoint}`, { params: filters });
}

export function getUploader(id: string) {
  return http.get(`/${endpoint}/${id}`);
}

export function createUploader(data: ICreateUploader) {
  return http.post(endpoint, data);
}

export function deleteUploader(id: string) {
  return http.delete(`/${endpoint}/${id}`);
}
