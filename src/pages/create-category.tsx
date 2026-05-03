import { CONFIG } from 'src/config-global';

import CreateCategoryForm from 'src/sections/category/create';

export default function CreateCategory() {
  return (
    <>
      <title>{`Create Category - ${CONFIG.appName}`}</title>

      <CreateCategoryForm />
    </>
  );
}
