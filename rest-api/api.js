const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = express();
const porta = 3000;


const router = express.Router();
const galeriaRouter = require('./router/GaleriaRouter.js');


api.use(cors());

api.use(bodyParser.urlencoded({
	extended:true
}));


api.use('./public', express.static(__dirname+'/public'));


router.get('/', (req, resp) => {
	 resp.json({
		 mensagem:'=> API Online...'
	 });
});

api.use('/galeria', galeriaRouter);
api.use('/', router);



api.listen(porta);
console.log("Run api...");