const bookAppointment=(req,res)=>{
    res.send("booking new appointment using form and anything else");
}


const showAllAppointments=(req,res)=>{
    res.send("show all the ongoing or upcoming appointment / confirmed appointment or pending appointments");

}

const showAllPrescriptions=(req,res)=>{
    res.send("showing the proper prescription all text theory and medical infor withe the proper doses");
}


const patientInfo=(res,res)=>{
    res.send("showing the pateint details to the dashboard according to the patient id");
}


module.exports={
    bookAppointment,
    showAllAppointments,
    showAllPrescriptions,
    patientInfo
}   