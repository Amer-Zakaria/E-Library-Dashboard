import type { ICreateContent, IUpdateContent } from 'src/schema/content';

import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MenuItem, TextField, CircularProgress } from '@mui/material';

import { getCategories } from 'src/api/category';

export default function SelectCategory() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ICreateContent | IUpdateContent>();

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>();
  useEffect(() => {
    (async () => {
      const result = await getCategories({ pageSize: 100 });
      setCategories((result as any)?.categories);
    })();
  }, []);

  return (
    <Controller
      name="category"
      control={control}
      render={({ field }) => (
        <TextField
          required
          {...field}
          select
          label="Select Category"
          error={!!errors.category}
          helperText={errors.category?.message}
          margin="dense"
          id="category"
          fullWidth
          variant="filled"
          disabled={!categories}
        >
          {!categories ? (
            <MenuItem disabled>
              <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
              Loading categories...
            </MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))
          )}
        </TextField>
      )}
    />
  );
}
