import OmeggaPlugin, { OL, PS, PC } from 'omegga';
import { BrickInteraction } from '../omegga-test/omegga';

type Config = { foo: string };
type Storage = { bar: string, coinstore: Map<string, number>};

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

    const coinName: string = 'Onion Coin';

    // Write your plugin!
    this.omegga.on('cmd:count', (speaker: string, target: string) => {
      let player = Omegga.findPlayerByName(target);
      Omegga.middlePrint(speaker, `${player.name} has ${getCoins(player.name)} coins.`);
      
    });

    /*
    this.omegga.on('cmd:leaderboard', (speaker: string) => {

    });
    */

    this.omegga.on('cmd:givecoin', (speaker: string, target: string, quantity: string) => {
      let source = Omegga.findPlayerByName(speaker);
      if(source.isHost()){
        let destination = Omegga.findPlayerByName(target);
        let num = parseInt(quantity);
        if(isNaN(num)){
          Omegga.middlePrint(source, `${num} is not a valid integer.`);
        } else {
          giveCoin(destination.name, num);
          Omegga.middlePrint(source, `You have given ${destination.name} ${coinName} x${num}.`);
        }
      }
    });

    this.omegga.on('interact', (interaction: BrickInteraction) => {
      
      if(interaction.message == 'killUser'){
        let player = this.omegga.findPlayerByName(interaction.player.name);
        player.kill();
        Omegga.middlePrint(player.name, "<emoji>dead</>");
      }
    });

    async function giveCoin(target: string, quantity: number){
      let data = await this.store.get('coinstore');
      let total = quantity;
      if(data.has(target)){
        total += data.get(target);
      }
      data.set(target, total);
      await this.store.set('coinstore', data);
    }

    async function getCoins(target: string){
      let data = await this.store.get('coinstore');
      if(data.has(target)){
        return data.get(target);
      } else {
        return 0;
      }
    }

    return { registeredCommands: ['test'] };
  }

  async stop() {
    // Anything that needs to be cleaned up...
  }
}
