import { CONFIG } from 'src/config-global';

import UpdateCategoryForm from 'src/sections/category/update';

export default function UpdateCategory() {
  return (
    <>
      <title>{`Update Category - ${CONFIG.appName}`}</title>

      <UpdateCategoryForm />
    </>
  );
}
