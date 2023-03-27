import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import App from './components/App';
import versionUtil from '@sitevision/api/server/VersionUtil';  

const offlineVersion = versionUtil.OFFLINE_VERSION; // Editing view = 0
const onlineVersion = versionUtil.ONLINE_VERSION; // Showing view = 1
const currentVersion = versionUtil.getCurrentVersion(); // The view you are in = 0 or 1

router.get('/', (req, res) => {
  res.agnosticRender(renderToString(<App currentVersion={currentVersion} />), {
    currentVersion,
  });
});
