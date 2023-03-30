// Basimporter
import * as React from 'react';
import { renderToString } from 'react-dom/server';

// Frontenddelen 
import App from './components/App';

// Sitevision-specifika importer
import appData from '@sitevision/api/server/appData';
import mailUtil from '@sitevision/api/server/MailUtil';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import roleUtil from '@sitevision/api/server/RoleUtil';
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

// Referenser till aktuell sida, dess id och aktuell användare
const currentPage = portletContextUtil.getCurrentPage();
const currentPageID = currentPage.getIdentifier();
const currentUser = portletContextUtil.getCurrentUser(); 

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

    // Skicka mail när feedback skickats
    const mailBuilder = mailUtil.getMailBuilder();
    const mailInput = appData.get('email');
    const mail = mailBuilder
        .setSubject(`Feedback was published `)
        .setHtmlMessage(`Someone published published`)
        .addRecipient(mailInput)
        .build();
    mail.send();

    res.json({post});
});

// Middleware för att bara admin admin-användare skall se tidigare feedback
router.use((req, res, next) => {
    if (req.method === 'GET' && req.path === '/feedback') {
        const roleMatcherBuilder = roleUtil.getRoleMatcherBuilder(); 
        roleMatcherBuilder.setUser(currentUser); 
        roleMatcherBuilder.addRole(roleUtil.getRoleByName('Administrator')); 
        const roleMatcher = roleMatcherBuilder.build(); 
        const isAdmin = roleMatcher.matchesAny(currentPage); 
        if (isAdmin) { 
            next();  // Släpp bara vidare admins till GET anrop mot /feedback
        }
    } else {
        next();  // Släpp förbi övriga anrop som att posta feedback. Appen blockar anonyma.
    }
});
 

// Hämta sidans tidigare feedback.
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
