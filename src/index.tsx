import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { appendHighlights } from "./appendHighlights";

const main = () => {
  console.log("logseq-writegood-plugin loaded");

  // Get each block on the page (need recursive)
  // Check each block and highlight errors
  // Create section at the end
  // Insert suggestions
  // How to actually handle multiple edits - maybe can ignore a particular section header

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
        "## Suggestions",
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
