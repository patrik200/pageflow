import { Page } from "@app/front-kit";

import SettingsView from "views/Settings";

import { DictionariesControlStorage } from "core/storages/dictionary/control";
import { SubscriptionStorage } from "core/storages/subscription";

class SettingsPage extends Page {
  constructor() {
    super(SettingsView, [DictionariesControlStorage, SubscriptionStorage]);
  }
}

const page = new SettingsPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
