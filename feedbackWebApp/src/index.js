import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import App from './components/App';
import versionUtil from '@sitevision/api/server/VersionUtil';
import restApi from '@sitevision/api/server/RestApi';
import restAppInvokerFactory from '@sitevision/api/server/RestAppInvokerFactory';

const offlineVersion = versionUtil.OFFLINE_VERSION; // Editing view = 0
const onlineVersion = versionUtil.ONLINE_VERSION; // Showing view = 1
const currentVersion = versionUtil.getCurrentVersion(); // The view you are in = 0 or 1

 // The RESTApp can be found by identifier, node or as in this case the path
 const restApp = restAppInvokerFactory.fromPath('/rest-api/FeedbackRESTApp');

 // The route is called (get, post, put or delete) and can be called with or without input data
 const response = restApp.get('/myRoute');
 console.log(response);

 // response is a script object representing the response (properties: headers, statusCode, statusMessage, body)
 if (response.statusCode !== 200) {
 // Handle error and return
 console.log("Error occured");
 }

 // The body of the response contains the actual data
 const body = response.body;
 console.log(body);

router.post("/feedback", (req, res) => {
  // const {article} = req.params;
  restApi.post(resourceLocatorUtil.getNodeByIdentifier(article), "likes", {});
  res.status("204");
})


router.get('/', (req, res) => {
  res.agnosticRender(renderToString(<App currentVersion={currentVersion} />), {
    currentVersion
  });
});
