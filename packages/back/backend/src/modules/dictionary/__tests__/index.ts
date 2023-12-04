import { TestUtils } from "tests";

test("get dictionaries list", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axios] = await utils.authUser(clientId);

  const res = await axios.get("/dictionaries");

  expect(res.data.list.some((dict: any) => dict.type === "document_type")).toEqual(true);
  expect(res.data.list.some((dict: any) => dict.type === "ticket_status")).toEqual(true);
  expect(res.data.list.some((dict: any) => dict.type === "document_revision_return_code")).toEqual(true);
  expect(res.data.list.some((dict: any) => dict.type === "ticket_type")).toEqual(true);
});
