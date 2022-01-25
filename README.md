# iCommerce website

## DB
1. Using MongoDB/NoSQL
2. Mongoose provides a straight-forward, schema-based solution to model your application data.

## Apply Clean Architect https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

1. Send and receive message over HTTP: using Express

2. Interpreting those message: should be unique in your app

3. Formulating a response: should be unique in your app

### Break the dependency base on Clean Architect: 
- Using to factory pattern to create handle for User & Product Endpoints
- Inject mongoose DB to Endpoints handle
- Design template for response
- Create a standart Http