import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { appendHighlights } from "./appendHighlights";
import { callSettings } from "./callSettings";

const main = () => {
  console.log("logseq-writegood-plugin loaded");

  callSettings();

  logseq.provideModel({
    async check() {
      const pageBT: BlockEntity[] =
        await logseq.Editor.getCurrentPageBlocksTree();

      if (pageBT === null) {
        logseq.App.showMsg(
          "This plugin cannot be used on the main homepage, i.e. running list of journal entries. Please click into a page and try again.",
          "error"
        );
        return;
      }

      const currPage = await logseq.Editor.getCurrentPage();

      const suggestionsBlock = await logseq.Editor.insertBlock(
        currPage.name,
        `${logseq.settings.suggestionBlk}`,
        { isPageBlock: true }
      );

      await appendHighlights(pageBT, suggestionsBlock);
    },
  });

  logseq.App.registerUIItem("toolbar", {
    key: "logseq-writegood-plugin",
    template: `<a data-on-click="check" class="button"><i class="ti ti-vocabulary"></i></a>`,
  });
};

logseq.ready(main).catch(console.error);
