exports.initClientDbConnection = async () => {
    
  try {
    console.log('URL_MONGO dans Render =', process.env.URL_MONGO);

    await mongoose.connect(process.env.URL_MONGO, clientOptions);
    console.log('Connecté');
  } catch (error) {
    console.log('Erreur connexion Mongo :', error);
    throw error;
  }
};
