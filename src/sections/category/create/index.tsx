import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { Box, Paper, Button, Container, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { createCategory } from 'src/api/category';
import { createCategorySchema, type ICreateCategory } from 'src/schema/category';

import CategoryForm from '../components/form';
import CategoryUploads from '../components/uploads';

const initData: ICreateCategory = {
  name: '',
  description: '',
};

export interface ICategoryFiles {
  img?: File;
}

const initFiles: ICategoryFiles = {
  img: undefined,
};

export default function CreateCategoryForm() {
  const route = useRouter();
  const [files, setFiles] = useState<ICategoryFiles>(initFiles);

  const methods = useForm<ICreateCategory>({
    resolver: zodResolver(createCategorySchema) as any,
    defaultValues: initData,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error('Invalid input, please resolve the issues');
    }
  }, [errors]);

  async function onSubmit(data: ICreateCategory) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (files.img) {
      formData.append('img', files.img);
    }

    try {
      await createCategory(formData);
      toast.success('Category has been created successfully.');
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

  return (
    <Container maxWidth="sm" sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Create Category
      </Typography>
      <FormProvider {...methods}>
        <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
          <CategoryForm />
          <CategoryUploads
            files={files}
            onDropSingleFile={handleDropSingleFile}
            onDeleteSingleFile={handleDeleteSingleFile}
          />
          <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ mt: 3 }}>
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </Button>
        </Paper>
      </FormProvider>
    </Container>
  );
}
