import createHttpError from "../helpers/httpError";
import createHttpSuccess from "../helpers/httpSuccess";

export default function createUsersEndpointHandler({ userModel }) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      // case 'POST':
      //   return postContact(httpRequest)

      case "GET":
        return getUsers(httpRequest);

      default:
        return createHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function getUsers(httpRequest) {
    const { id } = httpRequest.pathParams || {};

    const result = id
      ? await userModel.findById({ userId: id })
      : await userModel.find({});
    return createHttpSuccess({
      result,
    });
  }
}
