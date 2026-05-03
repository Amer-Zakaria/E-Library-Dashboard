import { CONFIG } from 'src/config-global';

import { UploaderView } from './../sections/uploader/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Uploaders - ${CONFIG.appName}`}</title>

      <UploaderView />
    </>
  );
}
