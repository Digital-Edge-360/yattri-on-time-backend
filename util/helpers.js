
 const phoneValidator=(phone)=>{
    let Regx=new RegExp(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/);
    return Regx.test(phone);
 }


 const formatPhone=(phone)=>{
    let ph=phone.toString().length;
    if(ph==10)
        return `+91${phone}`;
    else if(ph==12){
        return `+${phone}`;
    }
    else if(ph==11){
        let temp=`+91${phone.toString().substring(1,10)}`;
        return temp;
    }
    else{
        return phone;
    }
 }
 module.exports={phoneValidator,formatPhone}