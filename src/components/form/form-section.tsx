import type { ReactElement } from 'react';

import { Box, Typography } from '@mui/material';

export default function FormSection({
  title,
  Body,
  children,
}: {
  title: string;
  Body?: () => ReactElement;
  children?: ReactElement;
}) {
  return (
    <Box p={2.1} mb={4} sx={{ bgcolor: 'whitesmoke', borderRadius: '10px' }}>
      <Typography mb={2}>{title}</Typography>
      {Body ? <Body /> : children}
    </Box>
  );
}
