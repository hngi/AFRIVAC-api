module.exports = class GenerateToken{
    constructor(expirTime){
        this.time = expirTime
    }

    generate(){
      const resetToken =  Math.floor(100000 + Math.random() * 900000);
    
      //console.log({ resetToken }, this.local.passwordResetToken);
       const resetExpires = Date.now() + `${this.time}` * 60 * 1000;
    
      return {resetToken,resetExpires};
    }
}

