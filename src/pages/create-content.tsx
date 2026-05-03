import { CONFIG } from 'src/config-global';

import CreateContentForm from 'src/sections/content/create';

export default function CreateContent() {
  return (
    <>
      <title>{`Create Content - ${CONFIG.appName}`}</title>

      <CreateContentForm />
    </>
  );
}
