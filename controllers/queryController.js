var express = require('express');
var router = express.Router()
var fs = require('fs')
const { RDFMimeType } = require('graphdb').http;
const { RepositoryClientConfig, RDFRepositoryClient } = require('graphdb').repository;
const { SparqlJsonResultParser } = require('graphdb').parser;
const { UpdateQueryPayload, GetQueryPayload, QueryType } = require('graphdb').query;
const axios = require('axios');
const bodyParser = require('body-parser');
const { error } = require('console');
const { exec } = require('child_process');

router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
router.use(bodyParser.json({ limit: '100mb' }))

axios.post('http://localhost:7200/rest/login/admin', null, {
    headers: {
        'X-GraphDB-Password': '***'
    }
}).then(function (token) {

    router.get('/sync', (req, res) => {

        const data = {
            email: 'estathop@iti.gr',
            password: '***'
          };
          axios.post('https://chromata.up2metric.com:8085/api/login', data)
          .then((response) => {
            console.log(`statusCode: ${response.status}`);
            axios.get('https://chromata.up2metric.com:8085/api/get-metadata', {
                headers: {
                  'Authorization': `Bearer ${response.data.token}`
                }
              })
              .then(async response => {
                arrayjson =[];
                arrayjson.push(response.data[1]);
                fs.writeFile('/home/estathop/Desktop/chromata/datadumpforsync.json',JSON.stringify(arrayjson), (error) =>{
                    if(error){
                        console.log('error', error);
                    } else {
                        console.log ('200')
                    }
                })

                exec('java -jar /home/estathop/Desktop/chromata/rmlmapper-6.1.3-r367-all.jar --mapping /home/estathop/Desktop/chromata/mapping.ttl --output /home/estathop/Desktop/chromata/output.ttl', (err, stdout, stderr) => {
                    if (err) {
                      // There was an error
                      console.error(err);
                    } else {
                      // Here's the output of the command
                      console.log(stdout);
                    }
                  });
                  const contentType = RDFMimeType.TURTLE;
                  const readTimeout = 300000;
            const writeTimeout = 300000;
            const repositoryClientConfig = new RepositoryClientConfig('http://localhost:7200/repositories/chromatav2')
                .setEndpoints(['http://localhost:7200/repositories/chromatav2'])
                .setDefaultRDFMimeType(contentType)
                .setHeaders({
                'authorization': token.headers.authorization
                    }, '', readTimeout, writeTimeout);
            const repositoryClient = new RDFRepositoryClient(repositoryClientConfig)
            repositoryClient.deleteAllStatements();
            console.log('Knowledge Graph Wiped')
            const turtleFile = '/home/estathop/Desktop/chromata/chrv2.ttl';
            const turtleFile2 = '/home/estathop/Desktop/chromata/output.ttl';
            repositoryClient.addFile(turtleFile, contentType)
            console.log("Ontology Imported Successfully");
            repositoryClient.addFile(turtleFile2, contentType);
            console.log('Syncing Successful')
            res.sendStatus(200)
              })
              .catch(error => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
        //apply code here
        })

    router.get('/gikna', (req, res) => {
            let head = {};
            let table = [];
            head.table = table;
            const readTimeout = 300000;
            const writeTimeout = 300000;
            const contentType = RDFMimeType.TURTLE;
            const repositoryClientConfig = new RepositoryClientConfig('http://localhost:7200/repositories/chromatav2')
      .setEndpoints(['http://localhost:7200/repositories/chromatav2'])
      .setHeaders({
        'authorization': token.headers.authorization
      }, '', readTimeout, writeTimeout)
      .setDefaultRDFMimeType(contentType);
            const repositoryClient = new RDFRepositoryClient(repositoryClientConfig)
            repositoryClient.registerParser(new SparqlJsonResultParser());
            const payload = new GetQueryPayload()
                .setQuery('PREFIX owl: <http://www.w3.org/2002/07/owl#> \
                PREFIX chr: <https://chromata-project.gr/> \
                select distinct ?subject ?predicate ?object where {  \
                    {?subject a owl:NamedIndividual ; \
                       chr:danceType "Γίκνα"; \
                     ?predicate ?object. \
                } UNION { \
                        ?subject chr:danceType "Γίκνα". \
                        ?subject chr:belongsToMelodicAnalysis ?k. \
                        ?k ?predicate ?object. \
                    } UNION { \
                        ?subject chr:danceType "Γίκνα". \
                        ?subject chr:belongsToRhythmicInstruction ?k. \
                        ?k ?predicate ?object. \
                    }\
                }\
                ')
                .setQueryType(QueryType.SELECT)
                .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
                .setLimit(1000);
            return repositoryClient.query(payload).then((stream) => {
                stream.on('data', (bindings) => {
                    head.table.push(bindings);
                    
                });
                stream.on('end', () => {
                    res.send(head);
                    delete head;
                    delete table;
                });
            }).catch(err => console.log(err));
        })


        router.get('/baidouska', (req, res) => {
            let head = {};
            let table = [];
            head.table = table;
            const readTimeout = 300000;
            const writeTimeout = 300000;
            const contentType = RDFMimeType.TURTLE;
            const repositoryClientConfig = new RepositoryClientConfig('http://localhost:7200/repositories/chromatav2')
      .setEndpoints(['http://localhost:7200/repositories/chromatav2'])
      .setHeaders({
        'authorization': token.headers.authorization
      }, '', readTimeout, writeTimeout)
      .setDefaultRDFMimeType(contentType);
            const repositoryClient = new RDFRepositoryClient(repositoryClientConfig)
            repositoryClient.registerParser(new SparqlJsonResultParser());
            const payload = new GetQueryPayload()
                .setQuery('PREFIX owl: <http://www.w3.org/2002/07/owl#> \
                PREFIX chr: <https://chromata-project.gr/> \
                select distinct ?subject ?predicate ?object where {  \
                    {?subject a owl:NamedIndividual ; \
                       chr:danceType "Μπαϊντούσκα"; \
                     ?predicate ?object. \
                } UNION { \
                        ?subject chr:danceType "Μπαϊντούσκα". \
                        ?subject chr:belongsToMelodicAnalysis ?k. \
                        ?k ?predicate ?object. \
                    } UNION { \
                        ?subject chr:danceType "Μπαϊντούσκα". \
                        ?subject chr:belongsToRhythmicInstruction ?k. \
                        ?k ?predicate ?object. \
                    }\
                }\
                ')
                .setQueryType(QueryType.SELECT)
                .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
                .setLimit(1000);
            return repositoryClient.query(payload).then((stream) => {
                stream.on('data', (bindings) => {
                    head.table.push(bindings);
                    
                });
                stream.on('end', () => {
                    res.send(head);
                    delete head;
                    delete table;
                });
            }).catch(err => console.log(err));
        })

        router.get('/karsilamas', (req, res) => {
            let head = {};
            let table = [];
            head.table = table;
            const readTimeout = 300000;
            const writeTimeout = 300000;
            const contentType = RDFMimeType.TURTLE;
            const repositoryClientConfig = new RepositoryClientConfig('http://localhost:7200/repositories/chromatav2')
      .setEndpoints(['http://localhost:7200/repositories/chromatav2'])
      .setHeaders({
        'authorization': token.headers.authorization
      }, '', readTimeout, writeTimeout)
      .setDefaultRDFMimeType(contentType);
            const repositoryClient = new RDFRepositoryClient(repositoryClientConfig)
            repositoryClient.registerParser(new SparqlJsonResultParser());
            const payload = new GetQueryPayload()
                .setQuery('PREFIX owl: <http://www.w3.org/2002/07/owl#> \
                PREFIX chr: <https://chromata-project.gr/> \
                select distinct ?subject ?predicate ?object where {  \
                    {?subject a owl:NamedIndividual ; \
                       chr:danceType "Καρσιλαμάς"; \
                     ?predicate ?object. \
                } UNION { \
                        ?subject chr:danceType "Καρσιλαμάς". \
                        ?subject chr:belongsToMelodicAnalysis ?k. \
                        ?k ?predicate ?object. \
                    } UNION { \
                        ?subject chr:danceType "Καρσιλαμάς". \
                        ?subject chr:belongsToRhythmicInstruction ?k. \
                        ?k ?predicate ?object. \
                    }\
                }\
                ')
                .setQueryType(QueryType.SELECT)
                .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
                .setLimit(1000);
            return repositoryClient.query(payload).then((stream) => {
                stream.on('data', (bindings) => {
                    head.table.push(bindings);
                    
                });
                stream.on('end', () => {
                    res.send(head);
                    delete head;
                    delete table;
                });
            }).catch(err => console.log(err));
        })

    router.get('/hi', (req, res) => {
        res.send('hi \\n asd')
    });
});

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next();
});

module.exports = router;
