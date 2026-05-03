import { useCallback } from 'react';

interface ITable {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
}

export function useTable({ page, setPage, rowsPerPage, setRowsPerPage }: ITable) {
  const onResetPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const onChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage + 1);
    },
    [setPage]
  );

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage, setRowsPerPage]
  );

  return {
    page,
    rowsPerPage,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
