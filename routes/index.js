const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use("/homepage", require('./homepage'))
router.use("/product", require('./product'))
// router.use('/farmer', require('./farmer'));

router.get("/", (req,res) => {
    res.redirect('/user/login');
})

router.get("/logout",(req,res) => {
  const sess = req.session;
  if(sess.user) {
    req.session.destroy();
  }
  res.redirect("/user/login");
})

module.exports = router;