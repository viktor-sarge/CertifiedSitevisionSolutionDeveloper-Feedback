import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import App from './components/App';
import versionUtil from '@sitevision/api/server/VersionUtil';
import storage  from '@sitevision/api/server/storage';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import mailUtil from '@sitevision/api/server/MailUtil';
import systemUserUtil from "@sitevision/api/server/SystemUserUtil";

const offlineVersion = versionUtil.OFFLINE_VERSION; // Editläge === 0
const onlineVersion = versionUtil.ONLINE_VERSION; // Visningsläge === 1
const currentVersion = versionUtil.getCurrentVersion(); // Plocka ut aktuell vy

const anonymous = systemUserUtil.isAnonymous();
console.log('Anonym' + anonymous);

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

    // Skicka mail när feedback skickats TODO: Plocka upp mail från config
    const mailBuilder = mailUtil.getMailBuilder();
    const mailInput = "viktor.sarge@regionhalland.se";
    const mail = mailBuilder
        .setSubject(`Feedback was published `)
        .setHtmlMessage(`Someone published published`)
        .addRecipient(mailInput)
        .build();
    mail.send();

    res.json({post});  // Svaret skickas med
});


// Egen route för att posta feedback - anropas från App.js
router.get('/feedback', (req, res) => {
    const feedbackStorage = storage.getCollectionDataStore("feedback");  // Hämta/skapa datakälla i SV

    res.json({post});  // Svaret skickas med
});


router.get('/', (req, res) => {
    res.agnosticRender(renderToString(<App currentVersion={currentVersion} anonymous={anonymous} />), {
        currentVersion, anonymous
    });
});


