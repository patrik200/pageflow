import axios from "axios";

import { TestUtils } from "tests";

test("get profile as user", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axios, { userId }] = await utils.authUser(clientId);

  const res = await axios.get("/users/profile");
  expect(res.data).toEqual({
    id: userId,
    avatar: null,
    canDelete: false,
    canRestore: false,
    canUpdate: true,
    name: "USER",
    phone: "",
    position: "USER",
    role: "user",
    email: "user@pageflow.ru",
  });
});

test("get profile as admin", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axios, { adminId }] = await utils.authAdmin(clientId);

  const res = await axios.get("/users/profile");
  expect(res.data).toEqual({
    id: adminId,
    avatar: null,
    canDelete: false,
    canRestore: false,
    canUpdate: true,
    name: "ADMIN",
    phone: "",
    position: "ADMIN",
    role: "admin",
    email: "admin@pageflow.ru",
  });
});

test("get another user as user", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();
  const [axiosCurrentUser] = await utils.authUser(clientId);
  const [, { adminId: anotherUserId }] = await utils.authAdmin(clientId);

  const res = await axiosCurrentUser.get(`/users/${anotherUserId}/profile`);

  expect(res.data.id).toBe(anotherUserId);
  expect(res.data.canDelete).toBe(false);
  expect(res.data.canRestore).toBe(false);
  expect(res.data.canUpdate).toBe(false);
});

test("another user as admin", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();

  const [axiosCurrentUser] = await utils.authAdmin(clientId);
  const [, { userId: anotherUserId }] = await utils.authUser(clientId);

  const res = await axiosCurrentUser.get(`/users/${anotherUserId}/profile`);

  expect(res.data.id).toBe(anotherUserId);
  expect(res.data.canDelete).toBe(true);
  expect(res.data.canRestore).toBe(false);
  expect(res.data.canUpdate).toBe(true);
});

test("delete user by admin", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();

  const [axiosCurrentUser] = await utils.authAdmin(clientId);
  const [, { userId: anotherUserId }] = await utils.authUser(clientId);

  await axiosCurrentUser.delete(`/users/${anotherUserId}`);

  const afterDelete = await axiosCurrentUser.get(`/users/${anotherUserId}/profile`);

  expect(afterDelete.data.id).toBe(anotherUserId);
  expect(afterDelete.data.canDelete).toBe(false);
  expect(afterDelete.data.canRestore).toBe(true);
  expect(afterDelete.data.canUpdate).toBe(true);

  await axiosCurrentUser.post(`/users/${anotherUserId}/restore`);

  const afterRestore = await axiosCurrentUser.get(`/users/${anotherUserId}/profile`);

  expect(afterRestore.data.id).toBe(anotherUserId);
  expect(afterRestore.data.canDelete).toBe(true);
  expect(afterRestore.data.canRestore).toBe(false);
  expect(afterRestore.data.canUpdate).toBe(true);
});

test("update user", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();

  const [axiosAdmin, { adminId }] = await utils.authAdmin(clientId);
  const [axiosUser, { userId }] = await utils.authUser(clientId);

  await axiosUser.patch(`/users/${userId}/profile`, {
    name: "hello",
    position: "world",
    phone: "+79890001122",
    password: "1234",
  });

  const image = await utils.getTestImageFormData();
  const imageRes = await axiosUser.post(`/users/${userId}/profile/avatar`, image, { headers: image.getHeaders() });

  const profileAfterUpdate = await axiosUser.get(`/users/${userId}/profile`);
  expect(profileAfterUpdate.data.avatar).toEqual(imageRes.data);
  expect(profileAfterUpdate.data.name).toEqual("hello");
  expect(profileAfterUpdate.data.position).toEqual("world");
  expect(profileAfterUpdate.data.phone).toEqual("+79890001122");

  await axiosUser.delete(`/users/${userId}/profile/avatar`);
  const profileAfterDeleteAvatar = await axiosUser.get(`/users/${userId}/profile`);
  expect(profileAfterDeleteAvatar.data.avatar).toEqual(null);

  try {
    await axiosUser.patch(`/users/${adminId}/profile`, {});
    throw new Error();
  } catch (e) {
    if (!axios.isAxiosError(e)) throw e;
  }

  try {
    await axiosUser.patch(`/users/${userId}/profile`, { email: "other@yandex.ru" });
    throw new Error();
  } catch (e) {
    if (!axios.isAxiosError(e)) throw e;
  }

  await axiosAdmin.patch(`/users/${userId}/profile`, { email: "other@yandex.ru" });

  try {
    await axiosUser.patch(`/users/${userId}/profile`, { role: "admin" });
    throw new Error();
  } catch (e) {
    if (!axios.isAxiosError(e)) throw e;
  }

  await axiosAdmin.patch(`/users/${userId}/profile`, { role: "admin" });
});

test("users list", async () => {
  const utils = new TestUtils();
  const { clientId } = await utils.createClient();

  const [axiosUser] = await utils.authUser(clientId);

  const userListRes = await axiosUser.get(`/users/list`);
  expect(userListRes.data.list.length).toBe(2);

  const userListSearchRes = await axiosUser.get(`/users/list?search=user`);
  expect(userListSearchRes.data.list.length).toBe(1);
});
