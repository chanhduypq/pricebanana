var User = require(__dirname + '/models/user');
var Product = require(__dirname + '/models/product');
var TrackingPrice = require(__dirname + '/models/tracking_price');
var helper = require(__dirname + '/helpers/functions');

module.exports = function(app){

    //GET price banana history
    app.get('/', function (req, res) {
        res.send('Pending..');
    });

    app.get('/create_price/:domain/:id/:price/:price_date', function (req, res) {
        var domain = req.params.domain;
        var id = req.params.id;
        if(domain != 'qoo10') {
            return res.send('Wrong domain name');
        }
        var product_id = domain+'_'+id;
        var price = req.params.price;
        var price_date = req.params.price_date;
        if(domain && id && price) {
            Product.findOne({product_id: product_id}, function (error, product) {
                if (error) {
                    res.send('Can\'t find product');
                } else {
                    if(!price_date) {
                        price_date = helper.get_today();
                    }
                    if (product === null) {
                        var price_histories = [
                            { date: price_date, price: price }
                        ];
                        var productData = {
                            product_id: product_id,
                            price_history: JSON.stringify(price_histories)
                        };
                        Product.create(productData, function (error, product) {
                            if (error) {
                                res.send('Can not create product');
                            } else {
                                res.send('Created product id = '+product._id);
                            }
                        });
                    } else {
                        var price_histories = JSON.parse(product.price_history);
                        var find = false;
                        for(var i=0; i<price_histories.length;i++) {
                            if(price_histories[i].date == price_date) {
                                price_histories[i].price = price;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            price_histories.push({date: price_date, price: price});
                        }
                        Product.findOneAndUpdate({ "_id" : product._id }, {price_history: JSON.stringify(helper.sort_price_history(price_histories))}, function (err, product) {
                            if (error) {
                                res.send('Can not update product');
                            } else {
                                res.send('Updated product id = '+product._id);
                            }
                        });
                    }
                }
            });
        } else {
            res.send('Not enough data');
        }
    });

    app.get('/banana/:domain/:id', function (req, res) {
        var domain = req.params.domain;        
        var id = req.params.id;
        if(domain != 'qoo10') {
            return res.send('Wrong domain name');
        }
        var product_id = domain+'_'+id;
        Product.findOne({product_id: product_id}, function (error, product) {
            if (error) {
                res.send('Can\'t find product');
            } else {
                if (product === null) {
                    res.send('Don\'t find product');
                } else {
                    var price_histories = JSON.parse(product.price_history);
                    User.findById(req.session.userId).exec(function (error, user) {
                        var user_email = '';
                        var current_price = 500;
                        var tracked_price = 500;
                        if (error) {} else {
                            if (user === null) {} else {
                                user_email = user.email;
                                tracked_price = 333;
                            }
                        }
                        return res.render('banana', {
                            price_history:helper.build_price_history(price_histories),
                            user_email: user_email,
                            current_price: current_price,
                            tracked_price: tracked_price
                        });
                    });
                }
            }
        });
    });
    
    app.get('/tracking/:domain/:id/:tracked_price', function (req, res) {
        var domain = req.params.domain;
        var id = req.params.id;
        var tracked_price = req.params.tracked_price;
        if(domain != 'qoo10') {
            var obj = {success:false};
            return res.send(JSON.stringify(obj));
        }
        var product_id = domain+'_'+id;
        var user_id = req.session.userId;
        TrackingPrice.findOne({product_id: product_id,user_id:user_id}, function (error, trackingPrice) {
            if (error) {
                var obj = {success:false};
                return res.send(JSON.stringify(obj));
            } else {
                
                if (trackingPrice === null) {
                    var trackingPriceData = {
                        product_id: product_id,
                        user_id: user_id,
                        tracked_price: tracked_price
                    };
                    TrackingPrice.create(trackingPriceData, function (error, trackingPrice) {
                        if (error) {
                            var obj = {success:false};
                            return res.send(JSON.stringify(obj));
                        } else {
                            var obj = {success:true};
                            return res.send(JSON.stringify(obj));
                        }
                    });
                } else {
                    TrackingPrice.findOneAndUpdate({ "_id" : trackingPrice._id }, {tracked_price: tracked_price}, function (err, product) {
                        if (error) {
                            var obj = {success:false};
                            return res.send(JSON.stringify(obj));
                        } else {
                            var obj = {success:true};
                            return res.send(JSON.stringify(obj));
                        }
                    });
                }
            }
        });
    });

    //POST route for updating data
    app.post('/login', function (req, res) {
        var err = '';
        // confirm that user typed same password twice
        if (req.body.password !== req.body.passwordConf) {
            if(req.body.is_ajax) {
                var obj = {success:false,message:"Passwords do not match."};
                return res.send(JSON.stringify(obj));
            } else {
                return res.send("Passwords do not match");
            }
        }

        if (req.body.email &&
            req.body.username &&
            req.body.password &&
            req.body.passwordConf) {
            // register
            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConf
            };
            User.findOne({email: req.body.email}, function (error, user) {
                if (error) {
                    if(req.body.is_ajax) {
                        var obj = {success:false,message:"Can not create user"};
                        return res.send(JSON.stringify(obj));
                    } else {
                        return res.send("Can not create user");
                    }
                } else {
                    if (user === null) {
                        User.findOne({username: req.body.username}, function (error, user) {
                            if (error) {
                                if (req.body.is_ajax) {
                                    var obj = {success:false,message:"Can not create user"};
                                    return res.send(JSON.stringify(obj));
                                } else {
                                    return res.send("Can not create user");
                                }
                            } else {
                                if (user === null) {
                                    User.create(userData, function (error, user) {
                                        if (error) {
                                            if (req.body.is_ajax) {
                                                var obj = {success: false, message: "Can not create user"};
                                                return res.send(JSON.stringify(obj));
                                            } else {
                                                return res.send("Can not create user");
                                            }
                                        } else {
                                            if (req.body.is_ajax) {
                                                var obj = {success: true};
                                                req.session.userId = user._id;
                                                return res.send(JSON.stringify(obj));
                                            } else {
                                                req.session.userId = user._id;
                                                return res.redirect('/');
                                            }
                                        }
                                    });
                                } else {
                                    if (req.body.is_ajax) {
                                        var obj = {success: false, message: "Username was existed"};
                                        res.send(JSON.stringify(obj));
                                    } else {
                                        return res.send("Username was existed.");
                                    }
                                }
                            }
                        });
                    } else {
                        if (req.body.is_ajax) {
                            var obj = {success: false, message: "Email was existed"};
                            res.send(JSON.stringify(obj));
                        } else {
                            return res.send("Email was existed.");
                        }
                    }
                }
            });
        } else if (req.body.logemail && req.body.logpassword) {
            // login
            User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                if (error || !user) {
                    if(req.body.is_ajax) {
                        var obj = {success:false,message:"Wrong email or password."};
                        return res.send(JSON.stringify(obj));
                    } else {
                        return res.send("Wrong email or password.");
                    }
                } else {
                    req.session.userId = user._id;
                    if(req.body.rememberme) {
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                    } else {
                        req.session.cookie.expires = false; // Cookie expires at end of session
                    }
                    if(req.body.is_ajax) {
                        var obj = {success:true};
                        obj.tracked_price = 450;
                        res.send(JSON.stringify(obj));
                    } else {
                        return res.redirect('/');
                    }
                }
            });
        } else {
            if(req.body.is_ajax) {
                var obj = {success:false,message:'All fields required.'};
                res.send(JSON.stringify(obj));
            } else {
                res.send('All fields required.');
            }
        }
    });

    // GET for logout
    app.get('/logout', function (req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    res.send('Something went wrong');
                } else {
                    return res.redirect('/');
                }
            });
        }
    });
}