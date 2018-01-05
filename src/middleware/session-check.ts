import * as helper from '../functions/helpers';
import { ModRequest, ModResponse, PGOutput } from '../../typings/typings';
import { RequestHandler } from '../../node_modules/@types/express-serve-static-core/index'
import { db } from '../middleware/async-database';
import * as session from "express-session";
import * as express from "express";
const router = express.Router();


function check(req:Express.Request, res:ModResponse, next:Function) {
  if (req.session.user && req.sessionID) {
    db.query('SELECT sessionID FROM session WHERE user_uuid = $1', [req.session.user.uuid])
      .then((result) => {
        console.log(req.sessionID, result.rows[0].sessionid)
        if (result.rows[0].sessionid === req.sessionID) {
          next();
        } else {
          throw new Error ('incorrect session id')
        }
      })
      .catch((error) => {
        console.log(error.stack)
        helper.genError(res, 'login', "you were no longer logged in, try to log in again");
      })
  } else {
    req.session = null;
    helper.genError(res, 'login', "you were no longer logged in, try to log in again");
  }
}

export { check };
