const { response } = require("express");
const bcryptjs=require('bcryptjs');
const Usuario=require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login=async (req, res=response)=>{

    const { correo, password }=req.body;

    try {

        //Verificar si el email existe
        const usuario= await Usuario.findOne({correo});
        if ( !usuario ){
            //aqui si hay que ponerlo porque si no sigue corriendo la aplicacion
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos'
            });
        }

        //Si el usuario esta activo
        //es lo mismo que poner usuario.estado===false
        if ( !usuario.estado ){
            //aqui si hay que ponerlo porque si no sigue corriendo la aplicacion
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos'
            });
        }

        //Verificar contraseña
        const validPassword=bcryptjs.compareSync(password, usuario.password); 
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            });
        }   

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        // si se quiere se pone el return aqui no es obligatorio
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }



    
}


module.exports= login

