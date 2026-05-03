import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  InputLabel,
  IconButton,
  FormControl,
  FilledInput,
  InputAdornment,
  FormHelperText,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function Amenities() {
  const {
    control,
    formState: { errors },
  } = useFormContext<any>();

  const {
    fields: amenities,
    append,
    remove,
  } = useFieldArray({
    control: control as any,
    name: 'amenities',
  });

  const handleRemoveAmenity = (index: number) => {
    remove(index);
  };

  const handleAddAmenity = () => {
    append(amenities.length + 1);
  };

  return (
    <Box display="flex" gap={0.5} flexWrap="wrap" alignItems="center">
      {amenities.map((amenity, index) => (
        <Controller
          key={amenity.id}
          name={`amenities.${index}` as any}
          control={control}
          render={({ field }) => (
            <FormControl sx={{ m: 1 }} variant="filled">
              <InputLabel
                htmlFor={`amenity-${amenity.id}`}
                error={!!(errors as any).amenities?.[index]}
              >
                {index + 1}
              </InputLabel>
              <FilledInput
                {...field}
                id={`amenity-${amenity.id}`}
                type="text"
                error={!!(errors as any).amenities?.[index]}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAmenity(index)}
                      aria-label={`Remove amenity ${index + 1}`}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {(errors as any).amenities?.[index] && (
                <FormHelperText error>{(errors as any).amenities[index]?.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      ))}
      <IconButton onClick={handleAddAmenity} aria-label="Add amenity">
        <Iconify icon="eva:plus-fill" width="24" height="24" />
      </IconButton>
    </Box>
  );
}
