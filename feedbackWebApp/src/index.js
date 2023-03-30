// Basimporter
import * as React from 'react';
import { renderToString } from 'react-dom/server';

// Frontenddelen 
import App from './components/App';

// Sitevision-specifika importer
import appData from '@sitevision/api/server/appData';
import mailUtil from '@sitevision/api/server/MailUtil';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import router from '@sitevision/api/common/router';
import storage  from '@sitevision/api/server/storage';
import systemUserUtil from "@sitevision/api/server/SystemUserUtil";
import versionUtil from '@sitevision/api/server/VersionUtil';

// Plocka upp om vi är i edit eller visningsläge
const offlineVersion = versionUtil.OFFLINE_VERSION; // Editläge === 0
const onlineVersion = versionUtil.ONLINE_VERSION; // Visningsläge === 1
const currentVersion = versionUtil.getCurrentVersion(); // Plocka ut aktuell vy

// Inloggad eller inte? Används i App.js för att stänga ute oinloggade
const anonymous = systemUserUtil.isAnonymous();

// ID för aktuell sida
const currentPageID = portletContextUtil.getCurrentPage().getIdentifier();

// Egen route för att posta feedback - anropas från App.js
router.post('/feedback', (req, res) => {
    const feedbackStorage = storage.getCollectionDataStore("feedback");  // Hämta/skapa datakälla i SV
    const currentUser = portletContextUtil.getCurrentUser();

    // Lägg till feedback från App.js, aktuell sidas ID och booelan för current till storage. Tidsstämpel skapas automatiskt
    const post = feedbackStorage.add({
        feedback: req.params.feedback,
        page: currentPageID,
        current: true,
        timePosted: Date.now(),
        user: String(currentUser),
    })
    feedbackStorage.instantIndex(post.dsid);  // Trigga indexering av posten

    // Skicka mail när feedback skickats TODO: Plocka upp mail från config
    const mailBuilder = mailUtil.getMailBuilder();
    const mailInput = appData.get('email');
    const mail = mailBuilder
        .setSubject(`Feedback was published `)
        .setHtmlMessage(`Someone published published`)
        .addRecipient(mailInput)
        .build();
    mail.send();

    res.json({post});  // Svaret skickas med
});


// Hämta sidans tidigare feedback. Vaktas av att App.js avslutar direkt om man inte är inloggad.
router.get('/feedback', (req, res) => {
    const feedbackStorage = storage.getCollectionDataStore("feedback");  // Hämta/skapa datakälla i SV
    const feedbackEntries = feedbackStorage.find(`ds.analyzed.page:${currentPageID}`,100).toArray(); 
    res.json({feedbackEntries});  // Svaret skickas med
});

// Appens standardentrypoint
router.get('/', (req, res) => {
    res.agnosticRender(renderToString(<App currentVersion={currentVersion} anonymous={anonymous} />), {
        currentVersion, anonymous
    });
});
