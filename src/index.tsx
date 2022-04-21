import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import writeGood from "write-good";

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

      for (const b of pageBT) {
        const suggestion = writeGood(b.content);
        console.log(suggestion);
        let newContent = b.content;
        if (suggestion.length === 1) {
          // Get reason and insert into reason array and get UUID for scrolling in future
          // Highlight error;

          // insert first "=="
          newContent =
            newContent.slice(0, suggestion[0].index) +
            "==" +
            newContent.slice(suggestion[0].index);

          // insert second "=="
          newContent =
            newContent.slice(
              0,
              suggestion[0].index + suggestion[0].offset + 2
            ) +
            "==" +
            newContent.slice(suggestion[0].index + suggestion[0].offset + 2);

          await logseq.Editor.updateBlock(b.uuid, newContent);
        } else if (suggestion.length > 1) {
          // handle if suggestion is more than 1, then need a way to track the number of characters added.
          let count = 0;
          for (let i = 0; i < suggestion.length; i++) {
            newContent =
              newContent.slice(0, suggestion[i].index + i * 4) +
              "==" +
              newContent.slice(suggestion[i].index + i * 4);

            newContent =
              newContent.slice(
                0,
                suggestion[i].index + suggestion[i].offset + 2 + i * 4
              ) +
              "==" +
              newContent.slice(
                suggestion[i].index + suggestion[i].offset + 2 + i * 4
              );
            await logseq.Editor.updateBlock(b.uuid, newContent);
          }
        }
      }
    },
  });

  logseq.App.registerUIItem("toolbar", {
    key: "logseq-writegood-plugin",
    template: `<a data-on-click="check" class="button"><i class="ti ti-language"></i></a>`,
  });
};

logseq.ready(main).catch(console.error);
