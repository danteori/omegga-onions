import OmeggaPlugin, { OL, PS, PC } from 'omegga';
import { BrickInteraction } from '../omegga-test/omegga';

type Config = { foo: string };
type Storage = { [key: string]: CoinData};
type CoinData = { coins: number };

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

    const coinName: string = 'Onioncoin';

    this.omegga.on

    // Write your plugin!
    this.omegga.on('cmd:count', async (speaker: string, target: string) => {
      let player = Omegga.findPlayerByName(target);
      Omegga.whisper(speaker, `${player.name} has ${await this.getCoins(player.id)} coins.`);
      
    });

    /*
    this.omegga.on('cmd:leaderboard', (speaker: string) => {

    });
    */

    this.omegga.on('cmd:givecoin', async (speaker: string, target: string, quantity: string) => {
      let source = Omegga.findPlayerByName(speaker);
      if(source.isHost()){
        let destination = Omegga.findPlayerByName(target);
        let num = parseInt(quantity);
        if(destination == null){
          Omegga.whisper(source, `Could not find a player with name <color="ffff00">${destination}</>.`);
        } else if(isNaN(num)){
          Omegga.whisper(source, `<color="ffff00">${num}</> is not a valid integer.`);
        } else {
          await this.giveCoin(destination.id, num);
          Omegga.whisper(source, `You have given <color="ffff00">${num} ${coinName}</> to <color="ffff00">${destination.name}</>.`);
          Omegga.whisper(target, `You have received <color="ffff00">${num} ${coinName}</> from <color="ffff00">${source.name}</>.<br>You now have <color="ffff00">${await this.getCoins(destination.id)} ${coinName}</>.`);
        }
      }
    });

    this.omegga.on('interact', (interaction: BrickInteraction) => {
      
      if(interaction.message == 'killUser'){
        let player = this.omegga.findPlayerByName(interaction.player.name);
        player.kill();
        Omegga.whisper(player, "<emoji>dead</>");
      }
    });

    

    return { registeredCommands: ['count', 'givecoin'] };
  }

  async stop() {
    // Anything that needs to be cleaned up...
  }

  async giveCoin(target: string, quantity: number){
    let data = await this.store.get('coins_' + target);
    if(data == null){
      data = {coins: 0};
    }
    data.coins += quantity;
    await this.store.set('coins_' + target, data);
  }

  async getCoins(target: string){
    let data = await this.store.get('coins_' + target);
    if(data == null){
      data = {coins: 0};
    }
    return data.coins;
  }
}
