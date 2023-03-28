import router from '@sitevision/api/common/router';
import storage  from '@sitevision/api/server/storage';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';

router.get('/myroute', (req, res) => {
    const feedbackStorage = storage.getCollectionDataStore("feedback");
    const post = feedbackStorage.add({
        feedback: "TRiggar detta från index js i webappen",
        page: portletContextUtil.getCurrentPage().getIdentifier(),
        current: true
    })
    feedbackStorage.instantIndex(post.dsid);
    res.json({ message: 'Hello from GET' });
});

router.get('/myroute/:value', (req, res) => {
    res.json({ message: `Hello ${req.params.value}` });
});

router.post('/myroute', (req, res) => {
    res.json({ message: 'Hello from POST' });
});

router.put('/myroute', (req, res) => {
    res.json({ message: 'Hello from PUT' });
});

router['delete']('/myroute', (req, res) => {
    res.json({ message: 'Hello from DELETE' });
});
