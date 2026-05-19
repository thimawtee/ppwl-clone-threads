import app from "./app";

export const handler = async (event: any) => {
  const request = new Request(
    `https://${event.requestContext.domainName}${event.rawPath}`,
    {
      method: event.requestContext.http.method,
      headers: event.headers,
      body: event.requestContext.http.method !== "GET" ? event.body : undefined,
    }
  );

  const response = await app.handle(request);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
  };
};