const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");
const cookieSession = require("cookie-session");
const users = require("./repositories/users");

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["hfi0437u8ygh9u3"], // encryption key
  })
);

app.get("/signup", (req, res) => {
  res.send(`
    <div>
      Your ID is: ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="password confirmation"/>
        <button>Sign up</button>
      </form>
    </div>
  `);
});

// NOT USED
// const bodyParser = (req, res, next) => {
//   if (req.method === "POST") {
//     req.on("data", (data) => {
//       const parsed = data.toString("utf8").split("&");
//       const formData = {};

//       for (let pair of parsed) {
//         const [key, value] = pair.split("=");
//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// };

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneUserBy({ email });
  // Check if user already exists
  if (existingUser) {
    return res.send(`Email ${email} is already taken`);
  }
  // Check if passwords match
  if (password !== passwordConfirmation) {
    return res.send(`Passwords must match`);
  }
  // Create a user in our user repo
  const user = await usersRepo.createUser({ email, password });
  // Store the id of that user inside the user's cookie
  req.session.userId = user.id; // added by cookie-session
  res.send("Account created");
});

app.get("/signin", (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password"/>
      <button>Sign in</button>
    </form>
  </div>
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneUserBy({ email });
  if (!user) {
    return res.send(`Email ${email} not found`);
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid password");
  }

  req.session.userId = user.id;
  res.send("You are signed in");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

app.listen(PORT, () => {
  console.log("Listening");
});
