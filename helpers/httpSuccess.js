export default function createHttpSuccess({ statusCode = 200, result }) {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode,
    data: JSON.stringify(result),
  };
}
