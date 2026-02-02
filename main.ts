import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { readCounter, writeCounter } from "./storage";
import { trackEvent } from "./analytics";

interface VaultOpsOrphanFinderSettings {
  enableAnalytics: boolean;
}

const DEFAULT_SETTINGS: VaultOpsOrphanFinderSettings = {
  enableAnalytics: false
};

export default class VaultOpsOrphanFinderPlugin extends Plugin {
  settings: VaultOpsOrphanFinderSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addCommand({
      id: "vault-ops-orphan-finder-run-sample-command",
      name: "Vault Ops - Orphan Finder: Run sample command",
      callback: () => {
        new Notice("Vault Ops - Orphan Finder is active.");
      }
    });

    const currentCount = await readCounter(this);
    await writeCounter(this, currentCount + 1);
    trackEvent("plugin_loaded", { slug: "vault-ops-orphan-finder" });
    this.addSettingTab(new VaultOpsOrphanFinderSettingTab(this.app, this));
  }

  onunload(): void {
    // no-op
  }

  async loadSettings(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

}

class VaultOpsOrphanFinderSettingTab extends PluginSettingTab {
  plugin: VaultOpsOrphanFinderPlugin;

  constructor(app: App, plugin: VaultOpsOrphanFinderPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Enable analytics events")
      .setDesc("Store simple usage counters locally.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAnalytics)
          .onChange(async (value) => {
            this.plugin.settings.enableAnalytics = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
