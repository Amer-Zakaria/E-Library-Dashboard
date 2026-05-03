import { Box, Typography, List, ListItem } from '@mui/material';

import { UploadSingle } from '../../../components/upload-logic';

import type { ICategoryFiles } from '../create/index';

const allowedImages = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export default function CategoryUploads({
  files,
  existingImg,
  onDropSingleFile,
  onDeleteSingleFile,
  onDeleteExistingFile,
}: {
  files: ICategoryFiles;
  existingImg?: string;
  onDropSingleFile: (accepted: File[], targetedFile: string) => void;
  onDeleteSingleFile: (targetedFile: string) => void;
  onDeleteExistingFile?: () => void;
}) {
  return (
    <Box mt={3}>
      <Typography variant="h6" mb={2}>
        Category Image
      </Typography>
      <List>
        <ListItem sx={{ display: 'block', mb: 2, pb: 5 }}>
          <UploadSingle<ICategoryFiles>
            file={files.img}
            onDropSingleFile={onDropSingleFile}
            onDeleteSingleFile={onDeleteSingleFile}
            targetedFile="img"
            existingFile={existingImg}
            onDeleteSingleExistingFile={onDeleteExistingFile as any}
            allowedTypes={allowedImages}
          />
        </ListItem>
      </List>
    </Box>
  );
}
