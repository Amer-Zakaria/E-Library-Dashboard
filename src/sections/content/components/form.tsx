import { Controller, useFormContext } from 'react-hook-form';

import { Box, Grid, TextField, MenuItem, Rating } from '@mui/material';

import SelectCategory from './select-category';

export default function Form({ control, errors }) {
  return (
    <Box>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={6}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                autoFocus
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                margin="dense"
                id="title"
                type="text"
                fullWidth
                variant="filled"
              />
            )}
          />
        </Grid>
        <Grid size={6}>
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                label="Author"
                error={!!errors.author}
                helperText={errors.author?.message}
                margin="dense"
                id="author"
                type="text"
                fullWidth
                variant="filled"
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} mb={4} alignItems="center">
        <Grid size={6}>
          <SelectCategory />
        </Grid>

        <Grid size={6}>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box mb={1} fontWeight="medium">
              Rating
            </Box>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Box>
                  <Rating
                    {...field}
                    value={Number(field.value)}
                    onChange={(_, value) => field.onChange(value)}
                    max={5}
                    size="large"
                  />
                  {errors.rating && (
                    <Box color="error.main" fontSize="0.75rem" ml={2} mt={0.5}>
                      {errors.rating.message}
                    </Box>
                  )}
                </Box>
              )}
            />
          </Box>
        </Grid>
      </Grid>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            sx={{ mb: 4 }}
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
