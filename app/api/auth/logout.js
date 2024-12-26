import {destroyCookie} from 'nookies'

export default function handler(req, res) {
    // Удаляем токен, передавая соответствующие параметры
    destroyCookie({res}, 'token', {
        path: '/', // Путь должен быть тот же, что использовался при установке куки
        // В production также можно добавить параметр Secure, если работает через HTTPS
        ...(process.env.NODE_ENV === 'production' ? {secure: true} : {})
    });

    res.status(200).json({message: 'Token removed'});
}
