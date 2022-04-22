import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "suggestionBlk",
      type: "string",
      default: "## Suggestions",
      description:
        "Specifies the name of the suggestions block. Supports markdown.",
      title: "Change name of suggestions block",
    },
    {
      key: "suggestionRefChar",
      type: "string",
      default: "🔖",
      description:
        "Specifies the text or special character you want to use to click to go to the source block.",
      title: "Customise link",
    },
  ];

  logseq.useSettingsSchema(settings);
};
