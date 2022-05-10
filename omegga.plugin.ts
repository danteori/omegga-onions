import OmeggaPlugin, { OL, PS, PC } from 'omegga';
import { BrickInteraction } from '../omegga-test/omegga';

type Config = { foo: string };
type Storage = { bar: string };

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    // Write your plugin!
    this.omegga.on('cmd:test', (speaker: string) => {
      this.omegga.broadcast(`Hello, ${speaker}!`);
    });

    this.omegga.on('interact', (interaction: BrickInteraction) => {
      if(interaction.message == 'killUser'){
        let player = this.omegga.findPlayerByName(interaction.player.name);
        player.kill();
        Omegga.middlePrint(player.name, "<emoji>dead</>");
      }
    });

    return { registeredCommands: ['test'] };
  }

  async stop() {
    // Anything that needs to be cleaned up...
  }
}
