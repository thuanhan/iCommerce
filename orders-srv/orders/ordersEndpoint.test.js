import handle from ".";

describe("Orders Endpoint", () => {
  it("Method NOT allow", async () => {
    const result = await handle({
      method: "VIEW",
    });
    expect(result).toEqual({
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 405,
      data: JSON.stringify({
        success: false,
        error: "VIEW method not allowed.",
      }),
    });
  });

  it("Bad request. No POST body.", async () => {
    const result = await handle({
      method: "POST",
    });
    expect(result).toEqual({
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      data: JSON.stringify({
        success: false,
        error: "Bad request. No POST body.",
      }),
    });
  });

  it("Bad request. POST body must be valid JSON.", async () => {
    const result = await handle({
      method: "POST",
      body: "abc",
    });
    expect(result).toEqual({
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      data: JSON.stringify({
        success: false,
        error: "Bad request. POST body must be valid JSON.",
      }),
    });
  });
});
