const db = require("../models");
const Champion =db.champions;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

//create and save
exports.create = (req, res) => {
    // validate request
    if (!req.body.title) {
        res.status(400).send({
            status : false,
            message : "Cannot be empty !"
        });

        return;
    }

    //create object field
    const champion = {
        title :  req.body.title,
        description : req.body.description,
        peran : req.body.peran,
        published: req.body.published ? req.body.published : false,
        userId : req.body.userId
    };

    //save
    Champion.create(champion)
    .then(
        data => {

            res.send(data);
        })
    .catch(err => {
            res.status(500).send({
                status: false,
                message : err.message || "something error while creating data"
        });
    });

};


// retrieve all 
exports.findAll = (req, res) => {
    const title =  req.query.title;
    var condition = title ? {title : {[Op.like] : `%${title}%`}} :  null;

    Champion.findAll({where : condition})
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            status : false,
            message : err.message || "something error while retrieving data"
        });
    });
};



//find a single
exports.findOne =  (req, res) => {
    const id = req.params.id;

    Champion.findByPk(id)
    .then(data => {
        res.send(data);
        })
    .catch(err => {
        res.status(500).send({
            status:false,
            message : err.message || "something error while retrieving data with id = "+id
        });
    });

};

//update data
exports.update =  (req, res) => {
    const id = req.params.id;

    Champion.update(req.body,{
        where : {id : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status : true,
                message : "Champion was updated successfully !"
            });
        } else {
            res.send({
                status : false,
                message : `Cannot update Champion with id= ${id}. 
                Maybe champion was not found or request is empty.
                `
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status : false,
            message : `Error updating Champion with id = ${id}`
        });
    })
};

// delete single 
exports.delete = (req, res) => {
    const id = req.params.id;

    Champion.destroy({
        where : {id : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status : true,
                message : "Champion was deleted successfully !"
            });
        } else {
            res.send({
                status : false,
                message : `Cannot delete Champion with id= ${id}. 
                Maybe champion was not found or request is empty.
                `
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status : false,
            message : `Error deleting Champion with id = ${id}`
        });
    })
};

// delete single 
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    Champion.destroy({
        where : {userId : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status : true,
                message : "Champions  was deleted successfully !"
            });
        } else {
            res.send({
                status : false,
                message : `Cannot delete Champion with id= ${id}. 
                Maybe champion was not found or request is empty.
                `
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status : false,
            message : `Error deleting Champion with id = ${id}`
        });
    })
};

// delete all 
exports.deleteAll =  (req, res) => {
    Champion.destroy({
        where : {},
        truncate : false
    })
    .then(nums => {
        res.send({
            status : true,
            message : `${nums} Champions were deleted successfully`
        });

    })
    .catch(err => {
        res.status(500).send({
            status :false,
            message : err.message || `Some error occured while removing all championss`
        });
    });
};

//find all published
exports.findAllPublished = (req, res) => {
    User.hasMany(Champion, {foreignKey: 'id'})
    Champion.belongsTo(User, {foreignKey: 'userId'})
    Champion.findAll({where : {published :  true}, include: [{ model: User, attributes: ['username'] }]},{raw: true})
    .then( data => {
        const dat = data.map(dt => {
            //tidy up the user data
            return Object.assign(
              {},
              {
                id: dt.id,
                title: dt.title,
                description: dt.description,
                peran: dt.peran,
                username :  dt.user.username,
                createdAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                    
                  }).format(dt.createdAt),
                updatedAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                  }).format(dt.updatedAt),
                published : dt.published
              });
            });
        res.send(dat);
    })
    .catch( err => {
        res.status(500).send({
            message :  err.message ||  `Some error occured while removing all champions`
        });
    });
};

//find all by user
exports.findAllUser = (req, res) => {
    const userId = req.params.id;
    Champion.findAll({where : {userId :  userId}})
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            message :  err.message ||  `Some error occured while removing all champions`
        });
    });
};



//find all published
exports.findChampionUser = (req, res) => {
    User.hasMany(Champion, {foreignKey: 'id'})
    Champion.belongsTo(User, {foreignKey: 'userId'})
    Champion.findAll({attributes: ['title', sequelize.fn('COUNT', sequelize.col('userId'))], include: [{ model: User, attributes: ['username'] }], 
    group: ['userId','title','description','peran']},{raw: true})
    .then( data => {
        const dat = data.map(dt => {
            //tidy up the user data
            return Object.assign(
              {},
              {
                id: dt.id,
                title: dt.title,
                description: dt.description,
                peran:dt.peran,
                username :  dt.user.username,
                createdAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                    
                  }).format(dt.createdAt),
                updatedAt : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    timeZone: 'Asia/Jakarta',
                   
                  }).format(dt.updatedAt),
                published : dt.published
              });
            });
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            message :  err.message ||  `Some error occured while removing all champions`
        });
    });
};