exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // allow dashboard access
    },
    body: JSON.stringify([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        items: ["Product A", "Product B"],
        total: 120,
        status: "Pending",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        items: ["Product C"],
        total: 75,
        status: "Completed",
      },
    ]),
  };
};
