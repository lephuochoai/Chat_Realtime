const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const KEY_ACCESS = require('../../config/keyAccessToken.config')


module.exports.signUp = (req, res) => {
    console.log(req.body);
    
    const email = req.body.email;
    const pass = req.body.pass;
    const name = req.body.name;

    User.findOne({'email': email}, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                err: 'Có lỗi xảy ra khi tìm User'
            })
        }
        if(user) {
            return res.status(500).json({
                err: 'Email đã được sử dụng'
            })
        } else {
            let newUSer = new User({
                email: email,
                pass: bcrypt.hashSync(pass),
                name: name,
                status: 200
            })
            newUSer.save((err, doc) => {
                if(err) {
                    console.log(err);
                    return res.status(404).json({
                        err: 'Có lỗi xảy ra khi lưu User'
                    })
                }
                return res.status(200).json({
                    doc: 'Đã đăng ký thành công',
                    user: doc
                });
            })
            
        }
    })
} 


module.exports.login = (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    
    User.findOne({'email': email}, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                err: 'Có lỗi xảy ra khi tìm User'
            })
        }
        if(!user) {
            return res.status(500).json({
                err: 'Không tìm thấy User'
            })
        }
        if(bcrypt.compareSync(pass, user.pass) === false) {
            return res.status(500).json({
                err: 'Mật khẩu không chính xác'
            })
        } else {
            var token = jwt.sign({
                email: user.email,
                _id: user._id
            }, KEY_ACCESS.key, { expiresIn: '3h' } )
            return res.status(200).json({access_token: token});
        }
    })    
}

module.exports.checkID = (req, res) => {
    const id = req.body.id;
    console.log('Đang kiểm tra id: '+id);

    User.findById(id, (err, doc) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                err: 'Có lỗi xảy ra khi tìm User'
            })
        }
        if(!doc) {
            console.log('Không tìm thấy User');            
            return res.status(500).json({
                err: 'Không tìm thấy User'
            })
        } else {
            console.log('Tìm thấy User');            
            return res.status(200).json({
                doc: 'User được tìm thấy'
            })
        }
    })
}