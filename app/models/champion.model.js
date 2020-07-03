module.exports = (sequelize, Sequelize) => {
    const Champion = sequelize.define("champions",{
        title: {
            type: Sequelize.STRING
          },
          peran: {
            type: Sequelize.STRING
          },
          description: {
            type: Sequelize.STRING
          },
          published: {
            type: Sequelize.BOOLEAN
        },
      
    });

    return Champion;
};