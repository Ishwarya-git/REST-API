const express = require('express');
// Validate input using express-validator
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fs = require('fs');

router.post('/addUser', [
  body('userid').isInt().withMessage('UserId must be an integer'),
  body('username')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .matches(/^[A-Za-z]+$/).withMessage('Name must contain only letters'),
  body('dob').isDate().withMessage('Invalid date format'),
  body('profession').isString().withMessage('Profession must be a string')
], (req, res) => {
  

  const { userid, username, dob, profession } = req.body;
  const newuser = {
    userid: userid,
    username: username,
    dob: dob,
    profession: profession
  };
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  fs.readFile('users.json', 'utf8', function (err, data) {
    // if (!err) {
    //   return res.status(500).json({ error: 'Internal server error' });
    // }
    let users = {};
    if (data) {
      users = JSON.parse(data);
    }
    users[userid] = newuser;
    const updateUser = JSON.stringify(users);
    res.end(updateUser);
    
    fs.writeFile("users.json", updateUser, function (err) {
      res.end(JSON.stringify(data));
    });
  });

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }


});

router.post('/particularuser', [body('userid').isInt().withMessage('UserId must be an integer')], function (req, res) {
  const { userid } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // if (!userid) {
  //   return res.status(400).json({ error: 'Userid is required' });
  // }
fs.readFile("users.json", "utf8", function (err, data) {

    var users = JSON.parse(data);
    var user = users[req.body.userid];
    if (!user) {
      return res.status(400).json({ error: 'Userid is not found.  Please check your  userid is correct' });
    }
    console.log(user);
    res.end(JSON.stringify(user));
  })

})
router.post('/deleteuser', [body('userid').isInt().withMessage('UserId must be an integer')], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  fs.readFile("users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    let user =data[req.body.userid];
    if (!user) {
      return res.status(400).json({ error: 'Userid is not found.  Please check your  userid is correct' });
    }
    delete data[req.body.userid];
    console.log(data);
    
    var updateuser = JSON.stringify(data);
    fs.writeFile("users.json", updateuser, function (err) {
      res.end(JSON.stringify(data));
    })
  })
})
router.get('/showAll', function (req, res) {
  fs.readFile("users.json", "utf8", function (err, data) {
    console.log(data);
    res.end(data)
  })
})
module.exports = router;

