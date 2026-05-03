import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { Box, Paper, Button, Container, Typography, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { getContent, updateContent } from 'src/api/content';
import { updateContentSchema, type IUpdateContent } from 'src/schema/content';

import Form from '../components/form';
import Uploads from '../components/uploads';

export interface IContentFiles {
  mainImage?: File;
  pdf?: File;
  audio?: File;
  gallery: File[];
}

export interface IContentExistingFiles {
  mainImage?: string;
  pdf?: string;
  audio?: string;
  gallery?: string[];
}

const initFiles: IContentFiles = {
  mainImage: undefined,
  pdf: undefined,
  audio: undefined,
  gallery: [],
};

export default function UpdateContentForm() {
  const { id } = useParams();
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<IContentFiles>(initFiles);
  const [existingFiles, setExistingFiles] = useState<IContentExistingFiles>({});
  const [deletedFiles, setDeletedFiles] = useState<{
    deletedMainImage?: string;
    deletedPdf?: string;
    deletedAudio?: string;
    deletedGallery: string[];
  }>({ deletedGallery: [] });

  const methods = useForm<IUpdateContent>({
    resolver: zodResolver(updateContentSchema) as any,
    shouldFocusError: true,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    (async () => {
      try {
        const data: any = await getContent(id!);
        reset({
          title: data.title,
          author: data.author,
          category: data.category?._id || data.category,
          rating: 4,
          description: data.description,
        });
        setExistingFiles({
          mainImage: data.mainImage,
          pdf: data.pdf,
          audio: data.audio,
          gallery: data.gallery,
        });
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch content details');
        route.push('/');
      }
    })();
  }, [id, reset, route]);

  async function onSubmit(data: IUpdateContent) {
    const formData = new FormData();
    // Data
    formData.append(
      'data',
      JSON.stringify({
        ...data,
        ...deletedFiles,
      })
    );
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
      await updateContent(id!, formData);
      toast.success('Content has been updated successfully.');
      route.push('/');
    } catch {
      // Error handled by interceptor
    }
  }

  /* Upload handlers - Same as Create but with existing file logic */
  const handleDropMultipleFiles = useCallback((accepted: File[], targetedFiles: string) => {
    setFiles((prev) => {
      const preFiles = prev[targetedFiles] as File[];
      return { ...prev, [targetedFiles]: [...preFiles, ...accepted] };
    });
  }, []);

  const handleDeleteMultipleFiles = useCallback((index: number, targetedFiles: string) => {
    setFiles((prev) => {
      const preFiles = prev[targetedFiles] as File[];
      return { ...prev, [targetedFiles]: preFiles.filter((_, i) => i !== index) };
    });
  }, []);

  const handleDropSingleFile = useCallback((accepted: File[], targetedFile: string) => {
    const newFile = accepted[0];
    if (newFile) setFiles((prev) => ({ ...prev, [targetedFile]: newFile }));
  }, []);

  const handleDeleteSingleFile = useCallback((targetedFile: string) => {
    setFiles((prev) => ({ ...prev, [targetedFile]: undefined }));
  }, []);

  const onDeleteSingleExistingFile = useCallback((targetedFile: keyof IContentFiles) => {
    setExistingFiles((prev) => {
      const fileName = prev[targetedFile as keyof IContentExistingFiles] as string;
      setDeletedFiles((prevDeleted) => ({
        ...prevDeleted,
        [`deleted${targetedFile.charAt(0).toUpperCase() + targetedFile.slice(1)}`]: fileName,
      }));
      return { ...prev, [targetedFile]: undefined };
    });
  }, []);

  const onDeleteMultipleExistingFiles = useCallback(
    (index: number, targetedFile: keyof IContentFiles) => {
      setExistingFiles((prev) => {
        const currentGallery = [...(prev.gallery || [])];
        const fileName = currentGallery[index];
        setDeletedFiles((prevDeleted) => ({
          ...prevDeleted,
          deletedGallery: [...prevDeleted.deletedGallery, fileName],
        }));
        currentGallery.splice(index, 1);
        return { ...prev, gallery: currentGallery };
      });
    },
    []
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Update Content
      </Typography>
      <FormProvider {...methods}>
        <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
          <Form control={control} errors={errors} />
          <Uploads
            files={files}
            existingFiles={existingFiles}
            onDropMultipleFiles={handleDropMultipleFiles}
            onDropSingleFile={handleDropSingleFile}
            onDeleteMultipleFiles={handleDeleteMultipleFiles}
            onDeleteSingleFile={handleDeleteSingleFile}
            onDeleteSingleExistingFile={onDeleteSingleExistingFile}
            onDeleteMultipleExistingFiles={onDeleteMultipleExistingFiles}
          />
          <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ mt: 3 }}>
            {isSubmitting ? 'Updating...' : 'Update Content'}
          </Button>
        </Paper>
      </FormProvider>
    </Container>
  );
}
