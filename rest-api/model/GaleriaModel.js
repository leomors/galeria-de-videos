const db = require('../banco/dbConexao.js');

module.exports = class GaleriaModel{

	static getAll(callback){
		return db.query("SELECT * FROM galeria_video", callback);
	}

	static getId(id, callback){
		return db.query("SELECT * FROM galeria_video WHERE id_galeria = ?", [id], callback);
	}

	static adicionar(dados, callback){
		return db.query("INSERT INTO galeria_video(titulo, caminho) VALUES(?,?) ", [dados.titulo, dados.caminho], callback);
	}

	static editar(dados, callback){
		let sql;
		if(dados.caminho != null){
			sql = db.query("UPDATE galeria_video SET titulo = ?, caminho = ? WHERE id_galeria = ? ", [dados.titulo, dados.caminho, dados.id_galeria], callback);
		}else{
			sql = db.query("UPDATE galeria_video SET titulo = ? WHERE id_galeria = ? ", [dados.titulo, dados.id_galeria], callback);
		}

		return sql;
	}

	static deletar(id, callback){
		return db.query("DELETE FROM galeria_video WHERE id_galeria = ? LIMIT 1", [id], callback);
	}
	 
}