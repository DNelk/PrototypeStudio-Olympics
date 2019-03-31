var controllers = require('./controllers');
var router = function(app){
    app.get("/", controllers.Client.display);
    app.post("/app", controllers.Client.display;)
};

module.exports = router;