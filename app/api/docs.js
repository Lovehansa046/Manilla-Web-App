// pages/api/docs.js
import swaggerSpec from '../../swagger';

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(swaggerSpec); // Отдаём спецификацию API
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}
