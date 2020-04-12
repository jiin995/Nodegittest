var express = require('express');
var router = express.Router();
const git = require('simple-git');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('git', { title: 'Git Test' });
});

router.get('/pull', function (req, res, next) {
    var URL = req.query.url;
    var repo = ""
    var surl = URL.split('/');
    var repoName = surl[surl.length - 1];
    var username = req.query.username.replace(" ","");
    var token = req.query.token.replace(" ","");
    var sshKeyPath = req.query.sshkeypath.replace(" ","");
    var remote = ""
    var GIT_SSH_COMMAND = "ssh -oStrictHostKeyChecking=no -i "
    var silent = true;

    console.log('Action: PULL');
    console.log('URL: '+URL);
    console.log('RepoName: '+repoName);

    if(sshKeyPath){
        GIT_SSH_COMMAND += sshKeyPath ;
        git().env({ ...process.env, GIT_SSH_COMMAND }).silent(silent)
            .clone(URL, "./testrepos/" + repoName, ['-q'], (err) => {
                if(err)
                    console.error(err);
                else
                    console.log("Finished");
            });
    }
    //If user setting username and token i will try to clone repo with basic auth
    else {
        if (username && token) {
            console.log("Username: " + username);
            console.log("Token: " + token);
            if (URL.includes("https://")) {
                repo = URL.replace("https://", "");
                remote = `https://${username}:${token}@${repo}`;
            }
        } else
            remote = URL;

        git().silent(silent).clone(URL, "./testrepos/" + repoName, ['-q'], (err) => {
                //console.error('failed: ', err.message);
                //console.log("erroType: ",typeof err.message)
                if (err.includes("not read Username") || err.includes("Permission denied") ) {
                    console.error("Auth error")
                }
                else
                    console.log("Finished")
            });
    }
    res.redirect('/git');

})
module.exports = router;
