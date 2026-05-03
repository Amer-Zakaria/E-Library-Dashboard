import type IPagination from 'src/interfaces/IPagination';

import http from 'src/utils/http-service';

const endpoint = 'categories';

export function getCategories(paginationInfo: IPagination) {
  return http.get(`/${endpoint}`, { params: paginationInfo });
}

export function getCategory(id: string) {
  return http.get(`/${endpoint}/${id}`);
}

export function createCategory(formData: FormData) {
  return http.post(`/${endpoint}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateCategory(id: string, formData: FormData) {
  return http.put(`/${endpoint}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteCategory(id: string) {
  return http.delete(`/${endpoint}/${id}`);
}
