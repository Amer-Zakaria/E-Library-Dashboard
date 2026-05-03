import { CONFIG } from 'src/config-global';

import { ContentView } from 'src/sections/content/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Contents - ${CONFIG.appName}`}</title>

      <ContentView />
    </>
  );
}
