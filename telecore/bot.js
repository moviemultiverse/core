async function TelecoreBot(){

//-----------------------------------FOR TELEGRAM AUTH BOT -------------------------------------------------------
const { get2redis } = require('../redis/redis_data.js');
const { get_telecore_data , search_telecore_data , set_telecore_data} = require('../mongodb/mongo.js');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN ;
const bot = new TelegramBot(token, { polling: true });
//https://github.com/yagop/node-telegram-bot-api/issues/406#issuecomment-1270573068
//https://t.me/blackhole_movie_bot?start=YT0xMjMmYj1nZGZnZC1nZGZnZGZnZGY
//btoa('a=123&b=gdfgd-gdfgdfgdf')
//convert the string to base64 param
bot.on('message', async (msg) => {
  const admin1 = await get2redis("admin1");
  const admin2 = await get2redis("admin2");
  console.log(msg);
  const chatId = msg.chat.id;
  if(msg.from.id == admin1 && msg.document.file_name != undefined && msg.message_id != undefined){
    console.log(msg.message_id, msg.document.file_name);
    const message_id = msg.message_id;
    const file_name = msg.document.file_name ;
    if(set_telecore_data({admin: admin1, message_id: message_id ,file_name: file_name}))
    bot.sendMessage(chatId,file_name + " saved successfully");
    }
  else if(msg.from.id == admin2 && msg.document.file_name != undefined && msg.message_id != undefined){
      console.log(msg.message_id, msg.document.file_name);
      const message_id = msg.message_id;
      const file_name = msg.document.file_name ;
      if(set_telecore_data({admin: admin1, message_id: message_id ,file_name: file_name}))
      bot.sendMessage(chatId,file_name + " saved successfully");
      }
    //bot count message_id on inc++ mode for each user
  else if((msg.from.id != admin1 || msg.from.id != admin2) && msg.text){
  try {
      const payload = msg.text.substring(6);
      if (payload.length) {
        const url = Buffer.from(payload, 'base64').toString();
        const params = Object.fromEntries(new URLSearchParams(url).entries());
        // Result: { a: '123', b: 'gdfgd-gdfgdfgdf' }
        console.log(params);
          try {
            console.log(params.text + "success");
            bot.sendMessage(chatId, 'success');
            const data1 = await search_telecore_data(params.text);
            console.log("data",data1);
            if(data1.admin== admin1 )
            bot.forwardMessage(chatId,  admin1 , data1.message_id);
            else
            bot.forwardMessage(chatId,  admin2 , data1.message_id);
            //dev1 [message id is from dev1<->bot]
          } catch (error) {
            console.error('Error fetching telecore data:', error);
            bot.sendMessage(chatId, 'An error occurred while fetching telecore data');
          }
    } else {
      console.warn('Received message without text:', msg);
      bot.sendMessage(chatId, 'Sorry ,'+ msg.from.first_name +' '+ msg.from.last_name +'\n Come Back Qutie:) 💜');
    }
  } catch (error) {
    console.error('Error in the message handler:', error);
    bot.sendMessage(msg.chat.id, 'An error occurred while processing your message');
  }}
});
//******************************************************************************************************************************* */

}


module.exports = { TelecoreBot };