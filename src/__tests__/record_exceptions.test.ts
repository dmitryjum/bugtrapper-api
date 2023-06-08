import axios from "axios";

describe("record_exceptions", () => {
    it("successfuly records an error object", async () => {
        const query = {
          "message": "Runtime Error",
          "error_details": {
              "backtrace": ["/app/controllers/schools_contrloller.rb"]
          },
          "application_id": "asdllfkjsl333"
        };
        const response = await axios.get("http://localhost:3002/dev/record-exceptions", {
            params: query
        });

        expect(response.status).toEqual(200);
        // expect(response.data).toEqual(`Queries: ${JSON.stringify(query)}`);
    });
});