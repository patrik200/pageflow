import querystring from "querystring";

import { TestUtils } from "tests";

test("tenant", async () => {
  const utils = new TestUtils();
  const { clientId, domain } = await utils.createClient();
  const res = await utils.getAxios().get("/clients/tenant?" + querystring.encode({ domain }));
  expect(res.data).toEqual({ id: clientId });
});

test("current client info", async () => {
  const utils = new TestUtils();
  const { clientId, clientName } = await utils.createClient();
  const [axios] = await utils.authAdmin(clientId);
  const res = await axios.get("/clients/current");
  expect(res.data).toEqual({ id: clientId, name: clientName, logo: null });
});

test("client by id info", async () => {
  const utils = new TestUtils();
  const { clientId, clientName } = await utils.createClient();
  const res = await utils.getAxios().get("/clients/" + clientId);
  expect(res.data).toEqual({ id: clientId, name: clientName, logo: null });
});

test("current client storage info", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axios] = await utils.authAdmin(clientId);

  const res = await axios.get("/clients/current/storage-info");

  expect(res.data).toEqual({
    usedFileSize: 0,
    haveFilesMemoryLimit: false,
    filesMemoryLimit: res.data.filesMemoryLimitByte,
  });
});

test("update current client", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axios] = await utils.authAdmin(clientId);

  await axios.patch("/clients/current", { name: "new name" });
  const res = await axios.get("/clients/current");

  expect(res.status).toBe(200);
  expect(res.data.name).toEqual("new name");
});

test("update current client logo", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axios] = await utils.authAdmin(clientId);

  const image = await utils.getTestImageFormData();
  const logoRes = await axios.post("/clients/current/logo", image, { headers: image.getHeaders() });
  const afterUpdate = await axios.get("/clients/current");
  expect(afterUpdate.data.logo).toEqual(logoRes.data);
  await axios.delete("/clients/current/logo");
  const afterDelete = await axios.get("/clients/current");
  expect(afterDelete.data.logo).toEqual(null);
});
