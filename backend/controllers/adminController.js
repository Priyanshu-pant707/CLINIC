
const addDoctor=(req,res)=>{
res.send("hello from the clinic admin routes adding doctor");
}

const addPatient=(req,res)=>{
    res.send("adding patient");
}

const showDoctor=(req,res)=>{
    res.send("showing the list of all the doctor present in the clinic");
}

const showPatient=(req,res)=>{
    res.send("showing the all patient list wih their information");
}






module.exports={
    addDoctor,
    addPatient,
    showDoctor,
    showPatient
}