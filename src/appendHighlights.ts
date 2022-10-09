import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import writeGood from "write-good";

const updateBlocks = async (
  b: BlockEntity,
  suggestion: any[],
  newContent: string,
  suggestionsBlock: BlockEntity,
  preferredFormat: string
) => {
  if (suggestion.length === 1) {
    // Add suggestion to suggestions block
    if (preferredFormat === "markdown") {
      await logseq.Editor.insertBlock(
        suggestionsBlock.uuid,
        `${suggestion[0].reason} [${logseq.settings.suggestionRefChar}](${b.uuid})`,
        { sibling: false, before: false }
      );
    } else {
      await logseq.Editor.insertBlock(
        suggestionsBlock.uuid,
        `${suggestion[0].reason} [[${b.uuid}][${logseq.settings.suggestionRefChar}]]`,
        { sibling: false, before: false }
      );
    }

    if (!b.properties?.id) {
      await logseq.Editor.upsertBlockProperty(b.uuid, "id", b.uuid);
    }

    // insert first "=="
    newContent =
      newContent.slice(0, suggestion[0].index) +
      "==" +
      newContent.slice(suggestion[0].index);

    // insert second "=="
    newContent =
      newContent.slice(0, suggestion[0].index + suggestion[0].offset + 2) +
      "==" +
      newContent.slice(suggestion[0].index + suggestion[0].offset + 2);

    await logseq.Editor.updateBlock(b.uuid, newContent);
  } else if (suggestion.length > 1) {
    for (let i = 0; i < suggestion.length; i++) {
      // Add suggestion to suggestions block
      if (preferredFormat === "markdown") {
        await logseq.Editor.insertBlock(
          suggestionsBlock.uuid,
          `${suggestion[i].reason} [${logseq.settings.suggestionRefChar}](${b.uuid})`,
          { sibling: false, before: false }
        );
      } else {
        await logseq.Editor.insertBlock(
          suggestionsBlock.uuid,
          `${suggestion[i].reason} [[${b.uuid}][${logseq.settings.suggestionRefChar}]]`,
          { sibling: false, before: false }
        );
      }

      if (!b.properties?.id) {
        await logseq.Editor.upsertBlockProperty(b.uuid, "id", b.uuid);
      }

      // insert first "=="
      newContent =
        newContent.slice(0, suggestion[i].index + i * 4) +
        "==" +
        newContent.slice(suggestion[i].index + i * 4);

      // insert second "=="
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
};

export const appendHighlights = async (
  arr: BlockEntity[],
  suggestionsBlock: BlockEntity,
  preferredFormat: string
) => {
  for (const b of arr) {
    const suggestion = writeGood(b.content);
    let newContent = b.content;

    await updateBlocks(
      b,
      suggestion,
      newContent,
      suggestionsBlock,
      preferredFormat
    );

    if (b.children.length > 0) {
      await appendHighlights(
        b.children as BlockEntity[],
        suggestionsBlock,
        preferredFormat
      );
    } else {
      continue;
    }
  }
};
