import app from "./app";

export const handler = async (event: any) => {
  const method =
    event.requestContext?.http?.method ||
    event.httpMethod ||
    "GET";

  const path =
    event.rawPath ||
    event.path ||
    "/";

  const queryString = event.rawQueryString
    ? `?${event.rawQueryString}`
    : "";

  const request = new Request(
    `https://${event.requestContext.domainName}${path}${queryString}`,
    {
      method,
      headers: event.headers,
      body: method !== "GET" && method !== "HEAD" ? event.body : undefined,
    }
  );

  const response = await app.handle(request);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
  };
};