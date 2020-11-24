const express = require('express');
const router = express.Router();
const galeriaModel = require('../model/GaleriaModel.js');

const RespostaClass = require('../model/RespostaClass.js');
let pastaPublica = './public/arquivos/';
let multer = require('multer');
let path = require('path');
let fs = require('fs');
let storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, pastaPublica)
	},
	filename:function(req, file, cb){
		// cb(null, file.fieldname+'-'+Date.now())
		let nomeArquivo = `${file.fieldname.replace(/\//g,'')}-${Date.now()}${path.extname(file.originalname)}`;
		req.body.caminho = pastaPublica+nomeArquivo;
		cb(null, nomeArquivo);
	}
});

let upload = multer({storage:storage});

function deletarArquivo(caminho){
	 if(caminho != null){
		 fs.unlinkSync(caminho);
	 }
}

router.get('/', function(req, resp, next){
	 let resposta = new RespostaClass();
	 galeriaModel.getAll(function(erro, retorno){
		 if(erro){
			 resposta.erro = true;
			 resposta.msg = "Ocorreu um erro.";
		 }else{
		 	resposta.dados = retorno;
		 }
		 	resp.json(resposta);
	 });
});

router.get('/:id?', function(req, resp, next){
	let resposta = new RespostaClass();
	galeriaModel.getId(req.params.id, function(erro, retorno){
		if(erro){
			resposta.erro = true;
			resposta.msg = "Ocorreu um erro ao executar consulta por 'id'!";
		}else{
			resposta.dados = retorno;
		}
		resp.json(resposta);
	})
});

router.post('/', upload.single('arquivo'), function(req, resp, next){
	let resposta = new RespostaClass();
	if(req.file != null){
		 
		galeriaModel.adicionar(req.body, function(erro, retorno){
			if(erro){
				resposta.erro = true;
				resposta.msg = "Ocorreu um erro ao inserir registro!";
				deletarArquivo(req.body.caminho);
			}else{
				if(retorno.affectedRows>0){
					resposta.msg = "Registro realizado com sucesso!";	
					// resposta.dados = retorno;
				}else{
					resposta.erro = true;
					resposta.msg = "Ocorreu um erro ao adicionar registro!";
					deletarArquivo(req.body.caminho);
				}
			}
			resp.json(resposta);
		});

	}else{
		resposta.erro = true;
		resposta.msg = "Ocorreu um erro ao inserir registro!";
		resp.json(resposta);
	}
	
});

router.put('/', upload.single('arquivo'), function(req, resp, next){
	 let resposta = new RespostaClass();
	 
	 
		 galeriaModel.editar(req.body, function(erro, retorno){
		 	if(erro){
		 		resposta.erro = true;
		 		resposta.msg = "Ocorreram erros ao editar registro!";
		 		deletarArquivo(req.body.caminho);
		 	}else{
				 if(retorno.affectedRows > 0 ){
				 	resposta.msg = "Registro editado com sucesso!";
				 }else{
				 	resposta.erro = true;
				 	resposta.msg = "Ocorreu um erro ao editar registro";
				 	deletarArquivo(req.body.caminho);
				 }
		 	}
		 	resp.json(resposta);
		 });
});


router.delete('/:id?', function(req, resp, next){
	let resposta = new RespostaClass();
	galeriaModel.deletar(req.params.id, function(erro, retorno){
		 if(erro){
		 	resposta.erro = true;
		 	resposta.msg = "Ocorreu um erro ao deletar registro!";
		 }else{
		 	if(retorno.affectedRows > 0 ){
		 		resposta.msg = "Registro deletado com sucesso!";
		 	}else{
		 		resposta.erro = true;
			 	resposta.msg = "Ocorreu um erro ao deletar registro!";
		 	}
		 }
		 resp.json(resposta);
	});
})


module.exports = router;