import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import App from './components/App';
import versionUtil from '@sitevision/api/server/VersionUtil';
import restApi from '@sitevision/api/server/RestApi';
import storage  from '@sitevision/api/server/storage';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';

const offlineVersion = versionUtil.OFFLINE_VERSION; // Editing view = 0
const onlineVersion = versionUtil.ONLINE_VERSION; // Showing view = 1
const currentVersion = versionUtil.getCurrentVersion(); // The view you are in = 0 or 1

router.post('/feedback', (req, res) => {

    // const {message} = req.params;
    // const post = dataStore.add({message});


  const feedbackStorage = storage.getCollectionDataStore("feedback");
  const post = feedbackStorage.add({
      feedback: "Jeklar anåda",
      page: portletContextUtil.getCurrentPage().getIdentifier(),
      current: true
  })
  feedbackStorage.instantIndex(post.dsid);
  res.json({post});
});

router.get('/', (req, res) => {
  res.agnosticRender(renderToString(<App currentVersion={currentVersion} />), {
    currentVersion
  });
});


