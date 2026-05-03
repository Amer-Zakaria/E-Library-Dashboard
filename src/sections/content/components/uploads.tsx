import { Box, List, ListItem, Typography } from '@mui/material';

import { UploadSingle, UploadMultiple } from '../../../components/upload-logic';

import type { IContentFiles, IContentExistingFiles } from '../update/index';

const allowedImages = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export default function Uploads({
  files,
  existingFiles,
  onDropMultipleFiles,
  onDeleteMultipleFiles,
  onDropSingleFile,
  onDeleteSingleFile,
  onDeleteSingleExistingFile,
  onDeleteMultipleExistingFiles,
}: {
  files: IContentFiles;
  existingFiles?: IContentExistingFiles;
  onDropMultipleFiles: (accepted: File[], targetedFiles: string) => void;
  onDeleteMultipleFiles: (index: number, targetedFiles: string) => void;
  onDropSingleFile: (accepted: File[], targetedFile: string) => void;
  onDeleteSingleFile: (targetedFile: string) => void;
  onDeleteSingleExistingFile?: (targetedFile: keyof IContentFiles) => void;
  onDeleteMultipleExistingFiles?: (index: number, targetedFile: keyof IContentFiles) => void;
}) {
  return (
    <Box mt={3}>
      <Typography variant="h4" mb={2}>
        Uploads
      </Typography>
      <List>
        <ListItem sx={{ display: 'block', mb: 2, pb: 5 }} divider>
          <Typography mb={2}>Upload Cover Image</Typography>
          <UploadSingle<IContentFiles>
            file={files.mainImage}
            onDropSingleFile={onDropSingleFile}
            onDeleteSingleFile={onDeleteSingleFile}
            targetedFile="mainImage"
            existingFile={existingFiles?.mainImage}
            onDeleteSingleExistingFile={onDeleteSingleExistingFile}
            allowedTypes={allowedImages}
          />
        </ListItem>

        <ListItem sx={{ display: 'block', mb: 2, pb: 5 }} divider>
          <Typography mb={2}>Upload PDF File</Typography>
          <UploadSingle<IContentFiles>
            file={files.pdf}
            onDropSingleFile={onDropSingleFile}
            onDeleteSingleFile={onDeleteSingleFile}
            targetedFile="pdf"
            existingFile={existingFiles?.pdf}
            onDeleteSingleExistingFile={onDeleteSingleExistingFile}
            allowedTypes={{ 'application/pdf': ['.pdf'] }}
          />
        </ListItem>

        <ListItem sx={{ display: 'block', mb: 2, pb: 5 }} divider>
          <Typography mb={2}>Upload Audio File</Typography>
          <UploadSingle<IContentFiles>
            file={files.audio}
            onDropSingleFile={onDropSingleFile}
            onDeleteSingleFile={onDeleteSingleFile}
            targetedFile="audio"
            existingFile={existingFiles?.audio}
            onDeleteSingleExistingFile={onDeleteSingleExistingFile}
            allowedTypes={{ 'audio/mpeg': ['.mp3'], 'audio/wav': ['.wav'] }}
          />
        </ListItem>

        <ListItem sx={{ display: 'block', mb: 2, pb: 5 }} divider>
          <Typography mb={2}>Upload Gallery Pictures</Typography>
          <UploadMultiple<IContentFiles>
            files={files.gallery}
            targetedFiles="gallery"
            existingFiles={existingFiles?.gallery}
            onDropMultipleFiles={onDropMultipleFiles}
            onDeleteMultipleFiles={onDeleteMultipleFiles}
            allowedTypes={allowedImages}
            onDeleteMultipleExistingFiles={onDeleteMultipleExistingFiles}
          />
        </ListItem>
      </List>
    </Box>
  );
}
