const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band( 'Nirvana' ));
bands.addBand( new Band( 'Foo Fighters' ));
bands.addBand( new Band( 'Michael Jackson' ));
bands.addBand( new Band( 'The Killers' ));


//Mensajes de socket
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('bandas-activas', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'})
    });

    client.on('emitir-mensaje', (payload) => {
        console.log(payload)
        //io.emit('nuevo-mensaje', payload); //emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); //emite a todos menos al que lo emitio
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('bandas-activas', bands.getBands());
    });

    client.on('add-band', (payload) => {
        console.log('Nueva banda: ', payload.name);
        bands.addBand(new Band(payload.name));
        io.emit('bandas-activas', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        console.log('Borrando banda banda: ', payload.id);
        bands.deleteBand(payload.id);
        io.emit('bandas-activas', bands.getBands());
    });
});