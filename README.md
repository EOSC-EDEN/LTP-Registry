# Repository Services Registry Proof-of-Concept

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

Example SPARQL queries:
* [registry-query01.rq](registry-query01.rq) - query: all instances of dcat:DataService and their properties and values


Run SPARQL queries: with [Apache Jena Commands](https://jena.apache.org/download/index.cgi) 

`arq --data registry-data.ttl --query registry-query01-DataServices.rq`

``` 
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| dataService                                          | prop             | val                                                                                                                                                                                                                                              |
==============================================================================================================================================================================================================================================================================================================================
| <https://eden-fidelis.eu/example/registry/service/1> | dct:description  | "A safe and sustainable long-term preservation archive that meets the highest archiving requirements. The DANS Data Vault contains all datasets that have been entrusted to DANS, including the data from the Data Stations and DataverseNL."@en |
| <https://eden-fidelis.eu/example/registry/service/1> | rdf:type         | dcat:DataService                                                                                                                                                                                                                                 |
| <https://eden-fidelis.eu/example/registry/service/1> | dcat:landingPage | <https://catalog.vault.datastations.nl>                                                                                                                                                                                                          |
| <https://eden-fidelis.eu/example/registry/service/1> | dcat:endpointURL | <https://catalog.vault.datastations.nl>                                                                                                                                                                                                          |
| <https://eden-fidelis.eu/example/registry/service/1> | rdfs:label       | "DANS Data Vault Catalog"@en                                                                                                                                                                                                                     |
| <https://eden-fidelis.eu/example/registry/service/1> | dct:title        | "DANS Data Vault Catalog"@en                                                                                                                                                                                                                     |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
```