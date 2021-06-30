//this is a function which helps to handle the pop appears on first screen.
async function loginHandler(tab){
    try{
        await tab.click('.loginModal.displayBlock.modalLogin.dynHeight.personal');
    }
    catch(err){
        return;
    }
}

module.exports = loginHandler;