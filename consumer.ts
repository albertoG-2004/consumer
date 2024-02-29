import amqp from 'amqplib';
import axios from 'axios';

async function getEvent() {
    const conn = await amqp.connect('amqp://luis:luis2004@18.214.233.56');
    const channel = await conn.createChannel();

    const exchange = 'clients.ex';

    await channel.assertExchange(exchange, 'direct', {durable: true});

    const queueName = 'clients';
    const queue = await channel.assertQueue(queueName, {exclusive: false});
    await channel.bindQueue(queue.queue, exchange, '');

    console.log('Listening events of RabbitMQ');

    channel.consume(queue.queue, async(mensaje)=>{
        if(mensaje !== null){
            console.log(`Message received: ${mensaje.content.toString()}`);
            try {
                const id = Number(mensaje.content);
                const response = await axios.post('https://api-hexagonal-2.onrender.com/registrations',{id_client:id, content:"Registrado"});
                // console.log("API response: ", response.data);
                
            } catch (error) {
                console.log("Error sending to API");   
            }
        }
    }, {noAck:true});
}
getEvent().catch(console.error);