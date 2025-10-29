# Proof-of-concept of Registry for Long-Term Preservation Services

* Start-date: 2025.10.23
* End-date: 2025.12.01
* Git repo: https://github.com/Dans-labs/EDEN-registry-PoC/


## Goal

The goal for this PoC is to create and test, simple and scalable instances of the core components for a Registry for Long-Term Preservation Services, for the ESOC EDEN WP2 T2.2, and the fundamental interaction patterns between them.

Those components are:
* **a data model** that represents the core classes of the Registry
* **test RDF data**  that illustrates, allows experimenting, and informs the data model design 
* **web UI** that queries the test RDF Data, and displaying the results in a Web-UI with a few filtering facets
* possibly, a **RDF triple-store** to store the data and provide a SPARQL end-point, which allows the Web-UI to request data. If made public, the SPARQL end-point can also stand as a public API where all of the Registry data can be accessed via SPARQL queries 



## Requirements

The PoC of Registry for Long-Term Preservation Services  has the following requirements:
* it **Must have** a simple data model, based on [DCAT-AP](https://semiceu.github.io/DCAT-AP/releases/3.0.0/), focused on the classes `dcat:DataService` for the services, `org:Organization` for the service publishing organization, `vcard:Kind`class for contacts points for services and organizations
* it **Must have** data for at least 5 to 10 Services from 2 or more organizations
* it **Must have** a web UI that lists the services present in the data, and a few filtering facets (ie. country, publisher)
* the web UI  **Must get** its data elements, through queries
* it **Should have** the data store in a triple-store, with a SPARQL end-point. Alternatively data can be, temporarily in RDF file, as long as web-ui client side code can query it with SPARQL
* it **Should have** a model of the data (preference for data-model in [LinkML](https://linkml.io/) format, as it allows for easy data-format-conversions, visual representations and data validation)


