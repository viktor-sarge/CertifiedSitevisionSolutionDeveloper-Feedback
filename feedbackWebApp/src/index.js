import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import App from './components/App';
import versionUtil from '@sitevision/api/server/VersionUtil';
import storage  from '@sitevision/api/server/storage';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';

const offlineVersion = versionUtil.OFFLINE_VERSION; // Editläge === 0
const onlineVersion = versionUtil.ONLINE_VERSION; // Visningsläge === 1
const currentVersion = versionUtil.getCurrentVersion(); // Plocka ut aktuell vy

// Egen route för att posta feedback - anropas från App.js
router.post('/feedback', (req, res) => {

  const feedbackStorage = storage.getCollectionDataStore("feedback");  // Hämta/skapa datakälla i SV
  const currentUser = portletContextUtil.getCurrentUser();

  // Lägg till feedback från App.js, aktuell sidas ID och booelan för current till storage. Tidsstämpel skapas automatiskt
  const post = feedbackStorage.add({
      feedback: req.params.feedback,
      page: portletContextUtil.getCurrentPage().getIdentifier(),
      current: true,
      user: String(currentUser),
  })
  feedbackStorage.instantIndex(post.dsid);  // Trigga indexering av posten
  res.json({post});  // Svaret skickas med
});

router.get('/', (req, res) => {
  res.agnosticRender(renderToString(<App currentVersion={currentVersion} />), {
    currentVersion
  });
});


