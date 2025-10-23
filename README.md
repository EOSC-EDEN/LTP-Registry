# Repository Services Registry Proof-of-Concept

## Data Model

Using [LinkML](https://linkml.io/) python library and application, to define the data model/schema for the registry entities in [registry-schema.yaml](registry-schema.yaml)

Start a python virtual environment
* with python virtual environment: `python3 -m venv venv`
* start virtual environment: `source venv/bin/activate`

Install requirements (LinkML):
* `pip install -r requirements.txt`

### Data Model Representations

* graphviz jpg: `gen-graphviz registry-schema.yaml -f jpg -o registry-schema`

![registry-schema.jpg]()