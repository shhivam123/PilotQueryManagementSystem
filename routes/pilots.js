var express = require('express');
var moment = require('moment');
var router = express.Router();
var connection  = require('../lib/db');
 
 
/* GET home page. */
router.get('/', function(req, res, next) {
      
 connection.query('SELECT * FROM pilot_query ORDER BY id desc',function(err,rows)     {
 
        if(err){
         req.flash('error', err); 
         res.render('pilots',{page_title:"Pilots - Node.js",data:''});   
        }else{
            
            res.render('pilots',{page_title:"Pilots - Node.js",data:rows});
        }
                            
         });
        
    });
 
 
// SHOW ADD USER FORM
router.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('pilots/add', {
        title: 'Add New Pilots',
        name: '',
        email: ''        
    })
})
 
// ADD NEW USER POST ACTION
router.post('/add', function(req, res, next){    
    //req.assert('query', 'Name is required').notEmpty()           //Validate name
    //req.assert('email', 'A valid email is required').isEmail()  //Validate email
  
    var errors = req.validationErrors()
     
    if( !errors ) {   //No errors were found.  Passed Validation!
         
     
        var user = {
            query_type: req.sanitize('query_type').escape().trim(),
            message: req.sanitize('message').escape().trim(),
            query_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            other_data: req.sanitize('other_data').escape().trim()
        }
         
     connection.query('INSERT INTO pilot_query SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to views/user/add.ejs
                    res.render('pilots/add', {
                        title: 'Add New Pilots',
                        query_type: user.query_type,
                        message: user.message,
                        query_time:user.query_time,
                        other_data:user.other_data,                  
                    })
                } else {                
                    req.flash('success', 'Data added successfully!');
                    res.redirect('/pilots');
                }
            })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
         
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('pilots/add', { 
            title: 'Add New Pilots',
            query_type: req.body.query_type,
            message: req.body.message,
            query_time: req.body.query_time,
            other_data: req.body.other_data
        })
    }
})
 
// SHOW EDIT USER FORM
router.get('/edit/(:id)', function(req, res, next){
   
connection.query('SELECT * FROM pilot_query WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
             
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Pilots not found with id = ' + req.params.id)
                res.redirect('/pilots')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('pilots/edit', {
                    title: 'Edit Pilots', 
                    //data: rows[0],
                    id: rows[0].id,
                    query_type: rows[0].query_type,
                    message: rows[0].message,
                    other_data: rows[0].other_data                    
                })
            }            
        })
  
})
 
// EDIT USER POST ACTION
router.post('/update/:id', function(req, res, next) {
 //   req.assert('name', 'Name is required').notEmpty()           //Validate nam           //Validate age
  //  req.assert('email', 'A valid email is required').isEmail()  //Validate email
  
    var errors = req.validationErrors()
     
    if( !errors ) {   
 
        var user = {
            query_type: req.sanitize('query_type').escape().trim(),
            message: req.sanitize('message').escape().trim(),
            query_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            other_data: req.sanitize('other_data').escape().trim()
        }
         
connection.query('UPDATE pilot_query SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to views/user/add.ejs
                    res.render('pilots/edit', {
                        title: 'Edit Pilots',
                        id: req.params.id,
                        query_type:req.body.query_type,
                        message:req.body.message,
                        query_time:req.body.query_time,
                        other_data:req.body.other_data
 
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    res.redirect('/pilots');
                }
            })
         
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
         
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('pilots/edit', { 
            title: 'Edit Pilots',            
            id: req.params.id, 
            query_type:req.body.query_type,
            message:req.body.message,
            query_time:req.body.query_time,
            other_data:req.body.other_data
        })
    }
})
       
// DELETE USER
router.get('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
     
connection.query('DELETE FROM pilot_query WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/pilots')
            } else {
                req.flash('success', 'Pilots deleted successfully! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/pilots')
            }
        })
   })
 
 
module.exports = router;