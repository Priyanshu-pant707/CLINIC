const getAllAppointments=(req,res)=>{
    res.send("will show the all apointments scheduled for today");
}

const setPrescription=(req,res)=>{
    res.send("give prescription based on the pattient id");
}


const showAllPatients=(req,res)=>{
    res.send("shwoing the details of the patient associated to the particular doctor");
}


module.exports={
    getAllAppointments,
    setPrescription,
    showAllPatients
};