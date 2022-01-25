import userModel from '../models/userModel'
import createUsersEndpointHandler from './usersEndpoint'

const usersEndpointHandler = createUsersEndpointHandler({ userModel })

export default usersEndpointHandler