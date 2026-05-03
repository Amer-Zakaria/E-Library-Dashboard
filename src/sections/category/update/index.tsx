import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { Box, Paper, Button, Container, Typography, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { getCategory, updateCategory } from 'src/api/category';
import { updateCategorySchema, type IUpdateCategory } from 'src/schema/category';

import CategoryForm from '../components/form';
import CategoryUploads from '../components/uploads';

const initFiles: { img?: File } = {
  img: undefined,
};

export default function UpdateCategoryForm() {
  const { id } = useParams();
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState(initFiles);
  const [existingImg, setExistingImg] = useState<string>();
  const [deletedImg, setDeletedImg] = useState<string>();

  const methods = useForm<IUpdateCategory>({
    resolver: zodResolver(updateCategorySchema) as any,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    (async () => {
      try {
        const data: any = await getCategory(id!);
        reset({
          name: data.name,
          description: data.description || '',
        });
        setExistingImg(data.img);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch category details');
        route.push('/categories');
      }
    })();
  }, [id, reset, route]);

  async function onSubmit(data: IUpdateCategory) {
    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        ...data,
        deletedImg,
      })
    );
    if (files.img) {
      formData.append('img', files.img);
    }

    try {
      await updateCategory(id!, formData);
      toast.success('Category has been updated successfully.');
      route.push('/categories');
    } catch {
      // Error handled by interceptor
    }
  }

  const handleDropSingleFile = useCallback((accepted: File[], targetedFile: string) => {
    const newFile = accepted[0];
    if (newFile) setFiles((prev) => ({ ...prev, [targetedFile]: newFile }));
  }, []);

  const handleDeleteSingleFile = useCallback((targetedFile: string) => {
    setFiles((prev) => ({ ...prev, [targetedFile]: undefined }));
  }, []);

  const onDeleteExistingFile = useCallback(() => {
    setDeletedImg(existingImg);
    setExistingImg(undefined);
  }, [existingImg]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Update Category
      </Typography>
      <FormProvider {...methods}>
        <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
          <CategoryForm />
          <CategoryUploads
            files={files}
            existingImg={existingImg}
            onDropSingleFile={handleDropSingleFile}
            onDeleteSingleFile={handleDeleteSingleFile}
            onDeleteExistingFile={onDeleteExistingFile}
          />
          <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ mt: 3 }}>
            {isSubmitting ? 'Updating...' : 'Update Category'}
          </Button>
        </Paper>
      </FormProvider>
    </Container>
  );
}
