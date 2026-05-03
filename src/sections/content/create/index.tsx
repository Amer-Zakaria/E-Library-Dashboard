import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { Box, Paper, Button, Container, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { usePersistForm } from 'src/utils/use-persist-form';

import { createContent } from 'src/api/content';
import { createContentSchema, type ICreateContent } from 'src/schema/content';

import Form from '../components/form';
import Uploads from '../components/uploads';

const initData: ICreateContent = {
  title: '',
  author: '',
  category: '',
  rating: 4,
  description: '',
};

export interface IContentFiles {
  mainImage?: File;
  pdf?: File;
  audio?: File;
  gallery: File[];
}

const initFiles: IContentFiles = {
  mainImage: undefined,
  pdf: undefined,
  audio: undefined,
  gallery: [],
};

export default function CreateContentForm() {
  const route = useRouter();
  const [files, setFiles] = useState<IContentFiles>(initFiles);

  const methods = useForm<ICreateContent>({
    resolver: zodResolver(createContentSchema) as any,
    defaultValues: initData,
    shouldFocusError: true,
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const { clearPersistedData } = usePersistForm({
    value: watch(),
    localStorageKey: 'createContentForm',
    onRestore: (data) => reset({ ...initData, ...data }),
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error('Invalid input, please resolve the issues');
      console.log(errors);
      window.scrollTo(0, 0);
    }
  }, [errors]);

  async function onSubmit(data: ICreateContent) {
    const formData = new FormData();
    // Data
    formData.append('data', JSON.stringify(data));
    // Files
    Object.entries(files).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      await createContent(formData);

      clearPersistedData();

      toast.success('Content has been created successfully.');
    } catch {
      return;
    }

    route.push('/');
  }

  /* Upload handlers - STARTS*/
  const handleDropMultipleFiles = useCallback((accepted: File[], targetedFiles: string) => {
    setFiles((prev) => {
      const preFiles = prev[targetedFiles] as File[];
      const existing = new Set(preFiles.map((f) => f.name + f.size));
      const filtered = accepted.filter((f) => !existing.has(f.name + f.size));
      return { ...prev, [targetedFiles]: [...preFiles, ...filtered] };
    });
  }, []);

  const handleDeleteMultipleFiles = useCallback((index: number, targetedFiles: string) => {
    setFiles((prev) => {
      const preFiles = prev[targetedFiles] as File[];

      const newFiles = preFiles.filter((_, i) => i !== index);

      // Revoke the URL of the deleted file
      const deletedFile = preFiles[index];
      if (deletedFile && (deletedFile as any).preview) {
        URL.revokeObjectURL((deletedFile as any).preview);
      }

      return { ...prev, [targetedFiles]: newFiles };
    });
  }, []);

  const handleDropSingleFile = useCallback((accepted: File[], targetedFile: string) => {
    // Take only the first file for single upload
    const newFile = accepted[0];
    if (newFile) {
      setFiles((prev) => {
        // Revoke previous file URL if it exists
        const prevFile = prev[targetedFile] as File | null;
        if (prevFile && (prevFile as any).preview) {
          URL.revokeObjectURL((prevFile as any).preview);
        }

        return { ...prev, [targetedFile]: newFile };
      });
    }
  }, []);

  const handleDeleteSingleFile = useCallback((targetedFile: string) => {
    setFiles((prev) => {
      // Revoke the URL of the deleted file
      const currentFile = prev[targetedFile] as File | null;
      if (currentFile && (currentFile as any).preview) {
        URL.revokeObjectURL((currentFile as any).preview);
      }

      return { ...prev, [targetedFile]: null };
    });
  }, []);
  /* Upload handlers - ENDS */

  return (
    <Container maxWidth="md" sx={{ mb: 5 }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Create Content
        </Typography>
      </Box>
      <FormProvider {...methods}>
        <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ p: 4, border: '2px solid #cccccc55' }}
        >
          <Form control={control} errors={errors} />

          <Uploads
            files={files}
            onDropMultipleFiles={handleDropMultipleFiles}
            onDropSingleFile={handleDropSingleFile}
            onDeleteMultipleFiles={handleDeleteMultipleFiles}
            onDeleteSingleFile={handleDeleteSingleFile}
          />

          <Button type="submit" disabled={isSubmitting} color="primary" variant="contained">
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
          <Button
            sx={{ ml: 2 }}
            onClick={() => {
              clearPersistedData();
              reset(initData);
            }}
            color="inherit"
            variant="outlined"
          >
            Reset
          </Button>
        </Paper>
      </FormProvider>
    </Container>
  );
}
