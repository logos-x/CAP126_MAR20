var express = require('express');
var router = express.Router();
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let UserController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constant = require('../utils/constants');
const { check_authentication, check_authorization } = require('../utils/check_auth');
let {validate, validationSigningUp} = require('../utils/validator')
let multer = require('multer');
let path = require('path');

let avatarDir = path.join(__dirname, '../avatars');
let pathAvatarDir = "http://localhost:3000/users/avatars/";


// 218060541 - Tran Quang Tai


router.get('/', check_authentication, check_authorization(constant.MOD_PERMISSION), async function (req, res, next) {
    try {
      let users = await userController.GetAllUser();
      CreateSuccessRes(res, 200, users);
    } catch (error) {
      next(error)
    }
});

router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    let userID = req.user.id;
    let currentUser = await UserController.GetUserById(userID);
    if (currentUser.role === constant.ADMIN_PERMISSION || currentUser.id === req.params.id) {
      let user = await UserController.GetUserById(req.params.id);
      CreateSuccessRes(res, 200, user);
    } else {
      CreateErrorRes(res, 403, "You are not authorized to access this resource");
    }
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

router.post('/', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let newUser = await UserController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await UserController.UpdateUser(req.params.id,req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await userController.DeleteUser(req.params.id);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
});


//storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => cb(null,
    (new Date(Date.now())).getTime() + "-" + file.originalname
  )
})
//upload
let upload = multer({
  storage: storage,
  fileFilters: (req, file, cb) => {
    if (!file.mimetype.match(/image/)) {
      cb(new Error('tao chi nhan anh? thoi'))
    } else {
      cb(null, true)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})


router.post('/change_avatar',check_authentication, upload.single('avatar'), 
async function (req, res, next) {
  try {
    if (!req.file) {
      throw new Error("khong co file anh chai oi")
    } else {
      let formData = new FormData();
      let pathFile = path.join(avatarDir, req.file.filename);
      formData.append('avatar', fs.createReadStream(pathFile))
      let result = await axios.post(cdnURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      fs.unlinkSync(pathFile)
      req.user.avatarUrl = result.data.data;
      await req.user.save()
      CreateSuccessRes(res, 200, result.data.data)
    }

  } catch (error) {
    next(error)
  }
})
router.get('/avatars/:filename', function (req, res, next) {
  let filename = req.params.filename;
  let pathfile = path.join(avatarDir, filename)
  res.status(200).sendFile(pathfile)
})


module.exports = router;
