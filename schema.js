const Joi = require('joi');

const listingSchema =Joi.object({
    listing :Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),

    }).required(),
});
module.exports=listingSchema;


const reviewSchema =Joi.object({
    review :Joi.object({
        rating:Joi.number().required().min(1).max(5),
        Comment:Joi.string().required(),
    }).required(),
});

module.exports=reviewSchema;



//  //========================================== ROUGH PART =======================
// app.post("/api/courses", (req, res) => {
//      const name = { name: req.body.name }; 
//      const schema = Joi.object({
//          name: Joi.string().min(3).required() 
//         });
//      const result = schema.validate(name); 
//      if (result.error) { 
//         res.status(400).send(result.error.details[0].message); 
//     }
// });