import events from "@sitevision/api/common/events";
import properties from '@sitevision/api/server/Properties';
import resourceLocatorUtil from '@sitevision/api/server/ResourceLocatorUtil';
import storage from '@sitevision/api/server/storage';

// Sniffa efter publiceringar och markera sidans feedback som utdaterad
events.on('sv:publishing:publish', (options) => { 

    // Referenser till aktuell nod och dess ID
    const updatedNode = resourceLocatorUtil.getNodeByIdentifier(options.node); 
    const pageID = properties.get(updatedNode); 

    // Hämta tidigare feedback för sidan
    const feedbackStorage = storage.getCollectionDataStore("feedback");  // Hämta/skapa datakälla i SV
    const previousFeedback = feedbackStorage.find(`ds.analyzed.page:${pageID}`,100).toArray(); // Plocka ut sidans feedbackposter ur storage

    // Gå igenom tidigare feedback och markera som gammal
    previousFeedback.forEach(entry=>{
        try {
            feedbackStorage.set(entry.dsid, {...entry, current:false});
         } catch (e) {
            console.log("Ett fel uppstod när tidigare feedback skulle markeras som utdaterad.")
         }
    });
});
