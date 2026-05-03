import { CONFIG } from 'src/config-global';

import UpdateContentForm from 'src/sections/content/update';

export default function UpdateContent() {
  return (
    <>
      <title>{`Update Content - ${CONFIG.appName}`}</title>

      <UpdateContentForm />
    </>
  );
}
