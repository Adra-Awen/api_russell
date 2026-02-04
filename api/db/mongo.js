const mongoose = require('mongoose');

const clientOptions = {
    dbName : 'apinode'
};

exports.initClientDbConnection = async () => {
  try {
    const uri = 'bauvaisn_db_user:gJnZnvERsSgTDqVe@portrussel.s9mvii2.mongodb.net/?appName=portRussel';

    await mongoose.connect(uri, clientOptions);
    console.log('Connecté');
  } catch (error) {
    console.log('Erreur connexion Mongo :', error);
    throw error;
  }
};