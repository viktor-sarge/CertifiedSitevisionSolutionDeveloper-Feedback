import router from '@sitevision/api/common/router';




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
