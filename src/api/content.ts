import type IPagination from 'src/interfaces/IPagination';

import http from 'src/utils/http-service';

const endpoint = 'contents';

export function getContents(paginationInfo: IPagination, filters = {}) {
  return http.post(`/${endpoint}/get`, filters, { params: paginationInfo });
}

export function getContent(id: string) {
  return http.get(`/${endpoint}/${id}`);
}

export function createContent(formData: FormData) {
  return http.post(`/${endpoint}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateContent(id: string, formData: FormData) {
  return http.put(`/${endpoint}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function activationContent(id: string, isActive: boolean) {
  return http.patch(`/${endpoint}/${isActive}/${id}`);
}

export function deleteContent(id: string) {
  return http.delete(`/${endpoint}/${id}`);
}
