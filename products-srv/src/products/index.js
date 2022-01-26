import productModel from '../models/productModel'
import createProductsEndpointHandler from './productsEndpoint'

const productsEndpointHandler = createProductsEndpointHandler({ productModel })

export default productsEndpointHandler