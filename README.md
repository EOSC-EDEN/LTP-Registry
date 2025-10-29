# Repository:  Proof-of-concept of Registry for Long-Term Preservation Services

See task description and list of requirements in [PoC-LTP-Services-Registry.md](PoC-LTP-Services-Registry.md) 

## Data Model

**IN PROGRESS - incomplete**

Using [LinkML](https://linkml.io/) python library and application, to define the data model/schema for the registry entities in **[registry-schema.yaml](registry-schema.yaml)**

Start a python virtual environment
* with python virtual environment: `python3 -m venv venv`
* start virtual environment: `source venv/bin/activate`

Install requirements (LinkML):
* `pip install -r requirements.txt`

### Data Model Representations


* Entity-Relationship (ER) Diagram `gen-erdiagram --format mermaid  registry-schema.yaml -c DataService`
Copy output to https://mermaid.live 

![registry-schema.png mermaid schema representation ](registry-schema.png)


## Data

Example data: [registry-data.ttl](registry-data.ttl)

Main Entities:
* `dcat:DataService` for describing Data Services 
* `org:Organization` for describing Organizations
* `vcard:Kind` for describing organization/service contact (see [^1])





Example SPARQL queries:


Run SPARQL queries: with [Apache Jena Commands](https://jena.apache.org/download/index.cgi) 


[registry-query01-DataServices.rq](registry-query01-DataServices.rq) - query: all instances of dcat:DataService and their properties and values

`arq --data registry-data.ttl --query registry-query01-DataServices.rq`

``` 
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| dataService     | prop              | val                                                                                                                                                                                                                                              | contact |
====================================================================================================================================================================================================================================================================================================
| edenr:service_1 | dct:description   | "A safe and sustainable long-term preservation archive that meets the highest archiving requirements. The DANS Data Vault contains all datasets that have been entrusted to DANS, including the data from the Data Stations and DataverseNL."@en |         |
| edenr:service_1 | dct:publisher     | edenr:org_1                                                                                                                                                                                                                                      |         |
| edenr:service_1 | dct:title         | "DANS Data Vault Catalog"@en                                                                                                                                                                                                                     |         |
| edenr:service_1 | rdf:type          | dcat:DataService                                                                                                                                                                                                                                 |         |
| edenr:service_1 | rdfs:label        | "DANS Data Vault Catalog"@en                                                                                                                                                                                                                     |         |
| edenr:service_1 | dcat:contactPoint | edenr:contact_1                                                                                                                                                                                                                                  |         |
| edenr:service_1 | dcat:endpointURL  | <https://catalog.vault.datastations.nl>                                                                                                                                                                                                          |         |
| edenr:service_1 | dcat:landingPage  | <https://catalog.vault.datastations.nl>                                                                                                                                                                                                          |         |
| edenr:service_1 | foaf:page:        | <https://dans-knaw.github.io/dans-datastation-architecture/vaas/>                                                                                                                                                                                |         |
| edenr:service_2 | dct:description   | "This data station allows you to deposit and search for data within the social sciences and humanities. The metadata of our Data Station SSH is also available in the national ODISSEI portal and the European CESSDA Data Catalogue."@en        |         |
| edenr:service_2 | dct:publisher     | edenr:org_1                                                                                                                                                                                                                                      |         |
| edenr:service_2 | dct:title         | "DANS Data Station Social Sciences and Humanities"@en                                                                                                                                                                                            |         |
| edenr:service_2 | rdf:type          | dcat:DataService                                                                                                                                                                                                                                 |         |
| edenr:service_2 | rdfs:label        | "DANS Data Station Social Sciences and Humanities"@en                                                                                                                                                                                            |         |
| edenr:service_2 | dcat:contactPoint | edenr:contact_1                                                                                                                                                                                                                                  |         |
| edenr:service_2 | dcat:endpointURL  | <https://ssh.datastations.nl/api/>                                                                                                                                                                                                               |         |
| edenr:service_2 | dcat:landingPage  | <https://ssh.datastations.nl/>                                                                                                                                                                                                                   |         |
| edenr:service_2 | foaf:page         | <https://dans-knaw.github.io/dans-datastation-architecture/>                                                                                                                                                                                     |         |
| edenr:service_3 | dct:description   | "SWORD2 client that deposits datasets to the DANS Data Station Social Sciences and Humanities"@en                                                                                                                                                |         |
| edenr:service_3 | dct:publisher     | edenr:org_1                                                                                                                                                                                                                                      |         |
| edenr:service_3 | dct:title         | "DANS Data SWORD2 interface for Data Station Social Sciences and Humanities"@en                                                                                                                                                                  |         |
| edenr:service_3 | rdf:type          | dcat:DataService                                                                                                                                                                                                                                 |         |
| edenr:service_3 | rdfs:label        | "DANS Data SWORD2 interface for Data Station Social Sciences and Humanities"@en                                                                                                                                                                  |         |
| edenr:service_3 | dcat:contactPoint | edenr:contact_1                                                                                                                                                                                                                                  |         |
| edenr:service_3 | dcat:endpointURL  | <https://sword2.ssh.datastations.nl>                                                                                                                                                                                                             |         |
| edenr:service_3 | foaf:page         | <https://dans-knaw.github.io/dd-dans-sword2-examples/>                                                                                                                                                                                           |         |
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
```


[registry-query02-Contact.rq](registry-query02-Contact.rq) - query: all instances of contacts (`vcard:Kind`) and their properties

`arq --data registry-data.ttl --query registry-query02-Contact.rq`

```
----------------------------------------------------------------------------------------------
| dataService     | prop           | val                                           | contact |
==============================================================================================
| edenr:contact_1 | vcard:hasEmail | <mailto:info@dans.knaw.nl>                    |         |
| edenr:contact_1 | rdf:type       | vcard:Kind                                    |         |
| edenr:contact_1 | vcard:fn       | "Data Archiving Networked Services (DANS)"@en |         |
| edenr:contact_1 | vcard:hasURL   | <https://dans.knaw.nl/>                       |         |
----------------------------------------------------------------------------------------------
```


[registry-query03-Orgs.rq](registry-query03-Orgs.rq) - query: all instances of Organizations (`org:Organization`) and their properties

`arq --data registry-data.ttl --query registry-query03-Orgs.rq`

```
----------------------------------------------------------------------------------------------
| dataService | prop               | val                                           | contact |
==============================================================================================
| edenr:org_1 | vcard:country-name | "The Netherlands"@en                          |         |
| edenr:org_1 | rdf:type           | org:Organization                              |         |
| edenr:org_1 | org:identifier     | <https://ror.org/008pnp284>                   |         |
| edenr:org_1 | geon:geonamesID    | <https://www.geonames.org/2747373>            |         |
| edenr:org_1 | foaf:name          | "Data Archiving Networked Services (DANS)"@en |         |
----------------------------------------------------------------------------------------------
```

# Docker Containers

## Fuseki docker container

For full documentation of Fuseki:Docker Tools see https://jena.apache.org/documentation/fuseki2/fuseki-docker.html

**Get the Fuseki container running** 

Download the jena-fuseki-docker package, which contains a Dockerfile, docker-compose file, and helper scripts to create a docker container for Apache Jena Fuseki.
`wget https://repo1.maven.org/maven2/org/apache/jena/jena-fuseki-docker/5.6.0/jena-fuseki-docker-5.6.0.zip`
Other versions of Fuseki can be found at from https://repo1.maven.org/maven2/org/apache/jena/jena-fuseki-docker/

Unzip the container: `unzip jena-fuseki-docker-5.6.0.zip`

Navigate to the `jena-fuseki-docker-5.6.0/` directory: `cd jena-fuseki-docker-5.6.0`

Build the image specified in `jena-fuseki-docker-5.6.0/docker-compose.yaml` with the version number of Apache Jena you wish to use, we will be using version 5.6.0: `docker compose build --build-arg JENA_VERSION=5.6.0`

run the Fuseki container, with an in-memory, updatable dataset at http://localhost:3030/ds: `docker compose run --rm --service-ports fuseki --mem /ds -d`


**Check the Fuseki container is running:**

* `curl localhost:3030/$/ping`
* `curl localhost:3030/$/metrics`

**Enter data to Fuseki via its HTTP API**

* go to root of this repository `cd ..` 
* Post [registry-data.ttl](registry-data.ttl) data to Fuseki dataset default graph: `curl -X POST -H "Content-Type: text/turtle" --data-binary @registry-data.ttl "http://localhost:3030/ds/data"` 
    * Note if we want to specify a named-graph for the data add to API URL `?graph=urn:graph-name`

**Query Fuseki SPARQL-endpoint**

* with a simple query: `curl --data-urlencode "query=SELECT ?s ?p ?o WHERE {?s ?p ?o} LIMIT 10" -H "Accept: application/sparql-results+json" http://localhost:3030/ds/sparql`
* with a query from one of the files in this repo: `curl --data-urlencode "query=$(cat registry-query01-DataServices.rq)" -H "Accept: application/sparql-results+json" http://localhost:3030/ds/sparql`
    * also possible to request results different formats, ie CSV:`-H "Accept:text/csv`; 





# FOOTNOTES

* [^1]: More on Vcard in DCAT-AP: https://interoperable-europe.ec.europa.eu/collection/semic-support-centre/solution/dcat-application-profile-implementation-guidelines/release-0
