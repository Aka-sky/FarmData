require('dotenv').config()
const express = require('express');
const session = require('express-session')
const ejs = require('ejs')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const faker = require('faker');
const userResolver = require('./resolvers/userResolver')
const productResolver = require('./resolvers/productResolvers')

faker.setLocale('en_IND');

const app = express()

//Session
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
    })
  );
  
app.set("view engine", "ejs");
app.set("views", "./public/views");

  //for parsing application json
app.use(bodyParser.json());

  //for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false }));

  //for parsing multipart/form-data
app.use(express.static("./public"));

app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 3000 
app.listen(PORT, () => {

  // bcrypt.hash('pass123',10,(err,password) => {
  //   console.log(password);
  // }) 

  // seedDBfarmersProducts();
  //   seedDBuyers();

    // console.log(faker.address.latitude())

    console.log(`Application started on ${PORT} in ${process.env.NODE_ENV} mode.`)
})

const seedDBfarmersProducts = () => {

  let category = ['friuts','seeds','grains','vegetables','herbs and spices','nuts'];

  let productNames = [
    ['Apples','Bananas','Oranges','Guava','Papaya','Water Melons','Lichi'],
    ['Cumin Seeds/ जीरा', 'Mustard Seeds/ सरसों', 'Fenugreek Seeds/ मेथी'],
    ['Rice','Wheat','Maize'],
    ['Cabbage/Patta gobhi', 'Carrot', 'Capsicum', 'Cauliflower', 'Mushroom', 'Okra'],
    ['Pudina', 'Turmeric', 'Lemon grass', 'White Lotus','Cardamom'],
    ['Walnuts','Cashew Nuts','Almonds', 'Pine Nuts', 'Picca Nuts']
  ];

  let units = ['kilogram','ton','unit'];

  // const farmers = [];

  for(let i = 0; i<10; i++) {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let username = faker.internet.userName(firstName,lastName);
    const farmer = {
      name: `${firstName} ${lastName}`,
      username: username,
      password: '$2b$10$7WG/pDppKYMFV3upIgWL7u.vuRMZxD88gOBdOKivMnG.gEb8MIUwq',
      phone: faker.phone.phoneNumber('##########'),
      email: faker.internet.exampleEmail(firstName,lastName),
      profileImageURL: '../images/profile-user.svg',
      latitude: faker.address.latitude(16,22),
      longitude: faker.address.longitude(73.5864, 81.5),
      userType: "farmer"
    }
  
    userResolver.addUser(farmer,'$2b$10$7WG/pDppKYMFV3upIgWL7u.vuRMZxD88gOBdOKivMnG.gEb8MIUwq')
      .then(result => {
        if(result) {
          for(let j=0; j<5; j++) {
  
            let catNum = faker.random.number(category.length - 1)
        
            let prodNum = faker.random.number(productNames[catNum].length - 1)
        
            let unitNum = faker.random.number(2);
        
            let price = faker.random.number({
              max: 5000,
              min: 50,
              precision: 0.5
            })
        
            const product = {
              category: category[catNum],
              name: productNames[catNum][prodNum],
              description: 'Fresh from the farm',
              condition: 'Great',
              unit: units[unitNum],
              price: price,
              productImageURL: '../images/plant.svg'
            }
        
            productResolver.addProduct({username}, product)
              .then(result => {
                console.log("product Added!")
              })
          }
        } else {
          // console.log(result)
          console.log("error")
        }
      })
  }
}

const seedDBuyers = () => {
  for(let i = 0; i<10; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let username = faker.internet.userName(firstName,lastName);
      const farmer = {
        name: `${firstName} ${lastName}`,
        username: username,
        password: '$2b$10$7WG/pDppKYMFV3upIgWL7u.vuRMZxD88gOBdOKivMnG.gEb8MIUwq',
        phone: faker.phone.phoneNumber('##########'),
        email: faker.internet.exampleEmail(firstName,lastName),
        profileImageURL: '../images/profile-user.svg',
        latitude: faker.address.latitude(16,22),
        longitude: faker.address.longitude(73.5864, 81.5),
        userType: "buyer"
      }
    
      userResolver.addUser(farmer,'$2b$10$7WG/pDppKYMFV3upIgWL7u.vuRMZxD88gOBdOKivMnG.gEb8MIUwq')
        .then(result => {
          console.log(`Added ${username}`)
        })
  }
}