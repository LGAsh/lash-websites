
const mongoose = require('mongoose');
const db = require('./db')
const Evnt = mongoose.model('Evnt');
const Evnts = mongoose.model('Events');

module.exports = function(app, passport){


    app.get('/', (req, res) => {
   /*     if(typeof(req.flash('error')[0]) === 'undefined'){
            const err = req.flash('error')[0];
            res.render('home', {error: err[0] + ''});
        }
        */
        res.render('home');
      });
      
    app.get('/login', (req, res) => {
      /*  if(req.flash('error')[0]){
            const err = req.flash('error')[0];
            res.render('home', {error: err[0] + ''});
        }
        */
        res.render('login');
      })

    app.get('/myevents', (req, res) => {
          console.log("\n\nMY EVENTS");
        let evts = [];
        if(!req.user){
            res.redirect('login');
        }
        Evnt.find({user: req.user}, function(err,store,count){
          store.forEach(element => {
              evts.push(element);
          });
        });
                       
        Evnts.find({user: req.user}, function(err,store1, count){
            res.render('events', {Events:store1, evt:evts});
        });

    
      
      });
      
      app.post('/events/create', (req, res) => {
          new Evnt({
            name: req.body.tit,
            date: req.body.date,
            time: req.body.time,
            user: req.user,
            comments: req.body.comment

          }).save(function(err){
            if(err){
              throw err;
            }
            res.redirect('/myevents');
          })
      });
      
      app.post('/events/gcreate', (req, res) => {
        const temp = new Evnts({
          name: req.body.gname,
          user: req.user,
        });
      
        for(let i = 1; i < 4; i++){
          if(req.body['gtit'+i]){
      
            const x = new Evnt({
              name: req.body['gtit'+i],
              date: req.body['gdate'+i],
              time: req.body['gtime'+i],
              user: req.user,
              comments: req.body['gcomment'+i]
            });
      
            temp.events.push(x);
          }
        }
      
        temp.save(function(err){
          if (err) throw err;
          res.redirect('/myevents');
        });
      
      });
      
 
      
    app.post('/register', passport.authenticate('local', {
        successRedirect: '/myevents',
        failureRedirect: '/',
        failureFlash: 'Username or password invalid'
      }));
      
   
      
    
      app.post('/login', passport.authenticate('local-login', { 
        successRedirect: '/myevents',
        failureRedirect: '/login' ,
        failureFlash: 'username or password is wrong'
    }))  /*, function(req, res, next){
        console.log(req.flash('error'));
        const err = req.flash('error');
        if(err[0] == true){
            res.render('login', {error: err[0]})
        }else{
            // validated
        } 

    });*/


    app.post('/logout', function(req, res){
        req.logout();
        req.session.destroy(function(err){
            console.log('session out');
            if (err){throw err};
            res.redirect('/');
        });

    });

    app.post('/del', function(req, res){

        console.log("\n\nDEL")
        let arr;
        let check;
        let id;
        console.log(req.body.del);
        if(Array.isArray(req.body.del)){
            arr = req.body.del;
            check = true
       }
       else{
           id = req.body.del;
           check = false;
       }

       Evnt.find({user: req.user}, function(err, store, count){
        if(check){
            for(let i = 0; i < arr.length; i++){
                store.forEach(ele =>{
                    if(ele._id == arr[i]){
                        ele.remove({_id: arr[i]});
                    }
                })
            }
        }

        else{
            store.forEach(ele =>{
                if (ele._id == id){
                    ele.remove({_id : id});
                }
            });
        }

        if(store){
            store.forEach(ele => {ele.save(function(err){
                if(err){
                    throw err;
                }
            });
        })
        }
        res.redirect('/myevents');
        });
    });


    app.post('/delgroup', function (req, res){
        console.log("\n\nDELETE EVENT GROUP");
        let arr;
        let check;
        let id;
        if(Array.isArray(req.body.gdel)){
            arr = req.body.gdel;
            check = true
       }
       else{
           id = req.body.gdel;
           check = false;
       }

       Evnts.find({user:req.user}, function (err,store,count){
            if(check){
                for(let i = 0; i < arr.length; i++){
                    store.forEach(ele =>{
                        if(ele._id == arr[i]){
                            ele.remove({_id: arr[i]});
                        }
                    })
                }
            }

            else{
                store.forEach(ele =>{
                    if (ele._id == id){
                        ele.remove({_id : id});
                    }
                });
            }

            if(store){
                store.forEach(ele => {ele.save(function(err){
                    if(err){
                        throw err;
                    }
                });
            })
            }
            res.redirect('/myevents');
       });


    })
      

      
}