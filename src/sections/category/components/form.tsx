import type { ICreateCategory, IUpdateCategory } from 'src/schema/category';

import { Controller, useFormContext } from 'react-hook-form';

import { Box, TextField } from '@mui/material';

export default function CategoryForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ICreateCategory | IUpdateCategory>();

  return (
    <Box>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            autoFocus
            label="Category Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="dense"
            id="name"
            type="text"
            fullWidth
            variant="filled"
            sx={{ mb: 3 }}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="dense"
            id="description"
            type="text"
            fullWidth
            variant="filled"
            multiline
            rows={4}
          />
        )}
      />
    </Box>
  );
}
