# Reasons using mongodb for iCommerce

* There are numerous benefits of Mongodb/NoSQL from speed to simplified code

* We enforce all the typical joins, cascades, schemas, validation, etc.. with functionality that NoSql have collections, schemas, hooks, helpers)
Instead of trying to join a bunch of stuff, we simply have an object that is product. There are a huge advantages to this approach, such as speed + easy code + the schema can bi easily modified to accommodate any data requirements.

* By using NoSQL, we remove the very complex layer of looking up and joining attributes, and also the complexity of adding new field/values.
We also don't have to deal with the continuous translation of DB structure to a code object.

* In reality, in our use, the DB is just the persistent storage of the JS objects.