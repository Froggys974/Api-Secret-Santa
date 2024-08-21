const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoute');
const groupRoutes = require('./src/routes/groupRoute');
const membershipRoutes = require('./src/routes/membershipRoute');
const secretSantaAssignmentRoutes = require('./src/routes/secretSantaAssignmentRoute');



require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

userRoutes(app);
groupRoutes(app);
membershipRoutes(app);
secretSantaAssignmentRoutes(app);


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
