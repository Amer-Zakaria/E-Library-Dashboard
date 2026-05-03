import { useMemo, useEffect } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';

import { Box, List, Paper, Typography, IconButton } from '@mui/material';

import constructUrl from 'src/utils/construct_url';
import { convertToWebP } from 'src/utils/image-conversion'; // Import the new utility

import { Iconify } from 'src/components/iconify';

interface IUploadMultipleProps<T> {
  allowedTypes: Accept;
  files: File[];
  existingFiles?: string[];
  targetedFiles: keyof T;
  onDropMultipleFiles: (accepted: File[], targetedFiles: keyof T) => void;
  onDeleteMultipleFiles: (index: number, targetedFiles: keyof T) => void;
  onDeleteMultipleExistingFiles?: (index: number, targetedFile: keyof T) => void;
}

export function UploadMultiple<T>({
  targetedFiles,
  files,
  existingFiles,
  allowedTypes,
  onDropMultipleFiles,
  onDeleteMultipleFiles,
  onDeleteMultipleExistingFiles = () => {},
}: IUploadMultipleProps<T>) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (accepted) => {
      // Make onDrop async
      const convertedFiles = await Promise.all(accepted.map((file) => convertToWebP(file)));
      onDropMultipleFiles(convertedFiles, targetedFiles);
    },
    multiple: true,
    accept: allowedTypes,
  });

  const allowedTypesText = Object.values(allowedTypes).flat().join(', ');

  // Clean up object URLs on unmount
  useEffect(
    () => () =>
      files.forEach((file) => {
        if ((file as any).preview) {
          URL.revokeObjectURL((file as any).preview);
        }
      }),
    [files]
  );

  // Enhance files with preview URL (memoized to prevent recreation)
  const filePreviews = useMemo(
    () =>
      files.map((file) => {
        if (!(file as any).preview) {
          return Object.assign(file, { preview: URL.createObjectURL(file) });
        }
        return file;
      }),
    [files]
  );

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          border: '2px dashed #ccc',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1" color="textSecondary">
          Drag & drop some files here, or click to select files
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          Only allowed file types: {allowedTypesText}
        </Typography>
      </Paper>

      {(files.length > 0 || (existingFiles && existingFiles.length > 0)) && (
        <Box mt={3}>
          <Typography variant="body1" gutterBottom>
            Files
          </Typography>
          <List>
            {existingFiles &&
              existingFiles.length > 0 &&
              existingFiles.map((key, index) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: '#fafafa',
                    mb: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={constructUrl(key)}
                    alt={key}
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      mr: 2,
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {key.split('/')[key.split('/').length - 1].split('-').slice(2).join('-')}{' '}
                    </Typography>
                    {/* <Typography variant="caption" color="textSecondary">
                    {(file.size / 1000).toFixed(1)} KB
                  </Typography> */}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteMultipleExistingFiles(index, targetedFiles)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Box>
              ))}
            {files.length > 0 &&
              filePreviews.map((file, index) => (
                <Box
                  key={`${file.name}-${file.size}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: '#fafafa',
                    mb: 2,
                  }}
                >
                  {file.type.startsWith('image/') && (
                    <Box
                      component="img"
                      src={(file as any).preview}
                      alt={file.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        mr: 2,
                        borderRadius: 1,
                      }}
                    />
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {(file.size / 1000).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteMultipleFiles(index, targetedFiles)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Box>
              ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

interface IUploadSingleProps<T> {
  allowedTypes: Accept;
  file?: File;
  existingFile?: string;
  targetedFile: keyof T;
  onDropSingleFile: (accepted: File[], targetedFile: string) => void;
  onDeleteSingleFile: (targetedFile: string) => void;
  onDeleteSingleExistingFile?: (targetedFile: keyof T) => void;
}

export function UploadSingle<T>({
  targetedFile,
  file,
  existingFile,
  allowedTypes,
  onDropSingleFile,
  onDeleteSingleFile,
  onDeleteSingleExistingFile = () => {},
}: IUploadSingleProps<T>) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (accepted) => {
      // Make onDrop async
      const convertedFile = await convertToWebP(accepted[0]);
      onDropSingleFile([convertedFile], targetedFile as string);
    },
    multiple: false,
    accept: allowedTypes,
  });

  const allowedTypesText = Object.values(allowedTypes).flat().join(', ');

  // Clean up object URL on unmount
  useEffect(
    () => () => {
      if (file && (file as any).preview) {
        URL.revokeObjectURL((file as any).preview);
      }
    },
    [file]
  );

  const filePreview = useMemo(() => {
    if (!file) return null;

    if (!(file as any).preview) {
      return Object.assign(file, { preview: URL.createObjectURL(file) });
    }
    return file;
  }, [file]);

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          border: '2px dashed #ccc',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1" color="textSecondary">
          Drag & drop a file here, or click to select a file
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          Only allowed file types: {allowedTypesText}
        </Typography>
      </Paper>

      {(filePreview || existingFile) && (
        <Box mt={3}>
          <Typography variant="body2" gutterBottom>
            Selected File
          </Typography>
          {existingFile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                backgroundColor: '#fafafa',
              }}
            >
              {targetedFile !== 'pdf' && (
                <Box
                  component="img"
                  src={constructUrl(existingFile)}
                  alt={existingFile}
                  sx={{
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                    mr: 2,
                    borderRadius: 1,
                  }}
                />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {existingFile
                    .split('/')
                    ?.[existingFile.split('/').length - 1].split('-')
                    .slice(2)
                    .join('-')}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => onDeleteSingleExistingFile(targetedFile)}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Box>
          )}
          {filePreview && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                backgroundColor: '#fafafa',
              }}
            >
              {filePreview.type.startsWith('image/') && (
                <Box
                  component="img"
                  src={(filePreview as any).preview}
                  alt={filePreview.name}
                  sx={{
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                    mr: 2,
                    borderRadius: 1,
                  }}
                />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {filePreview.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {(filePreview.size / 1000).toFixed(1)} KB
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => onDeleteSingleFile(targetedFile as string)}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
