// pages/api/swagger.json.js
import {swaggerSpec} from '../../swagger';

export default function handler(req, res) {
    res.status(200).json(swaggerSpec);
}
